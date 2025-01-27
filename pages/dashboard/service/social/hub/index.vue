<template>
  <Dashboard :key="chatStore.items.length" :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderSocialHub />
      </div>
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

    <template v-if="chatStore.hasChats" #learn>
      <GrillChat v-if="postStore.settings" :style="scrollStyle" />
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const chatStore = useChatStore();
const postStore = usePostStore();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.SOCIAL_NEW);

let chatInterval: any = null as any;
const headingRef = ref<HTMLElement>();
const pageLoading = ref<boolean>(true);
const modalCreateChatVisible = ref<boolean | null>(false);

useHead({
  title: t('dashboard.nav.social'),
});

const scrollStyle = computed(() => {
  return {
    height: `calc(100dvh - ${184 + (headingRef.value?.clientHeight || 73)}px)`,
  };
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await chatStore.getChats();
      checkUnfinishedChat();

      /** Set first Hub as default */
      if (!chatStore.active?.spaceId && chatStore.items.length) {
        chatStore.active = chatStore.items[0];
      }
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
