<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunctions />
    </template>
    <slot>
      <n-space v-if="cloudFunctionStore.hasCloudFunctions" class="pb-8" :size="32" vertical>
        <ActionsComputingCloudFunctions />
        <TableComputingCloudFunctions :functions="cloudFunctionStore.items" />
      </n-space>
      <div v-else class="flex gap-y-8 flex-wrap pb-8 mb-8">
        <div class="lg:w-1/2 lg:pr-6">
          <SolutionContent :content="content" />

          <h4 class="my-4">{{ $t('computing.cloudFunctions.startNew') }}</h4>

          <n-space class="mb-8">
            <Btn @click="modalCreateCloudFunctionsVisible = true">
              {{ $t('computing.cloudFunctions.new') }}
            </Btn>
            <Btn
              type="secondary"
              inner-class="text-white flex items-center justify-center"
              href="https://wiki.apillon.io/web3-services/7-web3-compute.html"
            >
              <span class="icon-file text-xl mr-2"></span>
              <span>{{ $t('computing.cloudFunctions.documentation') }}</span>
            </Btn>
          </n-space>
        </div>
        <div class="lg:w-1/2">
          <h3 class="mb-2">{{ $t('computing.cloudFunctions.checkVideo') }}</h3>
          <LearnVideo
            :title="$t('computing.cloudFunctions.checkVideo')"
            html-content="https://www.youtube.com/embed/AslkbJH4OAM?si=IVlEtikZsgI85iWl"
            class="w-full"
          />
        </div>
      </div>

      <!-- Modal - Create Cloud Functions -->
      <modal
        v-model:show="modalCreateCloudFunctionsVisible"
        :title="$t('computing.cloudFunctions.new')"
      >
        <FormComputingCloudFunctions
          @submit-success="modalCreateCloudFunctionsVisible = false"
          @create-success=""
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const { generateContent } = useSolution();
const cloudFunctionStore = useCloudFunctionStore();

const pageLoading = ref<boolean>(true);
const modalCreateCloudFunctionsVisible = ref<boolean | null>(false);

const content = generateContent('cloudFunctions', 'computing');

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await cloudFunctionStore.getCloudFunctions();

      pageLoading.value = false;
    });
  }, 100);
});
</script>
