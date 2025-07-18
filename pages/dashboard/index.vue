<template>
  <Dashboard :loading="authStore.loadingProfile" :learn-collapsible="false">
    <template #heading>
      <h4>{{ $t('dashboard.onboarding.welcome') }}</h4>
    </template>
    <slot>
      <div class="mb-8">
        <div class="mb-10 flex gap-4">
          <div
            class="flex cursor-pointer flex-col justify-between gap-4 rounded-lg bg-violet p-6 text-bg lg:w-5/12"
            @click="showVideo = true"
          >
            <NuxtIcon name="dashboard/butterfly" class="text-4xl" filled />
            <div>
              <h4>{{ $t('dashboard.onboarding.banner.title') }}</h4>
              <span class="text-sm">{{ $t('dashboard.onboarding.banner.content') }}</span>
            </div>

            <div class="flex justify-between text-sm">
              <div class="flex items-center gap-2"></div>
              <Btn
                class="!text-bg-dark no-underline"
                type="tertiary"
                inner-class="flex gap-2 items-center"
                @click="showVideo = true"
              >
                <span class="icon-video text-xl text-bg-dark"></span>
                <strong>{{ $t('dashboard.youTube.play') }}</strong>
              </Btn>
            </div>
          </div>

          <div class="flex flex-col gap-4 rounded-lg bg-bg-light p-6 lg:w-1/4">
            <NuxtIcon name="dashboard/token" class="text-4xl" filled />
            <div>
              <h4>{{ $t('dashboard.onboarding.banner.token') }}</h4>
              <p>{{ $t('dashboard.onboarding.banner.tokenInfo') }}</p>
            </div>
            <Btn type="tertiary" href="https://www.apillon.io/token">{{ $t('general.learnMore') }}</Btn>
          </div>

          <div class="flex flex-col gap-6 text-sm lg:w-1/3">
            <div class="flex items-center justify-between">
              <strong>{{ $t('dashboard.usage.title') }}</strong>
              <Btn
                v-if="dataStore.currentProject"
                class="font-bold no-underline"
                type="tertiary"
                :to="{ name: 'dashboard-payments' }"
              >
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
              :max-size="storageStore.info.availableBandwidth"
              :unit="$t('general.month')"
              wrap
            />
          </div>
        </div>
        <Drawer v-model:show="showVideo">
          <DemoVideo
            video-id="qQJnuvUo-xo"
            :chapters="[
              { time: '00:00', title: 'Intro' },
              { time: '00:35', title: 'Dashboard' },
              { time: '02:53', title: 'NFT Collection' },
              { time: '05:20', title: 'Minting' },
              { time: '07:15', title: 'Website' },
            ]"
          />
        </Drawer>

        <!-- Services-->
        <h4 class="mb-8">{{ $t('dashboard.onboarding.servicesTitle') }}</h4>

        <div class="mb-8 grid grid-cols-cards gap-4">
          <CardService v-for="(service, key) in onboardingServices" v-bind="service" :key="key" />
        </div>

        <!-- Resources
        <SolutionOverview />-->
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

const showVideo = ref<boolean>(false);

useHead({
  title: t('dashboard.homepage'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  storageStore.getStorageInfo();
});
</script>
