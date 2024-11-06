<template>
  <Dashboard :key="chatStore.archive.items.length" :loading="pageLoading">
    <template #heading>
      <HeaderSocialHub />
    </template>
    <slot>
      <n-space v-if="chatStore.hasChatArchive" class="pb-8" :size="32" vertical>
        <ActionsSocialChat archive />
        <TableSocialChat archive />
      </n-space>
      <Empty
        v-else
        :title="$t('social.chat.emptyArchive')"
        :info="$t('social.chat.emptyArchiveInfo')"
        icon="logo/grill-chat"
      >
        <Btn type="primary" @click="$router.push({ name: 'dashboard-service-social-hub' })">
          {{ $t('social.chat.list') }}
        </Btn>
      </Empty>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const chatStore = useChatStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('dashboard.nav.social'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await chatStore.getChatArchive();
      pageLoading.value = false;
    });
  }, 100);
});
</script>
