<template>
  <Dashboard :empty="!dataStore.project.selected || !cloudFunctionStore.hasCloudFunctions" :loading="pageLoading">
    <template #empty>
      <ServiceEmpty
        docs="https://wiki.apillon.io/web3-services/8-web3-cloud-functions.html"
        :name="toCamelCase(ServiceTypeName.CLOUD_FUNCTIONS)"
        :service="ServiceTypeName.CLOUD_FUNCTIONS"
      >
        <template #actions>
          <Btn size="large" @click="modalCreateCloudFunctionsVisible = true">
            {{ $t('computing.cloudFunctions.new') }}
          </Btn>
        </template>
        <modal v-model:show="modalCreateCloudFunctionsVisible" :title="$t('computing.cloudFunctions.new')">
          <FormComputingCloudFunctions @submit-success="modalCreateCloudFunctionsVisible = false" />
        </modal>
      </ServiceEmpty>
    </template>
    <template #heading>
      <HeaderCloudFunctions />
    </template>
    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <ActionsComputingCloudFunctions />
        <TableComputingCloudFunctions :functions="cloudFunctionStore.items" />
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const cloudFunctionStore = useCloudFunctionStore();

const pageLoading = ref<boolean>(true);
const modalCreateCloudFunctionsVisible = ref<boolean | null>(false);

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await cloudFunctionStore.getCloudFunctions();

  pageLoading.value = false;
});
</script>
