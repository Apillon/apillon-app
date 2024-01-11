<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.nav.social') }}</h1>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <IconInfo v-if="$i18n.te('w3Warn.social.new')" @click="modalW3WarnVisible = true" />
          </n-space>
        </template>
      </Heading>
    </template>
    <slot>
      <n-space v-if="chatStore.hasChats" class="pb-8" :size="32" vertical>
        <ActionsSocialChat @create-success="onChatCreated" />
        <TableSocialChat />
      </n-space>
      <Empty
        v-else
        :title="$t('social.chat.empty')"
        :info="$t('social.chat.emptyInfo')"
        icon="storage/empty"
      >
        <Btn type="primary" @click="showModalCreateChat()">
          {{ $t('social.chat.createFirst') }}
        </Btn>
      </Empty>

      <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnHide">
        {{ $t('w3Warn.chat.new') }}
      </W3Warn>

      <!-- Modal - Create Chat -->
      <modal v-model:show="modalCreateChatVisible" :title="$t('social.chat.new')">
        <FormSocialChat
          @submit-success="modalCreateChatVisible = false"
          @create-success="onChatCreated"
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const chatStore = useChatStore();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.CONTRACT_NEW);

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

function showModalCreateChat() {
  if (localStorage.getItem(LsW3WarnKeys.CONTRACT_NEW) || !$i18n.te('w3Warn.chat.new')) {
    modalCreateChatVisible.value = true;
  } else {
    modalW3WarnVisible.value = true;
    modalCreateChatVisible.value = null;
  }
}

/** When user close W3Warn, allow him to create new bucket */
function onModalW3WarnHide() {
  if (modalCreateChatVisible.value !== false) {
    modalCreateChatVisible.value = true;
  }
}

function onChatCreated(chat: ChatInterface) {
  router.push(`/dashboard/service/social/${chat.space_uuid}`);
}

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
