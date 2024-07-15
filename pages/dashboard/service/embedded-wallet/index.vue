<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderEmbeddedWallet />
      </div>
    </template>

    <slot>
      <div class="pb-8">
        <div class="grid md:grid-cols-2 gap-8 border-b border-bg-lighter pb-8 mb-8">
          <!-- DEMO -->
          <LearnVideo
            title="Embedded Wallet"
            html-content="https://www.youtube.com/embed/5d6FsGTAk00?si=l2tTiIg47hQ-7MjM"
            class="w-full"
          />

          <Carousel class="w-full" />
        </div>
        <div class="gap-8">
          <!-- text -->
          <SolutionContent :content="content" :icons="true" />
          <!-- display  -->
          <template v-if="!settingsStore.ewApiKeys.length">
            <h4 class="mb-4 mt-8">{{ $t('embeddedWallet.generate.title') }}</h4>
            <div class="flex gap-4 mb-8">
              <!-- Generate API key -->
              <Btn
                :to="{ name: 'dashboard-api-keys' }"
                inner-class="flex items-center justify-center "
                type="primary"
              >
                <span>{{ $t('embeddedWallet.generateApiKey') }}</span>
              </Btn>

              <!-- View documentation -->
              <Btn
                type="secondary"
                inner-class="text-white flex items-center justify-center"
                href=""
              >
                <span class="icon-edit text-xl mr-2"></span>
                <span>{{ $t('embeddedWallet.viewDocumentation') }}</span>
              </Btn>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center justify-between">
              <h4 class="mb-4 mt-8">{{ $t('embeddedWallet.generate.generate') }}</h4>
              <!-- Generate API key -->
              <div class="flex gap-x-4">
                <Btn
                  type="secondary"
                  inner-class="text-white flex items-center justify-center"
                  href=""
                >
                  <span class="icon-edit text-xl mr-2"></span>
                  <span>{{ $t('embeddedWallet.viewDocumentation') }}</span>
                </Btn>
                <Btn
                  :to="{ name: 'dashboard-api-keys' }"
                  inner-class="flex items-center justify-center px-4"
                  type="primary"
                >
                  <span class="icon-add text-xl mr-2"></span>
                  <span>{{ $t('embeddedWallet.generateApiKey') }}</span>
                </Btn>
              </div>
            </div>
            <div class="mb-8">
              <!-- table -->
              <TableEmbeddedWalletTable />
            </div>
          </template>
        </div>
        <div class="gap-8">
          <CodeSnippet />
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { generateContent } = useSolution();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();

const content = generateContent(SolutionKey.EMBEDDED_WALLET);

const $i18n = useI18n();

const pageLoading = ref<boolean>(true);

const headingRef = ref<HTMLElement>();

useHead({
  title: $i18n.t('embeddedWallet.title'),
});

onMounted(async () => {
  await sleep(500);
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    /** Fetch all services if there is any service type unloaded */
    await dataStore.getServices();

    /** Fetch all api keys if they are not stored in settings store */
    await settingsStore.fetchEmbeddedWalletKeys();

    pageLoading.value = false;
  });
});
onUnmounted(() => {});
</script>
