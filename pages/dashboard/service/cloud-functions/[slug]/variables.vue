<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunctions />
    </template>

    <slot>
      <n-space v-if="cloudFunctionStore.hasJobs" class="pb-8" :size="32" vertical>
        <ActionsComputingCloudFunctionsEnvironment />
        <TableComputingCloudFunctionVariables v-if="cloudFunctionStore.hasVariables" />
      </n-space>
      <n-space v-else class="pb-8" :size="32" vertical>
        <div class="flex justify-center items-center h-full">
          <div class="flex flex-col gap-4 mb-8 my-20 max-w-xl text-center">
            <h4 class="mb-2">{{ $t('computing.cloudFunctions.variable.title') }}</h4>
            <i18n-t keypath="computing.cloudFunctions.variable.content" tag="p">
              <template v-slot:url>
                <a
                  href="https://wiki.apillon.io/web3-services/7-web3-compute.html"
                  class="underline text-blue"
                  target="_blank"
                >
                  {{ $t('general.documentation') }}
                </a>
              </template>
            </i18n-t>

            <div class="mt-4 max-w-xs mx-auto">
              <Btn class="mb-2" size="large" @click="modalCreateVariableVisible = true">
                {{ $t('computing.cloudFunctions.variable.btnAdd') }}
              </Btn>
              <n-upload :show-file-list="false" accept=".env" :custom-request="e => uploadFile(e)">
                <Btn type="secondary" size="large">
                  {{ $t('computing.cloudFunctions.variable.btnUpload') }}
                </Btn>
              </n-upload>
            </div>
          </div>
        </div>
      </n-space>

      <!-- Modal - Create Cloud Function variables -->
      <modal
        v-model:show="modalCreateVariableVisible"
        :title="$t('computing.cloudFunctions.variable.new')"
      >
        <FormComputingCloudFunctionsVariable
          :function-uuid="cloudFunctionStore.functionUuid"
          @submit-success="modalCreateVariableVisible = false"
          @create-success=""
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const cloudFunctionStore = useCloudFunctionStore();
const { pageLoading, init, uploadFile } = useCloudFunctions();

const modalCreateVariableVisible = ref<boolean>(false);

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(async () => {
  await init();

  pageLoading.value = true;
  await cloudFunctionStore.getVariables(cloudFunctionStore.active.function_uuid);
  pageLoading.value = false;
});
</script>
