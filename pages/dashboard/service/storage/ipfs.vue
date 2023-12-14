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
            <IconInfo
              v-if="$te('w3Warn.ipfs.gateway') && $t('w3Warn.ipfs.gateway')"
              @click="showModalW3Warn = true"
            />
          </n-space>
        </template>

        <template #submenu>
          <MenuStorage />
        </template>
      </Heading>
    </template>
    <slot>
      <!-- Basic design -->
      <n-space v-if="basicDesign" class="pb-8 max-w-4xl mx-auto" :size="16" vertical>
        <div class="flex gap-2 items-end">
          <h4>{{ $t('storage.ipfs.titleInfo') }}</h4>
          <Btn
            class="inline-block mb-[-2px]"
            type="link"
            href="https://wiki.apillon.io/build/2-storage-api.html#get-or-generate-link-for-ipfs"
            target="_blank"
          >
            Wiki
          </Btn>
        </div>
        <HostingPreviewLink
          :link="ipfsStore.info.ipfsGateway"
          :title="$t('storage.ipfs.title')"
          :info="$t('storage.ipfs.ipfsInfo')"
          copy
        />
        <HostingPreviewLink
          :link="ipfsStore.info.ipnsGateway"
          :title="$t('storage.ipfs.ipns')"
          :info="$t('storage.ipfs.ipnsInfo')"
          copy
        />
        <HostingPreviewLink
          :link="ipfsStore.info.secret"
          :title="$t('general.secret')"
          :info="$t('storage.ipfs.secretInfo')"
          copy
        />
        <HostingPreviewLink
          :link="ipfsStore.info.subdomainGateway || ' '"
          :title="$t('storage.ipfs.subdomain')"
          :info="$t('storage.ipfs.subdomainInfo')"
          copy
        />

        <div class="flex gap-2 items-end mt-8 mb-4">
          <h4>{{ $t('storage.ipfs.hotToGenerateLink') }}</h4>
          <Btn
            class="inline-block mb-[-2px]"
            type="link"
            href="https://wiki.apillon.io/build/2-storage-api.html#get-or-generate-link-for-ipfs"
            target="_blank"
          >
            Wiki
          </Btn>
        </div>

        <FormStorageIpfs />
      </n-space>
      <n-card v-else class="card-light !border-none" :title="$t('storage.ipfs.titleInfo')">
        <template #header-extra>
          <Btn
            class="inline-block mb-[-2px]"
            type="link"
            href="https://wiki.apillon.io/build/2-storage-api.html#get-or-generate-link-for-ipfs"
            target="_blank"
          >
            {{ $t('dashboard.wiki') }}
          </Btn>
        </template>
        <n-space class="pb-8" :size="16" vertical>
          <HostingPreviewLink
            :link="ipfsStore.info.ipfsGateway"
            :title="$t('storage.ipfs.title')"
            :info="$t('storage.ipfs.ipfsInfo')"
            copy
          />
          <HostingPreviewLink
            :link="ipfsStore.info.ipnsGateway"
            :title="$t('storage.ipfs.ipns')"
            :info="$t('storage.ipfs.ipnsInfo')"
            copy
          />
          <HostingPreviewLink
            :link="ipfsStore.info.secret"
            :title="$t('general.secret')"
            :info="$t('storage.ipfs.secretInfo')"
            copy
          />
          <HostingPreviewLink
            :link="ipfsStore.info.subdomainGateway || ' '"
            :title="$t('storage.ipfs.subdomain')"
            :info="$t('storage.ipfs.subdomainInfo')"
            copy
          />
        </n-space>
      </n-card>

      <!-- W3Warn: destroyed buckets -->
      <W3Warn v-model:show="showModalW3Warn">
        {{ $t('w3Warn.ipfs.gateway') }}
      </W3Warn>
    </slot>

    <template #learn v-if="!basicDesign">
      <n-card
        size="small"
        class="card mt-8 !border-bg-lighter"
        :title="$t('storage.ipfs.hotToGenerateLink')"
      >
        <template #header-extra
          ><Btn
            class="inline-block mb-[-2px]"
            type="link"
            href="https://wiki.apillon.io/build/2-storage-api.html#get-or-generate-link-for-ipfs"
            target="_blank"
          >
            {{ $t('dashboard.wiki') }}
          </Btn></template
        >

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
