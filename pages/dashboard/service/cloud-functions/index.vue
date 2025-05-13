<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunctions />
    </template>
    <slot>
      <n-space v-if="cloudFunctionStore.hasCloudFunctions" class="pb-8" :size="32" vertical>
        <n-collapse
          class="-mt-4 border-b-1 border-bg-lighter pb-4"
          accordion
          @update:expanded-names="onUpdateAccordion"
        >
          <n-collapse-item>
            <template #header>
              <span class="icon-info mr-2 text-xl"></span>
              {{ instructionsVisible ? $t('general.instructions.hide') : $t('general.instructions.show') }}
            </template>
            <ComputingCloudFunctionsInstructions />
          </n-collapse-item>
        </n-collapse>

        <ActionsComputingCloudFunctions />
        <TableComputingCloudFunctions :functions="cloudFunctionStore.items" />
      </n-space>
      <ComputingCloudFunctionsInstructions v-else class="mb-8 pb-8" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const cloudFunctionStore = useCloudFunctionStore();

const pageLoading = ref<boolean>(true);
const instructionsVisible = ref<boolean>(false);

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await cloudFunctionStore.getCloudFunctions();

  pageLoading.value = false;
});

function onUpdateAccordion(expandedNames: Array<string | number>) {
  instructionsVisible.value = expandedNames.length > 0;
}
</script>
