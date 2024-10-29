<template>
  <div v-for="(item, key) in indexerDeploymentsStore.active.logs" :key="key">
    <p>{{ item.severity }}-{{ item.message }}</p>
  </div>
</template>

<script lang="ts" setup>
const indexerDeploymentsStore = useIndexerDeploymentsStore();
</script>
