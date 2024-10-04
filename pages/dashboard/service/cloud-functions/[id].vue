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

          <p class="my-5">{{ $t('general.or') }}</p>

          <div class="my-auto mb-2">
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
          @create-success="checkUnfinishedJobs()"
          @submit-success="modalCreateJobVisible = false"
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { pageLoading, init } = useCloudFunctions();
const cloudFunctionStore = useCloudFunctionStore();
const { checkUnfinishedJobs } = useRefreshStatus();

const modalCreateJobVisible = ref<boolean>(false);

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(async () => {
  await init();
});
</script>
