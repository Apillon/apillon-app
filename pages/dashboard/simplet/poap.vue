<template>
  <Dashboard :loading="false">
    <template #heading>
      <HeaderSimplet :name="$t('dashboard.simplet.airdrop.name')" />
    </template>

    <Simplet :simplet-id="SimpletType.POAP" />
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: t('dashboard.simplet.poap.name'),
});
</script>
