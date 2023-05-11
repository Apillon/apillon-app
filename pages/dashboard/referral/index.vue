<template>
  <Dashboard>
    <template #heading>
      <div ref="headingRef" class="flex justify-between items-center pb-8">
        <h1>{{ $t('referral.title') }}</h1>

        <!-- User points -->
        <n-space class="body-md" size="large">
          <n-space class="bg-bg-dark pr-3 rounded-[20px]" size="large" align="center">
            <div class="h-10 p-2 rounded-full transition-all duration-300 hover:bg-bg-lighter">
              <NuxtIcon name="referral/spendable-points" class="icon-auto" filled />
            </div>
            <span>{{ $t('referral.xpPoints') }}</span>
            <strong class="text-base text-blue">{{ referralStore.balance_all }}</strong>
          </n-space>
          <n-space class="bg-bg-dark pr-3 rounded-[20px]" size="large" align="center">
            <div class="h-10 p-2 rounded-full transition-all duration-300 hover:bg-bg-lighter">
              <NuxtIcon name="referral/xp-points" class="icon-auto" filled />
            </div>
            <span>{{ $t('referral.spendingPoints') }}</span>
            <strong class="text-base text-pink">{{ referralStore.balance }}</strong>
          </n-space>
        </n-space>
      </div>
    </template>
    <slot>
      <div class="h-full">
        <n-tabs type="line" animated>
          <n-tab-pane name="earnPoints" tab="Earn Points">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 font-button text-sm">
              <!-- Content EARN POINTS -->
              <div class="col-span-2">
                <n-scrollbar y-scrollable :style="scrollStyle">
                  <div v-if="loading" class="mt-40">
                    <Spinner />
                  </div>
                  <Referral v-else />
                </n-scrollbar>
              </div>

              <!-- Info EARN POINTS -->
              <div>
                <ReferralTabInfoEarnPoints />
              </div>
            </div>
          </n-tab-pane>
          <n-tab-pane name="rewards" tab="Rewards">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 font-button text-sm">
              <!-- Content REWARDS -->
              <div class="col-span-2">
                <n-scrollbar y-scrollable :style="scrollStyle">
                  <div v-if="loading" class="mt-40">
                    <Spinner />
                  </div>
                  <ReferralRewardsSection class="pb-8" />
                </n-scrollbar>
              </div>

              <!-- Info REWARDS -->
              <div>
                <ReferralTabInfoRewards />
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const referralStore = useReferralStore();

const loading = ref(false);
const headingRef = ref<HTMLElement>();

useHead({
  title: $i18n.t('referral.title'),
});

const scrollStyle = computed(() => {
  return {
    maxHeight: `calc(100vh - ${196 + (headingRef.value?.clientHeight || 0)}px)`,
  };
});

onMounted(async () => {
  if (isFeatureEnabled(Feature.REFERRAL, authStore.getUserRoles())) {
    await referralStore.getReferral();

    if (!referralStore.termsAccepted) {
      router.replace('/dashboard');
    }
  }
});
</script>
