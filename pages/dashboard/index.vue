<template>
  <Dashboard :loading="authStore.loadingProfile" :learn-collapsible="false">
    <template #heading>
      <Heading>
        <h1>{{ $t('dashboard.homepage') }}</h1>
      </Heading>
    </template>
    <slot>
      <div
        v-if="isFeatureEnabled(Feature.PREBUILD_SOLUTIONS, authStore.getUserRoles())"
        class="mb-8"
      >
        <!-- Services-->
        <h4 class="mb-8">{{ $t('general.explore') }}</h4>

        <div class="grid md:grid-cols-3 gap-x-8 gap-y-4">
          <div
            v-for="(service, key) in services"
            :key="key"
            class="card-dark p-8 flex flex-col justify-between"
          >
            <div class="flex justify-between items-center text-white">
              <strong>{{ service.title }}</strong>
              <NuxtLink
                :to="{ name: service.link }"
                class="inline-flex-cc w-10 h-10 hover:bg-bg-lighter rounded-full transition-colors duration-300"
              >
                <span class="icon-wide-right text-xl"></span>
              </NuxtLink>
            </div>
            <div class="mt-4">
              <p>{{ service.content }}</p>
            </div>
          </div>
        </div>

        <hr class="border-bg-lighter my-8" />

        <!-- Resources-->
        <h4 class="mb-8">{{ $t('general.explore') }}</h4>

        <div class="grid lg:grid-cols-4 sm:grid-cols-2 gap-8">
          <div class="card-light p-8 flex flex-col justify-between">
            <div>
              <n-tag size="tiny" type="info" class="text-bg-dark" :bordered="false" round>
                {{ $t('dashboard.service.storage.bucket') }}
              </n-tag>
              <h5 class="mt-4">{{ $t('dashboard.service.storage.website') }}</h5>
            </div>
            <div class="mt-4">
              <StorageProgress
                :key="storageStore.info.usedStorage"
                :size="storageStore.info.usedStorage"
                :max-size="storageStore.info.availableStorage"
                wrap
              />
            </div>
          </div>

          <div class="card-dark-multiple">
            <div class="card-dark multiple p-8 flex flex-col justify-between">
              <div>
                <n-tag size="tiny" round>
                  {{ $t('dashboard.smartContracts.collection') }}
                </n-tag>
                <h5 class="mt-4">{{ $t('dashboard.smartContracts.meerkats') }}</h5>
              </div>
              <div class="flex gap-2 flex-wrap mt-4">
                <div class="w-10 h-10 flex-cc bg-blue rounded-full">
                  <span class="icon-storage text-2xl text-bg-dark"></span>
                </div>
                <div class="w-10 h-10 flex-cc bg-pink rounded-full">
                  <span class="icon-hosting text-2xl text-bg-dark"></span>
                </div>
                <div class="w-10 h-10 flex-cc bg-green rounded-full">
                  <span class="icon-erc-721 text-2xl text-bg-dark"></span>
                </div>
                <div class="w-10 h-10 flex-cc bg-bg-light rounded-full">
                  <strong>+2</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="card-light p-8">
            <div class="flex justify-between items-center mb-4">
              <n-tag size="tiny" type="success" :bordered="false" round> ERC-721 </n-tag>
              <NuxtIcon name="logo/astar" class="text-3xl" filled />
            </div>
            <h5>{{ $t('dashboard.smartContracts.kraken') }}</h5>
          </div>

          <div class="card-light p-8 flex flex-col justify-between">
            <div>
              <n-tag size="tiny" type="error" class="text-bg-dark" :bordered="false" round>
                {{ $t('dashboard.service.storage.bucket') }}
              </n-tag>
              <h5 class="mt-4">{{ $t('dashboard.service.hosting.title') }}</h5>
            </div>
            <div class="mt-4">
              <StorageProgress
                :key="storageStore.info.usedStorage"
                :size="storageStore.info.usedStorage"
                :max-size="storageStore.info.availableStorage"
                wrap
              />
            </div>
          </div>
        </div>

        <hr class="border-bg-lighter my-8" />

        <!-- Activity-->
        <h4 class="mb-8">{{ $t('general.activity') }}</h4>

        <TablePaymentInvoices />
      </div>
      <div v-else class="p-8 mb-8 bg-bg-light text-body rounded-lg">
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
            href="https://wiki.apillon.io/web3-services/1-good-to-know.html"
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
            href="https://wiki.apillon.io/build/1-apillon-api.html"
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
      <div class="md:max-w-lg p-8 mt-8 mb-6 card-border rounded-lg">
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
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const referralStore = useReferralStore();

const showModal = ref(false);
const loading = ref(false);

useHead({
  title: t('dashboard.dashboard'),
});

const services = [
  {
    title: t('dashboard.nav.services'),
    content: t('dashboard.service.info'),
    link: t('dashboard-service'),
  },
  {
    title: t('dashboard.nav.smartContracts'),
    content: t('dashboard.smartContracts.info'),
    link: t('dashboard-service'),
  },
  {
    title: t('dashboard.nav.solutions'),
    content: t('dashboard.solutions.info'),
    link: t('dashboard-solution'),
  },
];

useHead({
  title: t('dashboard.dashboard'),
});

onMounted(async () => {
  paymentStore.getInvoices();
  storageStore.getStorageInfo();

  if (isFeatureEnabled(Feature.REFERRAL, authStore.getUserRoles())) {
    loading.value = true;
    await referralStore.getReferral();
    loading.value = false;
  }
});

function enterReferral() {
  if (!referralStore.termsAccepted) {
    showModal.value = true;
  } else {
    router.push('/dashboard/referral');
  }
}
</script>
