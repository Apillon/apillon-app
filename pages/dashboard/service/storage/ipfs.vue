<template>
  <Dashboard :loading="pageLoading" :learn-collapsible="false">
    <template #heading>
      <Heading>
        <slot>
          <h4>{{ $t('dashboard.nav.storage') }}</h4>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <IconInfo v-if="$te('w3Warn.ipfs.gateway') && $t('w3Warn.ipfs.gateway')" @click="showModalW3Warn = true" />
          </n-space>
        </template>

        <template #submenu>
          <MenuStorage />
        </template>
      </Heading>
    </template>
    <slot>
      <n-card class="card-light !border-none pb-8" :bordered="false" :title="$t('storage.ipfs.titleInfo')">
        <template #header-extra>
          <Btn
            class="mb-[-2px] inline-block"
            type="link"
            href="https://wiki.apillon.io/build/2-storage-api.html#get-or-generate-link-for-ipfs"
            target="_blank"
          >
            {{ $t('dashboard.wiki') }}
          </Btn>
        </template>

        <StorageIpfsGateway v-if="ipfsStore.info" :gateway="ipfsStore.info" />
      </n-card>

      <!-- W3Warn: ipfs gateway -->
      <W3Warn v-model:show="showModalW3Warn">
        {{ $t('w3Warn.ipfs.gateway') }}
      </W3Warn>
    </slot>

    <template #learn>
      <n-card class="card !border-bg-lighter mobile:mt-8" :title="$t('storage.ipfs.hotToGenerateLink')">
        <template #header-extra>
          <Btn
            class="mb-[-2px] inline-block"
            type="link"
            href="https://wiki.apillon.io/build/2-storage-api.html#get-or-generate-link-for-ipfs"
            target="_blank"
          >
            {{ $t('dashboard.wiki') }}
          </Btn>
        </template>

        <FormStorageIpfs />
      </n-card>
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const ipfsStore = useIpfsStore();

const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);

useHead({
  title: t('storage.ipfs.title'),
});

watch(
  () => dataStore.projectUuid,
  async projectUuid => {
    if (projectUuid) {
      pageLoading.value = true;
      await ipfsStore.getIpfsInfo(projectUuid);
      pageLoading.value = false;
    }
  },
  { immediate: true }
);
</script>
