<template>
  <Dashboard>
    <template #heading>
      <Heading>
        <slot>
          <h4>{{ $t('dashboard.homepage') }}</h4>
        </slot>
      </Heading>
    </template>
    <slot>
      <div class="flex lg:flex-nowrap flex-wrap gap-8 max-w-[980px] p-8 mb-7 bg-bg-lighter">
        <div class="max-w-[480px]">
          <h4 class="mb-4">Welcome to Apillon</h4>
          <p>
            Thank you for registering for Apillon platform and becoming one of the first Beta
            testers!
          </p>
          <br />
          <p>
            The services are under development, but soon you’ll be able to test the available
            features and build your first Web3 product with Apillon.
          </p>
          <br />
          <p>
            You’ll also be able to win Apillon’s merch pack as through Apillon’s referral system
            which is in progress as we speak.
          </p>
          <div class="p-4 bg-bg-light mt-8">
            <p>
              <strong>I’m registered, now what?</strong>
            </p>
            <p>
              Sit back and relax. Once the first feature is ready to be tested and used, we will
              notify you via email so you can start your Web3 journey.
            </p>
          </div>
        </div>
        <div>
          <Image src="/images/dashboard/welcome.svg" :width="400" :height="470" alt="apillon" />
        </div>
      </div>

      <!-- Referral -->
      <div v-if="isFeatureEnabled(Feature.REFERRAL)" class="max-w-lg p-8 mb-8 bg-bg-light">
        <h3 class="mb-4">{{ $t('referral.banner.title') }}</h3>
        <p class="text-body mb-7">
          {{ $t('referral.banner.description') }}
        </p>
        <Btn :loading="loading" type="primary" size="large" @click="enterReferral()">
          {{ $t('referral.banner.btn') }}
        </Btn>
      </div>
    </slot>
  </Dashboard>

  <!-- Modal Referral -->
  <modal v-model:show="showModal" :title="$t('referral.enter.header')">
    <ReferralAcceptTerms />
  </modal>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const config = useRuntimeConfig();
const referralStore = useReferralStore();

useHead({
  title: t('dashboard.dashboard'),
});

function enterReferral() {
  if (!termsAccepted.value) {
    showModal.value = true;
  } else {
    router.push('/dashboard/referral');
  }
}

const loading = ref(false);
const termsAccepted = ref(false);

onMounted(() => {
  if (isFeatureEnabled(Feature.REFERRAL)) {
    getReferral();
  }
});

async function getReferral() {
  loading.value = true;
  try {
    const res = await $api.get<ReferralResponse>(endpoints.referral);
    // If there is no error -> user already accepted terms & conditions
    referralStore.initReferral(res.data);
    termsAccepted.value = true;
  } catch (e) {
    if (config.public.ENV === AppEnv.LOCAL) {
      console.error(e);
    }
  }
  loading.value = false;
}

const showModal = ref(false);
</script>
