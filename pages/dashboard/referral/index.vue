<template>
  <Dashboard>
    <template #heading>
      <div ref="headingRef" class="flex justify-between">
        <h4>{{ $t('referral.title') }}</h4>

        <!-- User points -->

        <div class="flex mr-10">
          <div class="mr-10">
            {{ 'XP points: ' + referralStore.balance }}
          </div>
          <div>
            {{ 'Spending points: ' + referralStore.balance_all }}
          </div>
        </div>
      </div>
      <div>
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
                  <ReferralRewardsSection />
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
    </template>
    <slot>
      <!-- <div v-if="loading" class="mt-40">
        <Spinner />
      </div>
     -->
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const router = useRouter();

const referralStore = useReferralStore();
const headingRef = ref<HTMLElement>();

const scrollStyle = computed(() => {
  return {
    maxHeight: `calc(100vh - ${210 + (headingRef.value?.clientHeight || 0)}px)`,
  };
});

const $i18n = useI18n();

useHead({
  title: $i18n.t('referral.title'),
});

const loading = ref(false);

getReferral();
async function getReferral() {
  loading.value = true;
  try {
    const res = await $api.get(endpoints.referral);
    // If there is no error -> user already accepted terms & conditions
    referralStore.initReferral(res.data);
  } catch (e) {
    router.replace('/dashboard');
    console.error(e);
  }
  loading.value = false;
}
</script>
