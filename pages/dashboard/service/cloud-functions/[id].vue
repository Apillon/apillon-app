<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunction />
    </template>

    <slot>
      <n-space v-if="cloudFunctionStore.hasJobs" class="pb-8" :size="32" vertical>
        <ActionsCloudFunctionsJobs />
        <TableComputingCloudFunctionJobs />
      </n-space>
      <div v-else class="flex h-full flex-col items-center justify-center">
        <n-space size="large" class="mb-8 self-end">
          <!-- View template -->
          <n-button tag="a" href="https://github.com/Apillon/cloud-function-template" target="_blank">
            <span class="icon-cloud-functions mr-2 text-xl"></span>
            {{ $t('computing.cloudFunctions.job.viewTemplate') }}
          </n-button>
          <BtnDocumentation href="https://wiki.apillon.io/web3-services/8-web3-cloud-functions.html" hover-lighter />
        </n-space>
        <div class="mt-8 flex max-w-xl flex-col gap-4 text-center">
          <h4>{{ $t('computing.cloudFunctions.job.title') }}</h4>
          <i18n-t keypath="computing.cloudFunctions.job.content" tag="p" />

          <div class="my-4">
            <Btn @click="modalCreateJobVisible = true">
              {{ $t('computing.cloudFunctions.job.btnUpload') }}
            </Btn>
          </div>
        </div>
      </div>

      <!-- Modal - Create CloudFunction Job -->
      <modal v-model:show="modalCreateJobVisible" :title="$t('computing.cloudFunctions.job.new')">
        <FormCloudFunctionsJob
          :function-uuid="cloudFunctionStore.functionUuid"
          @submit-success="modalCreateJobVisible = false"
          @create-success="onJobCreated"
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { pageLoading, init } = useCloudFunctions();
const cloudFunctionStore = useCloudFunctionStore();
const { modalCreateJobVisible, onJobCreated } = useCloudFunctions();

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(async () => {
  await init();
});
</script>
