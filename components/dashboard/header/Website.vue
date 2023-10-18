<template>
  <Heading>
    <slot>
      <n-space align="center" size="large" :wrap="false">
        <NuxtLink :to="{ name: 'dashboard-service-hosting' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <div>
          <h2>{{ websiteStore.active.name }}</h2>

          <n-space align="center" size="small" :wrap="false">
            <span>{{ $t('hosting.website.uuid') }}:</span>
            <n-ellipsis class="text-body align-bottom" :line-clamp="1">
              {{ websiteStore.active.website_uuid }}
            </n-ellipsis>
            <button class="text-body" @click="copyToClipboard(websiteStore.active.website_uuid)">
              <span class="icon-copy"></span>
            </button>
          </n-space>
        </div>
      </n-space>
    </slot>

    <template #info>
      <n-space :size="32" align="center" :wrap="false">
        <PaymentCreditCosts :service="ServiceTypeName.HOSTING" />
        <IconInfo @click="showModalW3Warn = true" />
      </n-space>
    </template>

    <template #submenu>
      <MenuHosting />
    </template>
  </Heading>

  <!-- W3Warn: hosting upload static files -->
  <W3Warn v-model:show="showModalW3Warn">
    {{ $t('w3Warn.hosting.upload') }}
  </W3Warn>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const { params } = useRoute();

const bucketStore = useBucketStore();
const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();

/** Website ID from route */
const websiteId = ref<string>(`${params?.id || ''}`);
const showModalW3Warn = ref<boolean>(false);

onMounted(() => {
  storageStore.getStorageInfo();

  if (
    websiteId.value &&
    !localStorage.getItem(LsW3WarnKeys.HOSTING_NEW) &&
    $i18n.te('w3Warn.hosting.upload') &&
    bucketStore.folder.items.length === 0
  ) {
    showModalW3Warn.value = true;
    localStorage.setItem(LsW3WarnKeys.HOSTING_NEW, Date.now().toString());
  }
});
</script>
