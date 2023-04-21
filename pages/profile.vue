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
        <!-- Referral -->
        <template v-if="isFeatureEnabled(Feature.REFERRAL, authStore.getUserRoles())">
          <div class="card-dark p-8 flex gap-8 justify-between mobile:flex-wrap">
            <div class="md:max-w-lg">
              <h3 class="mb-4">{{ $t('referral.banner.hello') }}</h3>
              <p class="text-body mb-6">
                {{ $t('referral.banner.description') }}
              </p>
              <Btn type="primary" size="large" @click="enterReferral()">
                {{ $t('referral.banner.btn') }}
              </Btn>
            </div>

            <!-- User points -->
            <n-space class="body-md" size="large">
              <n-space
                class="card-border pr-3 whitespace-nowrap"
                size="large"
                align="center"
                :wrap="false"
              >
                <div class="h-10 p-2 rounded-full transition-all duration-300 hover:bg-bg-lighter">
                  <NuxtIcon name="referral/spendable-points" class="icon-auto" filled />
                </div>
                <span>{{ $t('referral.xpPoints') }}</span>
                <strong class="text-base text-blue">{{ referralStore.balance_all }}</strong>
              </n-space>
              <n-space
                class="card-border pr-3 whitespace-nowrap"
                size="large"
                align="center"
                :wrap="false"
              >
                <div class="h-10 p-2 rounded-full transition-all duration-300 hover:bg-bg-lighter">
                  <NuxtIcon name="referral/xp-points" class="icon-auto" filled />
                </div>
                <span>{{ $t('referral.spendingPoints') }}</span>
                <strong class="text-base text-pink">{{ referralStore.balance }}</strong>
              </n-space>
            </n-space>
          </div>
        </template>

        <!-- Discord -->
        <template v-if="isFeatureEnabled(Feature.DISCORD, authStore.getUserRoles())">
          <div class="card-light p-8 flex gap-8 justify-between mobile:flex-wrap">
            <div class="md:max-w-lg">
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

  <!-- Modal Referral -->
  <modal v-model:show="showModalRefferal" :title="$t('referral.enter.header')">
    <ReferralAcceptTerms />
  </modal>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import colors from '~~/tailwind.colors';

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const referralStore = useReferralStore();
const showModalRefferal = ref(false);
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

function enterReferral() {
  if (!termsAccepted.value) {
    showModalRefferal.value = true;
  } else {
    router.push('/dashboard/referral');
  }
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
