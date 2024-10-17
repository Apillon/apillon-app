<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunctions />
    </template>
    <slot>
      <n-space v-if="cloudFunctionStore.hasCloudFunctions" class="pb-8" :size="32" vertical>
        <n-collapse
          class="border-b-1 border-bg-lighter -mt-4 pb-4"
          accordion
          @update:expanded-names="onUpdateAccordion"
        >
          <n-collapse-item
            :title="
              instructionsVisible
                ? $t('general.instructions.hide')
                : $t('general.instructions.show')
            "
          >
            <ComputingCloudFunctionsInstructions />
          </n-collapse-item>
        </n-collapse>

        <ActionsComputingCloudFunctions />
        <TableComputingCloudFunctions :functions="cloudFunctionStore.items" />
      </n-space>
      <ComputingCloudFunctionsInstructions v-else class="pb-8 mb-8" />
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

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await cloudFunctionStore.getCloudFunctions();

      pageLoading.value = false;
    });
  }, 100);
});

function onUpdateAccordion(expandedNames: Array<string | number>) {
  instructionsVisible.value = expandedNames.length > 0;
}
</script>
