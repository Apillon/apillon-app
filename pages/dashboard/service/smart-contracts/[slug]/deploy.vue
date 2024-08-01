<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContractsSecondary />
    </template>

    <slot>
      <div>
        <h4 class="mb-6">Smart Contract Details</h4>

        <FormContractsForm />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router';

const smartContractsStore = useSmartContractsStore();

const router = useRouter();
const { params } = useRoute();
const contractUuid = ref<string>(`${params?.slug}` || '');
const pageLoading = ref<boolean>(true);
const smartContractDetails = ref<any | null>(null);

onMounted(async () => {
  if (!contractUuid.value) {
    router.push({ name: 'dashboard-service-smart-contracts' });
  } else {
    await smartContractsStore.getContractByUUID(contractUuid.value as string);
    smartContractDetails.value = smartContractsStore.getContractDetails;
    pageLoading.value = false;
  }
});
</script>
