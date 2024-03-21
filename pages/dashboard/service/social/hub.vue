<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <div class="flex gap-4 items-center">
            <NuxtLink :to="{ name: 'dashboard-service-social' }">
              <span class="icon-back text-2xl align-sub"></span>
            </NuxtLink>
            <div>
              <h1>{{ $t('social.chat.title') }}</h1>
            </div>
          </div>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <IconInfo
              v-if="$i18n.te('w3Warn.social.info') || $i18n.te('w3Warn.social.grillChat')"
              @click="modalW3WarnVisible = true"
            />
          </n-space>
        </template>
      </Heading>
    </template>
    <slot>
      <n-space v-if="chatStore.hasChats" class="pb-8" :size="32" vertical>
        <ActionsSocialChat @create-success="checkUnfinishedChat" />
        <TableSocialChat />
      </n-space>
      <Empty
        v-else
        :title="$t('social.chat.empty')"
        :info="$t('social.chat.emptyInfo')"
        icon="logo/grill-chat"
      >
        <Btn type="primary" @click="modalCreateChatVisible = true">
          {{ $t('social.chat.createFirst') }}
        </Btn>
      </Empty>

      <W3Warn v-model:show="modalW3WarnVisible">
        <p>{{ $t('w3Warn.social.info') }}</p>
        <p>
          <Btn type="link" href="https://grill.chat/">Grill.chat</Btn>
          {{ $t('w3Warn.social.grillChat') }}
        </p>
      </W3Warn>

      <!-- Modal - Create Chat -->
      <modal v-model:show="modalCreateChatVisible" :title="$t('social.chat.new')">
        <FormSocialChat
          @submit-success="modalCreateChatVisible = false"
          @create-success="checkUnfinishedChat"
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const chatStore = useChatStore();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.SOCIAL_NEW);

let chatInterval: any = null as any;
const pageLoading = ref<boolean>(true);
const modalCreateChatVisible = ref<boolean | null>(false);

useHead({
  title: $i18n.t('dashboard.nav.social'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await chatStore.getChats();

      checkUnfinishedChat();

      pageLoading.value = false;
    });
  }, 100);
});

onUnmounted(() => {
  clearInterval(chatInterval);
});

/** Chat polling */
function checkUnfinishedChat() {
  clearInterval(chatInterval);

  const unfinishedChat = chatStore.items.find(item => item.status < SocialStatus.ACTIVE);
  if (unfinishedChat === undefined) {
    return;
  }

  chatInterval = setInterval(async () => {
    const chats = await chatStore.fetchChats(chatStore.pagination.page, false);
    const chat = chats.find(item => item.space_uuid === unfinishedChat.space_uuid);
    if (!chat || chat.status >= SocialStatus.ACTIVE) {
      clearInterval(chatInterval);
    }
  }, 30000);
}
</script>
