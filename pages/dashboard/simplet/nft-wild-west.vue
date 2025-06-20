<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSimplet :name="$t('simplet.nft-wild-west.name')" />
    </template>

    <Simplet :simplet-id="SimpletType.FREE_MINT" />
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
useHead({
  title: t('simplet.nft-wild-west.name'),
});

const simpletStore = useSimpletStore();
const pageLoading = ref<boolean>(true);

onMounted(async () => {
  await simpletStore.getSimpletTemplates();
  pageLoading.value = false;
});
</script>
