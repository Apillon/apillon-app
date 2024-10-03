<template>
  <Dashboard>
    <template #heading>
      <HeaderIndexer />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        {{ indexerStore.active?.name }}
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const indexerStore = useIndexerStore();
const { initIndexer } = useIndexer();

useHead({
  title: $i18n.t('dashboard.nav.hosting'),
});

onMounted(() => {
  initIndexer();
});
</script>
