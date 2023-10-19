<template>
  <Dashboard :loading="authStore.loadingProfile" :learn-collapsible="false">
    <template #heading>
      <Heading>
        <h1>{{ $t('dashboard.homepage') }}</h1>
      </Heading>
    </template>
    <slot>
      <div class="p-8 mb-8 bg-bg-light text-body">
        <h3 class="mb-4 text-white">Welcome to Apillon, your gateway to Web3!</h3>
        <p>
          Start your Web3 journey and integrate Decentralized Hosting and Storage services in your
          project, or create a fully-fledged decentralized NFT collection.
        </p>
        <p>
          Soon, more Web3 services will be added, including Decentralized Authentication and
          Computing.
        </p>
        <p>
          Find out how things work in the
          <Btn
            class="inline-block"
            type="link"
            href="https://wiki.apillon.io/build/#concepts"
            target="_blank"
          >
            back end
          </Btn>
          <span>.</span>
        </p>
        <p>
          If you know your way around code, check out
          <Btn
            class="inline-block"
            type="link"
            href="https://wiki.apillon.io/build/3-apillon-api.html"
            target="_blank"
          >
            Apillon API
          </Btn>
          <span> details.</span>
        </p>
        <br />

        <p>
          Or, if you prefer the drag-and-drop way, navigate to the menu on the left and integrate
          Web3 technologies with a few clicks.
        </p>
        <p>
          Launch projects on Web3 like never before. Oh, and if you detect bugs or would like to
          suggest UI improvements, please file a ticket in the
          <Btn
            class="inline-block"
            type="link"
            href="https://discord.com/channels/881835505120079912/881848835364778006"
            target="_blank"
          >
            Apillon Discord channel
          </Btn>
          <span>.</span>
        </p>
        <p>Happy Web3 building!</p>
      </div>
    </slot>

    <template v-if="isFeatureEnabled(Feature.REFERRAL, authStore.getUserRoles())" #learn>
      <!-- Referral -->
      <div class="md:max-w-lg p-8 mt-8 mb-6 card-border">
        <h3 class="mb-4">{{ $t('referral.banner.title') }}</h3>
        <p class="text-body mb-6">
          {{ $t('referral.banner.description') }}
        </p>
        <Image
          src="/images/dashboard/referral.svg"
          class="mb-7"
          :width="359"
          :height="64"
          alt="apillon referral"
        />
        <Btn :loading="loading" type="primary" size="large" @click="enterReferral()">
          {{ $t('referral.banner.btn') }}
        </Btn>
      </div>
    </template>
  </Dashboard>

  <!-- Modal Referral -->
  <modal v-model:show="showModal" :title="$t('referral.enter.header')">
    <ReferralAcceptTerms />
  </modal>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const referralStore = useReferralStore();
const showModal = ref(false);

useHead({
  title: t('dashboard.dashboard'),
});

function enterReferral() {
  if (!referralStore.termsAccepted) {
    showModal.value = true;
  } else {
    router.push('/dashboard/referral');
  }
}

onMounted(() => {
  if (isFeatureEnabled(Feature.REFERRAL, authStore.getUserRoles())) {
    referralStore.getReferral();
  }
});
</script>
