<template>
  <Dashboard :key="postStore.items.length" :loading="pageLoading">
    <template #heading>
      <HeaderSocial />
    </template>

    <slot>
      <n-space v-if="postStore.hasPostArchive" class="pb-8" :size="32" vertical>
        <ActionsSocialPost archive />
        <TableSocialPost archive />
      </n-space>
      <Empty
        v-else
        :title="$t('social.post.emptyArchive')"
        :info="$t('social.post.emptyArchiveInfo')"
        icon="logo/grill-chat"
      >
        <Btn type="primary" @click="router.push({ name: 'dashboard-service-social' })">
          {{ $t('social.post.list') }}
        </Btn>
      </Empty>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const postStore = usePostStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('dashboard.nav.social'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await postStore.getPostArchive();
  pageLoading.value = false;
});
</script>
