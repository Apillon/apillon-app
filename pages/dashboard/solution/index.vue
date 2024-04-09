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
          <p>{{ $t('dashboard.solutions.description') }}</p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <div v-for="(service, key) in solutions" :key="key" class="card-dark-multiple">
            <div class="card-dark flex flex-col justify-between p-8 h-full md:min-h-[24rem]">
              <div class="mb-8">
                <div class="flex items-center gap-2 mb-4">
                  <span class="text-2xl" :class="service.icon"></span>
                  <h5>{{ $t(`dashboard.solutions.${service.name}.name`) }}</h5>
                </div>
                <p>
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
                    :disabled="!service.github"
                    :href="service.github"
                  >
                    {{ $t('dashboard.solutions.viewCode') }}
                  </Btn>
                  <Btn
                    size="large"
                    type="primary"
                    :disabled="!service.link"
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
import colors from '~/tailwind.colors';

type SolutionTypeItem = {
  name: string;
  icon: string;
  link?: string;
  github?: string;
  usage: String[];
};
const { t } = useI18n();
useHead({
  title: t('dashboard.nav.solutions'),
});

const solutions: Array<SolutionTypeItem> = [
  {
    name: SolutionKey.NFT_AIRDROP,
    icon: 'icon-nft-mint-airdrop',
    link: 'dashboard-solution-airdrop',
    github: 'https://github.com/Apillon/ps-email-airdrop',
    usage: translateItems('dashboard.solutions.nftAirdrop.usage'),
  },
  {
    name: SolutionKey.NFT_EMAIL_SIGNUP_AIRDROP,
    icon: 'icon-nft-drop',
    link: 'dashboard-solution-email-signup-airdrop',
    github: 'https://github.com/Apillon/ps-email-signup-airdrop',
    usage: translateItems('dashboard.solutions.nftEmailSignupAirdrop.usage'),
  },
  {
    name: SolutionKey.NFT_POAP,
    icon: 'icon-poap',
    link: 'dashboard-solution-proof-of-attendance',
    github: 'https://github.com/Apillon/ps-proof-of-attendance',
    usage: translateItems('dashboard.solutions.nftPoap.usage'),
  },
  {
    name: SolutionKey.NFT_WHITELIST_CLAIM,
    icon: 'icon-gift',
    link: 'dashboard-solution-whitelist-claim',
    github: 'https://github.com/Apillon/ps-whitelist-claim',
    usage: translateItems('dashboard.solutions.nftMembership.usage'),
  },
  {
    name: SolutionKey.OPEN_GOV,
    icon: 'icon-brand-membership',
    link: 'dashboard-solution-openGov',
    github: 'https://github.com/Apillon/ps-wasm-proposal-airdrop',
    usage: translateItems('dashboard.solutions.openGov.usage'),
  },
];
</script>
