<template>
  <Heading
    :back="{ name: 'dashboard-service-hosting' }"
    :service="ServiceTypeName.HOSTING"
    :service-name="$t('dashboard.nav.hosting')"
    :name="websiteStore.active.name"
    :info="$t('w3Warn.hosting.upload')"
  >
    <template #details>
      <TableEllipsis :prefix="$t('hosting.website.uuid')" :text="websiteStore.active.website_uuid" />
    </template>
  </Heading>

  <!-- W3Warn: hosting upload static files -->
  <W3Warn v-model:show="showModalW3Warn">
    {{ $t('w3Warn.hosting.upload') }}
  </W3Warn>
</template>

<script lang="ts" setup>
const { te } = useI18n();
const { params } = useRoute();

const bucketStore = useBucketStore();
const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();

/** Website ID from route */
const websiteUuid = ref<string>(`${params?.id || ''}`);
const showModalW3Warn = ref<boolean>(false);

onMounted(() => {
  storageStore.getStorageInfo();
  storageStore.getGithubProjectConfig();

  if (
    websiteUuid.value &&
    !localStorage.getItem(LsW3WarnKeys.HOSTING_NEW) &&
    te('w3Warn.hosting.upload') &&
    bucketStore.folder.items.length === 0
  ) {
    showModalW3Warn.value = true;
    localStorage.setItem(LsW3WarnKeys.HOSTING_NEW, Date.now().toString());
  }
});
</script>
