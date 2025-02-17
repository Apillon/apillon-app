<template>
  <Dashboard :loading="pageLoading" :learn-collapsible="false">
    <template #heading>
      <Heading>
        <slot>
          <h4>{{ $t('dashboard.nav.storage') }}</h4>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <n-switch
              v-if="config.public.ENV === AppEnv.DEV || config.public.ENV === AppEnv.LOCAL"
              class="overflow-hidden px-1"
              :rail-style="railStyle"
            >
              <template #checked> Basic design </template>
              <template #unchecked>Custom design </template>
            </n-switch>
            <IconInfo v-if="$te('w3Warn.ipfs.gateway') && $t('w3Warn.ipfs.gateway')" @click="showModalW3Warn = true" />
          </n-space>
        </template>

        <template #submenu>
          <MenuStorage />
        </template>
      </Heading>
    </template>
    <slot>
      <!-- Basic design -->
      <n-space v-if="basicDesign" class="mx-auto max-w-4xl pb-8" :size="16" vertical>
        <div class="flex items-end gap-2">
          <h4>{{ $t('storage.ipfs.titleInfo') }}</h4>
          <Btn
            class="mb-[-2px] inline-block"
            type="link"
            href="https://wiki.apillon.io/build/2-storage-api.html#get-or-generate-link-for-ipfs"
            target="_blank"
          >
            {{ $t('dashboard.wiki') }}
          </Btn>
        </div>

        <StorageIpfsGateway v-if="ipfsStore.info" :gateway="ipfsStore.info" />

        <div class="mb-4 flex items-end gap-2">
          <h4>{{ $t('storage.ipfs.hotToGenerateLink') }}</h4>
          <Btn
            class="mb-[-2px] inline-block"
            type="link"
            href="https://wiki.apillon.io/build/2-storage-api.html#get-or-generate-link-for-ipfs"
            target="_blank"
          >
            {{ $t('dashboard.wiki') }}
          </Btn>
        </div>

        <FormStorageIpfs />
      </n-space>
      <n-card v-else class="card-light !border-none" :bordered="false" :title="$t('storage.ipfs.titleInfo')">
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

    <template #learn v-if="!basicDesign">
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
import type { CSSProperties } from 'nuxt/dist/app/compat/capi';

const { t } = useI18n();
const dataStore = useDataStore();
const ipfsStore = useIpfsStore();
const config = useRuntimeConfig();

const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);

const basicDesign = ref<boolean>(false);
const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  basicDesign.value = checked;
  const style: CSSProperties = {};
  if (checked) {
    style.background = '#d03050';
    if (focused) {
      style.boxShadow = '0 0 0 2px #d0305040';
    }
  } else {
    style.background = '#2080f0';
    if (focused) {
      style.boxShadow = '0 0 0 2px #2080f040';
    }
  }
  return style;
};

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
