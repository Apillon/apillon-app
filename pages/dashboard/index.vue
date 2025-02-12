<template>
  <Dashboard :loading="authStore.loadingProfile" :learn-collapsible="false">
    <template #heading>
      <Heading>
        <h1>{{ $t('dashboard.homepage') }}</h1>
      </Heading>
    </template>
    <slot>
      <div v-if="isFeatureEnabled(Feature.PREBUILD_SOLUTIONS, authStore.getUserRoles())" class="mb-8">
        <Btn @click="show = true">{{ $t('dashboard.youTube.play') }}</Btn>
        <ModalYouTube
          v-model:show="show"
          video-id="9y-9nz0tpVs"
          :chapters="[
            { time: '00:00', title: 'Intro' },
            { time: '00:35', title: 'Dashboard' },
            { time: '02:53', title: 'NFT Collection' },
            { time: '05:20', title: 'Minting' },
            { time: '07:15', title: 'Website' },
          ]"
        />

        <!-- Resources-->
        <SolutionOverview />

        <hr class="my-8 border-bg-lighter" />

        <!-- Services-->
        <h4 class="mb-8">{{ $t('general.explore') }}</h4>

        <div class="grid gap-x-8 gap-y-4 md:grid-cols-3">
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
      <div v-else class="mb-8 rounded-lg bg-bg-light p-8 text-body">
        <h3 class="mb-4 text-white">Welcome to Apillon, your gateway to Web3!</h3>
        <p>
          Start your Web3 journey and integrate Decentralized Hosting and Storage services in your project, or create a
          fully-fledged decentralized NFT collection.
        </p>
        <p>Soon, more Web3 services will be added, including Decentralized Authentication and Computing.</p>
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
          <Btn class="inline-block" type="link" href="https://wiki.apillon.io/build/1-apillon-api.html" target="_blank">
            Apillon API
          </Btn>
          <span> details.</span>
        </p>
        <br />

        <p>
          Or, if you prefer the drag-and-drop way, navigate to the menu on the left and integrate Web3 technologies with
          a few clicks.
        </p>
        <p>
          Launch projects on Web3 like never before. Oh, and if you detect bugs or would like to suggest UI
          improvements, please file a ticket in the
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

const show = ref<boolean>(false);

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
