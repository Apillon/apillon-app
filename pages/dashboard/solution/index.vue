<template>
  <Dashboard :loading="false">
    <template #heading>
      <Heading>
        <slot>
          <h3>{{ $t('dashboard.nav.solutions') }}</h3>
        </slot>
      </Heading>
    </template>
    <slot>
      <div class="pb-8">
        <div class="max-w-lg mb-8">
          <p class="text-body">{{ $t('dashboard.solutions.description') }}</p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <div v-for="(service, key) in services" :key="key" class="card-dark-multiple">
            <div class="card-dark flex flex-col justify-between p-8 h-full md:min-h-[24rem]">
              <div class="mb-8">
                <div class="flex items-center gap-2 mb-4">
                  <span class="text-2xl" :class="service.icon"></span>
                  <h5>{{ $t(`dashboard.solutions.${service.name}.name`) }}</h5>
                </div>
                <p class="text-body">
                  {{ $t(`dashboard.solutions.${service.name}.description`) }}
                </p>
              </div>
              <div>
                <div class="flex flex-wrap gap-2 mb-8">
                  <Pill
                    v-for="(item, key) in service.usage"
                    :key="key"
                    :color="{ borderColor: colors.violet, textColor: colors.violet }"
                    round
                  >
                    {{ item }}
                  </Pill>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <Btn
                    size="large"
                    type="secondary"
                    :disabled="service.disabled"
                    :to="{ name: service.link }"
                  >
                    {{ $t('auth.onboarding.viewDemo') }}
                  </Btn>
                  <Btn
                    size="large"
                    type="primary"
                    :disabled="service.disabled"
                    :to="{ name: service.link }"
                  >
                    {{ $t('auth.onboarding.getStarted') }}
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import colors from '~~/tailwind.colors';

type SolutionTypeItem = {
  id: number;
  name: string;
  icon: string;
  link: string;
  disabled?: boolean | null;
  usage: String[];
};
const { t } = useI18n();
useHead({
  title: t('dashboard.nav.solutions'),
});

const authStore = useAuthStore();

const services: Array<SolutionTypeItem> = [
  {
    name: 'nftCollection',
    icon: 'icon-self-hosted-nft',
    link: 'dashboard-service-nft',
    disabled: !isFeatureEnabled(Feature.NFT, authStore.getUserRoles()),
    usage: translateItems('dashboard.solutions.nftCollection.usage'),
  },
  {
    name: 'nftAirdrop',
    icon: 'icon-nft-mint-airdrop',
    link: 'dashboard-service-nft',
    disabled: !isFeatureEnabled(Feature.NFT_AIRDROP, authStore.getUserRoles()),
    usage: translateItems('dashboard.solutions.nftAirdrop.usage'),
  },
  {
    name: 'nftPoap',
    icon: 'icon-poap',
    link: 'dashboard-service-nft',
    disabled: !isFeatureEnabled(Feature.NFT_ATTENDANCE, authStore.getUserRoles()),
    usage: translateItems('dashboard.solutions.nftPoap.usage'),
  },
  {
    name: 'nftLoyalty',
    icon: 'icon-loyalty-program',
    link: 'dashboard-service-nft',
    disabled: !isFeatureEnabled(Feature.NFT_LOYALTY, authStore.getUserRoles()),
    usage: translateItems('dashboard.solutions.nftLoyalty.usage'),
  },
  {
    name: 'nftMembership',
    icon: 'icon-brand-membership',
    link: 'dashboard-service-nft',
    disabled: !isFeatureEnabled(Feature.NFT_MEMBERSHIP, authStore.getUserRoles()),
    usage: translateItems('dashboard.solutions.nftMembership.usage'),
  },
  {
    name: 'nftDrop',
    icon: 'icon-nft-drop',
    link: 'dashboard-service-nft',
    disabled: !isFeatureEnabled(Feature.NFT_DROP, authStore.getUserRoles()),
    usage: translateItems('dashboard.solutions.nftDrop.usage'),
  },
  {
    name: 'wallet',
    icon: 'icon-wallet',
    link: 'dashboard-service-nft',
    disabled: !isFeatureEnabled(Feature.NON_CUSTODIAL_WALLET, authStore.getUserRoles()),
    usage: translateItems('dashboard.solutions.wallet.usage'),
  },
  {
    name: 'fileSharing',
    icon: 'icon-file-sharing',
    link: 'dashboard-service-nft',
    disabled: !isFeatureEnabled(Feature.FILE_SHARING, authStore.getUserRoles()),
    usage: translateItems('dashboard.solutions.fileSharing.usage'),
  },
  {
    name: 'tokenGating',
    icon: 'icon-token-gating',
    link: 'dashboard-service-nft',
    disabled: !isFeatureEnabled(Feature.TOKEN_GATING, authStore.getUserRoles()),
    usage: translateItems('dashboard.solutions.tokenGating.usage'),
  },
];
</script>
