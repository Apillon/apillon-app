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
          />

          <Carousel />
        </div>
        <div
          class="gap-8 pb-8 mb-8"
          :class="ewApiKeyStore.items.length ? '' : 'border-b border-bg-lighter'"
        >
          <div>
            <SolutionContent :content="content" />

            <template v-if="!ewApiKeyStore.items.length">
              <h4 class="mb-4 mt-8">{{ $t('embeddedWallet.generate.title') }}</h4>
              <div class="flex gap-4">
                <!-- Generate API key -->
                <Btn
                  inner-class="flex items-center justify-center px-4"
                  type="primary"
                  @click="generateEWApiKey"
                >
                  <span class="icon-add text-xl mr-2"></span>
                  <span>{{ $t('embeddedWallet.generateApiKey') }}</span>
                </Btn>
                <!-- View documentation -->
                <Btn
                  type="secondary"
                  inner-class="text-white flex items-center justify-center px-4"
                  href=""
                >
                  <span class="icon-edit text-xl mr-2"></span>
                  <span>{{ $t('embeddedWallet.viewDocumentation') }}</span>
                </Btn>
              </div>
            </template>
            <!-- table -->
            <template v-else>
              <TableEmbeddedWalletTable />
              <!-- Generate API key -->
              <Btn
                inner-class="flex items-center justify-center px-4"
                class="mt-8"
                type="primary"
                @click="generateEWApiKey"
              >
                <span class="icon-add text-xl mr-2"></span>
                <span>{{ $t('embeddedWallet.generateNewApiKey') }}</span>
              </Btn>
            </template>
          </div>
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
const ewApiKeyStore = useEwApiKeyStore();
const message = useMessage();

const content = generateContent(SolutionKey.EMBEDDED_WALLET);

const $i18n = useI18n();

const pageLoading = ref<boolean>(true);
const loading = ref(false);

const headingRef = ref<HTMLElement>();

useHead({
  title: $i18n.t('embeddedWallet.title'),
});

function generateEWApiKey() {
  try {
    // api call here
    ewApiKeyStore.items.unshift({
      id: '1',
      name: 'Test API Key',
      secret: '1234567890',
      env: 'Development',
      created: new Date().toISOString(),
      usage: '0',
    });
  } catch (error) {
    message.error(userFriendlyMsg(error));
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await ewApiKeyStore.getKeys();

      console.log(ewApiKeyStore.items);

      pageLoading.value = false;
    });
  }, 100);
});

onUnmounted(() => {});
</script>
