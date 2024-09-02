<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunctions />
    </template>

    <slot>
      <n-space v-if="cloudFunctionStore.hasCloudFunctions" class="pb-8" :size="32" vertical>
        <ActionsComputingCloudFunctions />
        <TableComputingCloudFunctions />
      </n-space>
      <div v-else class="flex justify-center items-center h-full">
        <div class="flex flex-col gap-4 mb-8 my-20">
          <h3 class="mb-2">{{ $t('computing.cloudFunctions.variable.title') }}</h3>
          <i18n-t
            keypath="computing.cloudFunctions.variable.content"
            tag="p"
            for="general.documentation"
          >
            <template v-slot:url>
              <a href="https://wiki.apillon.io/web3-services/7-web3-compute.html" target="_blank">
                {{ $t('general.documentation') }}
              </a>
            </template>
          </i18n-t>

          <Btn class="mb-2">{{ $t('computing.cloudFunctions.variable.btnAdd') }}</Btn>
          <Btn type="secondary">{{ $t('computing.cloudFunctions.variable.btnUpload') }}</Btn>
        </div>
      </div>

      <!-- Modal - Create Cloud Functions -->
      <modal v-model:show="modalCreateVariableVisible" :title="$t('computing.cloudFunctions.new')">
        <FormComputingCloudFunctions
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
const { pageLoading, init } = useCloudFunctions();

const modalCreateVariableVisible = ref<boolean>(false);

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(() => {
  init();
});
</script>
