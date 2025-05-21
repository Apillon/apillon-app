<template>
  <Heading :service="ServiceTypeName.COMPUTING" :headline="$t('dashboard.nav.computing')">
    <template #info>
      <n-space :size="32" align="center">
        <IconInfo v-if="$te('w3Warn.contract.new')" @click="modalW3WarnVisible = true" />
      </n-space>
    </template>

    <template #submenu>
      <MenuComputing />
    </template>
  </Heading>

  <W3Warn v-model:show="modalW3WarnVisible">
    {{ $t('w3Warn.computing.new') }}
  </W3Warn>
</template>

<script lang="ts" setup>
const modalW3WarnVisible = ref<boolean>(false);
</script>
