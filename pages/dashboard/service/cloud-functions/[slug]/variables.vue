<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunction />
    </template>

    <slot>
      <n-space v-if="cloudFunctionStore.hasVariables" class="pb-8" :size="32" vertical>
        <ActionsComputingCloudFunctionsEnvironment />
        <TableComputingCloudFunctionVariables v-if="cloudFunctionStore.hasVariables" />
      </n-space>
      <n-space v-else class="pb-8" :size="32" vertical>
        <div class="flex h-full items-center justify-center">
          <div class="my-20 mb-8 flex max-w-xl flex-col gap-4 text-center">
            <h4 class="mb-2">{{ $t('computing.cloudFunctions.variable.title') }}</h4>
            <i18n-t keypath="computing.cloudFunctions.variable.content" tag="p">
              <template #url>
                <a
                  href="https://wiki.apillon.io/web3-services/7-web3-compute.html"
                  class="text-blue underline"
                  target="_blank"
                >
                  {{ $t('general.documentation') }}
                </a>
              </template>
            </i18n-t>

            <div class="mx-auto mt-4 max-w-xs">
              <Btn class="mb-2" size="large" @click="modalCreateVariableVisible = true">
                {{ $t('computing.cloudFunctions.variable.btnAdd') }}
              </Btn>
              <n-upload :show-file-list="false" :custom-request="e => uploadEnvFile(e)">
                <Btn type="secondary" size="large">
                  {{ $t('computing.cloudFunctions.variable.btnUpload') }}
                </Btn>
              </n-upload>
            </div>
          </div>
        </div>
      </n-space>

      <!-- Modal - Create Cloud Function variables -->
      <modal v-model:show="modalCreateVariableVisible" :title="$t('computing.cloudFunctions.variable.new')">
        <FormComputingCloudFunctionsVariable
          :function-uuid="cloudFunctionStore.functionUuid"
          @submit-success="modalCreateVariableVisible = false"
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const cloudFunctionStore = useCloudFunctionStore();
const { pageLoading, init, uploadEnvFile } = useCloudFunctions();

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
