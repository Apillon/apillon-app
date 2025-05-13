<template>
  <Heading
    :service="ServiceTypeName.HOSTING"
    :info="$t('w3Warn.simplets.info')"
    :technologies="['logo/crust', 'library/typescript', 'library/javascript', 'library/nextjs']"
    docs="sdocnkslk"
    demo="qQJnuvUo-xo"
  >
    <slot>
      <n-space align="center">
        <h3>{{ $t('dashboard.nav.simplets') }}</h3>
        <IconInfo v-if="$te('w3Warn.simplets.info')" @click="modalW3WarnVisible = true" />
      </n-space>
    </slot>

    <template #submenu>
      <MenuSimplets />
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
