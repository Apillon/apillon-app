<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSimplet :name="$t('simplet.nft-event-experience.name')" />
    </template>

    <Simplet :simplet-id="SimpletType.POAP" />
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: t('simplet.nft-event-experience.name'),
});

const simpletStore = useSimpletStore();
const pageLoading = ref<boolean>(true);

onMounted(async () => {
  await simpletStore.getSimpletTemplates();
  pageLoading.value = false;
});
</script>
