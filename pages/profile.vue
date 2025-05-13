<template>
  <Dashboard :loading="authStore.loadingProfile">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('profile.mySettings') }}</h1>
        </slot>

        <template #submenu>
          <MenuProfile />
        </template>
      </Heading>
    </template>
    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <!-- Discord -->
        <template v-if="isFeatureEnabled(Feature.DISCORD, authStore.getUserRoles())">
          <div class="card-light flex justify-between gap-8 p-8 mobile:flex-wrap">
            <div class="md:max-w-lg">
              <template v-if="discordLink">
                <h3 class="mb-2">{{ $t('profile.discord.titleConnected') }}</h3>
                <p class="mb-6 text-body">{{ $t('profile.discord.infoConnected') }}</p>
                <Btn type="error" :loading="loadingDiscord" @click="discordDisconnect">
                  {{ $t('profile.discord.disconnect') }}
                </Btn>
              </template>
              <template v-else>
                <h3 class="mb-2">{{ $t('profile.discord.titleDisconnected') }}</h3>
                <p class="mb-6 text-body">{{ $t('profile.discord.infoDisconnected') }}</p>
                <Btn :color="colors.discord" :loading="loadingDiscord" @click="discordConnect">
                  <span class="text-white">{{ $t('profile.discord.connect') }}</span>
                </Btn>
              </template>
            </div>
            <div class="flex items-end">
              <NuxtIcon name="dashboard/discord" class="icon-auto" filled />
            </div>
          </div>
        </template>
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { colors } from '~/tailwind.config';

const { t } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const loadingDiscord = ref<boolean>(false);

useHead({
  title: t('profile.mySettings'),
});

onMounted(async () => {
  await settingsStore.getOauthLinks();
});

const discordLink = computed(() => {
  return (
    (settingsStore.hasOauthLinks &&
      settingsStore.oauthLinks.find(
        (link: OauthLinkInterface) => link.user_uuid === authStore.userUuid && link.type === OauthLinkType.DISCORD
      )) ||
    null
  );
});

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
    message.success(t('profile.discord.disconnected'));
  } catch (error) {
    /** Show error message */
    message.error(userFriendlyMsg(error));
  }
  loadingDiscord.value = false;
}

function removeDiscordFromOauthList(externalUserId?: string) {
  if (!externalUserId) return;

  settingsStore.oauthLinks = settingsStore.oauthLinks.filter(item => item.externalUserId !== externalUserId);
}
</script>
