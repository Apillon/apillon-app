<template>
  <Dashboard :loading="false">
    <template #heading>
      <HeaderSimplet :name="$t('simplet.poap.name')" />
    </template>

    <Simplet :simplet-id="SimpletType.POAP" />
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: t('simplet.poap.name'),
});
</script>
