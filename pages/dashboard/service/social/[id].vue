<template>
  <Dashboard :loading="pageLoading" :learn-collapsible="false">
    <template #heading>
      <div ref="headingRef">
        <HeaderPost />
      </div>
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <ActionsSocialPost :space-uuid="chatUuid" @create-success="checkUnfinishedPost" />
        <TableSocialPost :space-uuid="chatUuid" />
      </n-space>
    </slot>
    <template #learn> <GrillChat v-if="postStore.settings" :style="scrollStyle" /> </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const { params } = useRoute();
const router = useRouter();
const $i18n = useI18n();
const dataStore = useDataStore();
const chatStore = useChatStore();
const postStore = usePostStore();

let postInterval: any = null as any;
const pageLoading = ref<boolean>(true);
const headingRef = ref<HTMLElement>();

/** Space UUID from route */
const chatUuid = ref<string>(`${params?.id}` || `${params?.slug}` || '');

useHead({
  title: $i18n.t('dashboard.nav.social'),
});

const scrollStyle = computed(() => {
  return {
    height: `calc(100dvh - ${120 + (headingRef.value?.clientHeight || 73)}px)`,
  };
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const currentChat = await chatStore.getChat(chatUuid.value);

      if (!currentChat?.space_uuid) {
        router.push({ name: 'dashboard-service-social' });
      } else {
        chatStore.active = currentChat;

        await postStore.getPosts();
        checkUnfinishedPost();

        pageLoading.value = false;
      }
    });
  }, 100);
});

onUnmounted(() => {
  clearInterval(postInterval);
});

/** Post polling */
function checkUnfinishedPost() {
  clearInterval(postInterval);

  const unfinishedPost = postStore.items.find(item => item.status < SocialStatus.ACTIVE);
  if (unfinishedPost === undefined) {
    return;
  }

  postInterval = setInterval(async () => {
    const posts = await postStore.fetchPosts(postStore.pagination.page, false);
    const post = posts.find(item => item.post_uuid === unfinishedPost.post_uuid);
    if (!post || post.status >= SocialStatus.ACTIVE) {
      clearInterval(postInterval);
    }
  }, 30000);
}
</script>
