<template>
  <Dashboard :loading="pageLoading" :learn-collapsible="false">
    <template #heading>
      <Heading>
        <h4>{{ $t('dashboard.nav.storage') }}</h4>

        <template #info>
          <n-space :size="32" align="center">
            <IconInfo
              v-if="$te('w3Warn.storage.shortUrl') && $t('w3Warn.storage.shortUrl')"
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
      <n-card class="mt-8 max-w-2xl" :title="$t('storage.shortUrl.generateShortLink')">
        <template #header-extra
          ><Btn
            class="mb-[-2px] inline-block"
            type="link"
            href="https://wiki.apillon.io/build/3-hosting-api.html#generate-short-url"
            target="_blank"
          >
            {{ $t('dashboard.wiki') }}
          </Btn>
        </template>

        <FormStorageShortUrl />
      </n-card>

      <!-- W3Warn: Short Url -->
      <W3Warn v-model:show="showModalW3Warn">
        {{ $t('w3Warn.storage.shortUrl') }}
      </W3Warn>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const ipfsStore = useIpfsStore();

const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);

useHead({
  title: t('storage.shortUrl.title'),
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
