<template>
  <Heading>
    <slot>
      <h1>{{ $t('dashboard.nav.hosting') }}</h1>
    </slot>

    <template #info>
      <n-space :size="32" align="center">
        <StorageProgress
          :key="storageStore.info.usedStorage"
          :size="storageStore.info.usedStorage"
          :max-size="storageStore.info.availableStorage"
        />

        <IconInfo v-if="$te('w3Warn.hosting.upload')" @click="modalW3WarnVisible = true" />
      </n-space>
    </template>
    <template #submenu>
      <MenuHosting />
    </template>
  </Heading>

  <W3Warn v-model:show="modalW3WarnVisible">
    {{ $t('w3Warn.hosting.upload') }}
  </W3Warn>
</template>

<script lang="ts" setup>
const storageStore = useStorageStore();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.HOSTING_NEW);
</script>
