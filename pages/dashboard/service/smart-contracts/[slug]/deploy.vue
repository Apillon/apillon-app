<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContractsSecondary />
    </template>

    <slot>
      <div>
        <h4>Smart Contract Details</h4>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const pageLoading = ref<boolean>(true);

onMounted(() => {
  // Promise.all(Object.values(dataStore.promises)).then(async _ => {
  //   console.log('contractUuid', contractUuid.value);
  //   if (!contractUuid.value) {
  //     router.push({ name: 'dashboard-service-computing' });
  //   } else {
  //     await smartContractsStore.getContractByUUID(contractUuid.value);
  //     smartContractDetails.value = smartContractsStore.getContractDetails;
  pageLoading.value = false;
  //   }
  // });
});
</script>
