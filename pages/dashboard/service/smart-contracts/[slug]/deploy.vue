<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContract />
    </template>

    <slot>
      <div class="">
        <h4 class="mb-6 text-center">{{ $t('dashboard.service.smartContracts.create') }}</h4>
        <FormSmartContract class="bg-bg-lighter rounded-lg p-8" />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { pageLoading, init } = useSmartContracts();

onMounted(() => {
  init();
});
</script>
