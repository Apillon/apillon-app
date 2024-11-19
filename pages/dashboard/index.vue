<template>
  <Dashboard :loading="authStore.loadingProfile" :learn-collapsible="false">
    <template #heading>
      <Heading>
        <h1>{{ $t('dashboard.homepage') }}</h1>
      </Heading>
    </template>
    <slot>
      <ProductHuntBanner
        v-if="authStore.user.wallet || true"
        :wallet="authStore.user.wallet ?? undefined"
      />
      <div
        v-if="isFeatureEnabled(Feature.PREBUILD_SOLUTIONS, authStore.getUserRoles())"
        class="mb-8"
      >
        <!-- Resources-->
        <SolutionOverview />

        <hr class="border-bg-lighter my-8" />

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
                v-if="service.link"
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
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const authStore = useAuthStore();

useHead({
  title: t('dashboard.dashboard'),
});

const services = [
  {
    title: t('dashboard.nav.services'),
    content: t('dashboard.service.info'),
    link: 'dashboard-service',
  },
  // {
  //   title: t('dashboard.nav.smartContracts'),
  //   content: t('dashboard.smartContracts.info'),
  // },
  {
    title: t('dashboard.nav.solutions'),
    content: t('dashboard.solution.info'),
    link: 'dashboard-solution',
  },
];
</script>
