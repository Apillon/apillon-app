<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContract
        :link="`/dashboard/service/smart-contracts/${contractUuid}`"
        :title="smartContractStore.active.name"
        billing
      />
    </template>

    <slot>
      <div class="">
        <h4 class="mb-6 text-center">{{ $t('smartContracts.create') }}</h4>
        <FormSmartContract class="rounded-lg bg-bg-lighter p-8" />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { params } = useRoute();
const smartContractStore = useSmartContractStore();
const { pageLoading, init } = useSmartContracts();

const contractUuid = params?.id ? params?.id : params?.slug;

onMounted(() => {
  init();
});
</script>
