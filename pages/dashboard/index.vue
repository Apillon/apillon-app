<template>
  <Dashboard class="-mt-8" :loading="authStore.loadingProfile" :learn-collapsible="false">
    <slot>
      <div class="mb-8">
        <h4>{{ $t('dashboard.onboarding.welcome') }}</h4>
        <div class="mb-10 mt-8 flex gap-4">
          <div class="flex flex-col justify-between gap-8 rounded-lg bg-violet p-6 text-bg lg:w-5/12">
            <div>
              <h4>{{ $t('dashboard.onboarding.banner.title') }}</h4>
              <span class="text-sm">{{ $t('dashboard.onboarding.banner.content') }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <div class="flex items-center gap-2">
                <img
                  src="~/assets/images/dashboard/cpo.png"
                  class="h-11 w-11 rounded-full"
                  width="42"
                  height="42"
                  alt="CPO at Apillon"
                />
                <div class="flex flex-col">
                  <strong>Nino Kutnjak</strong>
                  <span>CPO at Apillon</span>
                </div>
              </div>
              <Btn
                class="!text-bg-dark no-underline"
                type="link"
                inner-class="flex gap-2 items-center"
                @click="show = true"
              >
                <span class="icon-video text-xl text-bg-dark"></span>
                <strong>{{ $t('dashboard.youTube.play') }}</strong>
              </Btn>
            </div>
          </div>

          <div class="flex flex-col gap-4 rounded-lg bg-bg-light p-6 lg:w-1/4">
            <NuxtIcon name="dashboard/token" class="text-4xl" filled />
            <h4>{{ $t('dashboard.onboarding.banner.token') }}</h4>
            <p>{{ $t('dashboard.onboarding.banner.tokenInfo') }}</p>
            <Btn href="https://www.apillon.io/token">{{ $t('general.learnMore') }}</Btn>
          </div>

          <div class="flex flex-col gap-6 text-sm lg:w-1/3">
            <div class="flex items-center justify-between">
              <strong>{{ $t('dashboard.usage.title') }}</strong>
              <Btn class="font-bold no-underline" type="link" :to="{ name: 'dashboard-payments' }">
                <template v-if="paymentStore.hasActiveSubscription">
                  {{ $t('dashboard.payment.managePlan') }}
                </template>
                <template v-else>
                  {{ $t('dashboard.payment.upgradePlan') }}
                </template>
              </Btn>
            </div>
            <StorageProgress
              :label="$t('dashboard.usage.bytesStored')"
              :size="storageStore.info.usedStorage"
              :max-size="storageStore.info.availableStorage"
              :unit="$t('general.total')"
              wrap
            />
            <StorageProgress
              :label="$t('dashboard.subscription.bandwidth')"
              :size="storageStore.info.usedBandwidth"
              :total-size="storageStore.info.availableBandwidth"
              :unit="$t('general.month')"
              wrap
            />
          </div>
        </div>
        <ModalYT
          v-model:show="show"
          video-id="qQJnuvUo-xo"
          :chapters="[
            { time: '00:00', title: 'Intro' },
            { time: '00:35', title: 'Dashboard' },
            { time: '02:53', title: 'NFT Collection' },
            { time: '05:20', title: 'Minting' },
            { time: '07:15', title: 'Website' },
          ]"
        />

        <!-- Services-->
        <h4 class="mb-8">{{ $t('dashboard.onboarding.servicesTitle') }}</h4>

        <div class="mb-8 grid grid-cols-billing gap-4">
          <CardService v-for="(service, key) in onboardingServices" v-bind="service" :key="key" />
        </div>

        <!-- Resources-->
        <SolutionOverview />

        <hr class="my-8 border-bg-lighter" />

        <!-- Services-->
        <h4 class="mb-8">{{ $t('general.explore') }}</h4>

        <div class="grid grid-cols-billing gap-4">
          <div v-for="(service, key) in services" :key="key" class="card-dark flex flex-col justify-between p-8">
            <div class="flex items-center justify-between text-white">
              <strong>{{ service.title }}</strong>
              <NuxtLink
                v-if="service.link"
                :to="{ name: service.link }"
                class="inline-flex-cc h-10 w-10 rounded-full transition-colors duration-300 hover:bg-bg-lighter"
              >
                <span class="icon-wide-right text-xl"></span>
              </NuxtLink>
            </div>
            <div class="mt-4">
              <p>{{ service.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <modal v-model:show="dataStore.project.showOnboarding" class="hide-header" size="small">
        <OnboardingSteps />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const authStore = useAuthStore();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const { onboardingServices } = useService();

const show = ref<boolean>(false);

const pageTitle = useState('pageTitle', () => t('dashboard.homepage'));
pageTitle.value = t('dashboard.homepage');

useHead({
  title: t('dashboard.homepage'),
});

const services = [
  {
    title: t('dashboard.nav.services'),
    content: t('dashboard.service.info'),
    link: 'dashboard-service',
  },
  // {
  //   title: t('dashboard.nav.smartContracts'),
  //   content: t('smartContracts.info'),
  // },
  {
    title: t('dashboard.nav.solutions'),
    content: t('dashboard.solution.info'),
    link: 'dashboard-solution',
  },
];
</script>
