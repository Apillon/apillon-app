<template>
  <Heading
    :service="ServiceTypeName.HOSTING"
    :info="$t('w3Warn.hosting.upload')"
    :technologies="['logo/crust', 'library/typescript', 'library/javascript', 'library/nextjs']"
    docs="https://wiki.apillon.io/web3-services/3-web3-hosting.html"
  >
    <slot>
      <n-space align="center">
        <h3>{{ $t('dashboard.nav.hosting') }}</h3>
        <IconInfo v-if="$te('w3Warn.hosting.upload')" @click="modalW3WarnVisible = true" />
      </n-space>
    </slot>

    <template #submenu>
      <MenuHosting />
    </template>

    <template #details>
      <StorageProgress
        :key="storageStore.info.usedStorage"
        class="mt-2"
        :size="storageStore.info.usedStorage"
        :max-size="storageStore.info.availableStorage"
        :label="$t('dashboard.pageMenu.usage')"
        wrap
      />
      <hr class="my-10 border-bg-lighter" />
    </template>
    <template #links>
      <StorageGithubProjectConfig />
    </template>
  </Heading>

  <W3Warn v-model:show="modalW3WarnVisible">
    {{ $t('w3Warn.hosting.upload') }}
  </W3Warn>
</template>

<script lang="ts" setup>
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.HOSTING_NEW);

const storageStore = useStorageStore();
</script>
