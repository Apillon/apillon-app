<template>
  <Heading
    :back="{ name: 'dashboard-service-computing' }"
    :service="ServiceTypeName.COMPUTING"
    :service-name="$t('dashboard.nav.computing')"
    :name="contractStore.active.name"
  />
</template>

<script lang="ts" setup>
const contractStore = useContractStore();
</script>
