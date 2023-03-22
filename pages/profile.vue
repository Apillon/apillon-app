<template>
  <Dashboard :loading="authStore.loadingProfile">
    <template #heading>
      <Heading>
        <slot>
          <h4>{{ $t('profile.mySettings') }}</h4>
        </slot>
      </Heading>
    </template>
    <slot>
      <!-- Edit user profile -->
      <FormUserProfile />

      <div class="pb-8">
        <!-- Change password -->
        <n-h5 prefix="bar">{{ $t('profile.password') }}</n-h5>
        <FormPasswordResetRequest :email="authStore.email">
          {{ $t('profile.changePassword') }}
        </FormPasswordResetRequest>

        <!-- Wallet Connect -->
        <AuthWalletConnect />

        <!-- 2FA -->
        <template
          v-if="isFeatureEnabled(Feature.TWO_FACTOR_AUTHENTICATION, authStore.getUserRoles())"
        >
          <n-h5 class="mb-0" prefix="bar">{{ $t('profile.2fa') }}</n-h5>
          <p class="mb-6">{{ $t('profile.2faText') }}</p>
          <Btn type="secondary">{{ $t('profile.setup2fa') }}</Btn>
        </template>

        <!-- Discord -->
        <template v-if="isFeatureEnabled(Feature.DISCORD, authStore.getUserRoles())">
          <template v-if="discordLink">
            <n-h5 class="mb-0" prefix="bar">{{ $t('profile.discord.titleConnected') }}</n-h5>
            <p class="mb-6">{{ $t('profile.discord.infoConnected') }}</p>
            <Btn type="error" :loading="loadingDiscord" @click="discordDisconnect">
              {{ $t('profile.discord.disconnect') }}
            </Btn>
          </template>
          <template v-else>
            <n-h5 class="mb-0" prefix="bar">{{ $t('profile.discord.titleDisconnected') }}</n-h5>
            <p class="mb-6">{{ $t('profile.discord.infoDisconnected') }}</p>
            <Btn type="secondary" :loading="loadingDiscord" @click="discordConnect">
              {{ $t('profile.discord.connect') }}
            </Btn>
          </template>
        </template>
      </div>

      <!-- Modal - Change password -->
      <modal v-model:show="showModalChangePassword" :title="$t('profile.changePassword')">
        <FormPassword :token="authStore.jwt" @submit-success="passwordChanged" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const loadingDiscord = ref<boolean>(false);

useHead({
  title: $i18n.t('profile.mySettings'),
});

onMounted(async () => {
  await settingsStore.getOauthLinks();
});

const discordLink = computed(() => {
  return (
    (settingsStore.hasOauthLinks &&
      settingsStore.oauthLinks.find(
        (link: OauthLinkInterface) =>
          link.user_uuid === authStore.userUuid && link.type === OauthLinkType.DISCORD
      )) ||
    null
  );
});

/** Modal Change password */
const showModalChangePassword = ref(false);

/** Close modal after password has been changed */
function passwordChanged() {
  setTimeout(() => {
    showModalChangePassword.value = false;
  }, 2000);
}

/** Connect Discord account */
async function discordConnect() {
  loadingDiscord.value = true;

  const discordLink = await settingsStore.getDiscordLink();
  window.open(discordLink, '_self');

  loadingDiscord.value = false;
}

/** Discord Disconnect */
async function discordDisconnect() {
  loadingDiscord.value = true;
  try {
    await $api.post(endpoints.discordDisconnect);

    removeDiscordFromOauthList(discordLink.value?.externalUserId);
    message.success($i18n.t('profile.discord.disconnected'));
  } catch (error) {
    /** Show error message */
    message.error(userFriendlyMsg(error));
  }
  loadingDiscord.value = false;
}

function removeDiscordFromOauthList(externalUserId?: string) {
  if (!externalUserId) return;

  settingsStore.oauthLinks = settingsStore.oauthLinks.filter(
    item => item.externalUserId !== externalUserId
  );
}
</script>
