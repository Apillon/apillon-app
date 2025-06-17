<template>
  <Dashboard :loading="false">
    <template #heading>
      <HeaderSimplet :name="$t('simplet.free-mint.name')" />
    </template>

    <Simplet :simplet-id="SimpletType.FREE_MINT" />
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
useHead({
  title: t('simplet.free-mint.name'),
});
</script>
