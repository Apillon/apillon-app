<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContractsSecondary />
    </template>

    <slot>
      <div>
        <h4>Smart Contract Details</h4>
        {{ smartContractDetails }}
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const router = useRouter();
const { params } = useRoute();

const smartContractsStore = useSmartContractsStore();
const dataStore = useDataStore();

const pageLoading = ref<boolean>(true);
const contractUuid = ref<string>(`${params?.slug}` || '');
const smartContractDetails = ref<SmartContractInterface | null>(null);
pageLoading.value = false;
onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    console.log(contractUuid);
    if (!contractUuid.value) {
      router.push({ name: 'dashboard-service-smart-contracts' });
    } else {
      await smartContractsStore.getContractByUUID(contractUuid.value);
      smartContractDetails.value = smartContractsStore.getContractDetails;
      pageLoading.value = false;
    }
  });
});
</script>
