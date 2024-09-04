<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunctions />
    </template>

    <slot>
      <n-space v-if="cloudFunctionStore.hasJobs" class="pb-8" :size="32" vertical>
        <ActionsComputingCloudFunctionJobs />
        <TableComputingCloudFunctionJobs />
      </n-space>
      <div v-else class="flex justify-center items-center h-full">
        <div class="flex flex-col gap-4 mb-8 my-20 max-w-xl text-center">
          <h4>{{ $t('computing.cloudFunctions.job.title') }}</h4>
          <i18n-t keypath="computing.cloudFunctions.job.content" tag="p" />

          <p class="my-5">{{ $t('general.or') }}</p>

          <Btn class="mb-2" size="large" @click="modalCreateJobVisible = true">
            {{ $t('computing.cloudFunctions.job.btnUpload') }}
          </Btn>
        </div>
      </div>

      <!-- Modal - Create CloudFunction Job -->
      <modal v-model:show="modalCreateJobVisible" :title="$t('computing.cloudFunctions.job.new')">
        <FormComputingCloudFunctionsJob
          :function-uuid="cloudFunctionStore.functionUuid"
          @submit-success="modalCreateJobVisible = false"
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const router = useRouter();
const { params } = useRoute();
const { t } = useI18n();
const dataStore = useDataStore();
const jobStore = useJobStore();
const cloudFunctionStore = useCloudFunctionStore();
const { pageLoading, init } = useCloudFunctions();

const modalCreateJobVisible = ref<boolean>(false);

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(async () => {
  await init();

  jobStore.getJob(cloudFunctionStore.active.jobs[0].job_uuid);
});
</script>
