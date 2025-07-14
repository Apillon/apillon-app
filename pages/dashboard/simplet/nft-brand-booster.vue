<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSimplet :name="$t('simplet.nft-brand-booster.name')" />
    </template>

    <Simplet :simplet-id="SimpletType.AIRDROP" />
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
useHead({
  title: t('simplet.nft-brand-booster.name'),
});

const simpletStore = useSimpletStore();
const pageLoading = ref<boolean>(true);

onMounted(async () => {
  await simpletStore.getSimpletTemplates();
  pageLoading.value = false;
});
</script>
