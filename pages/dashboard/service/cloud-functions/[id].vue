<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunction />
    </template>

    <slot>
      <n-space v-if="cloudFunctionStore.hasJobs" class="pb-8" :size="32" vertical>
        <ActionsComputingCloudFunctionsJobs />
        <TableComputingCloudFunctionJobs />
      </n-space>
      <div v-else class="flex justify-center items-center h-full">
        <div class="flex flex-col gap-4 mb-8 my-20 max-w-xl text-center">
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
        <FormComputingCloudFunctionsJob
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
