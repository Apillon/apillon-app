<template>
  <Dashboard :key="postStore.items.length" :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderSocial />
      </div>
    </template>

    <slot>
      <n-space v-if="postStore.hasPosts" class="pb-8" :size="32" vertical>
        <ActionsSocialPost @create-success="checkUnfinishedPost" />
        <TableSocialPost />
      </n-space>
      <Empty v-else :title="$t('social.post.empty')" :info="$t('social.post.emptyInfo')" icon="logo/grill-chat">
        <Btn type="primary" @click="modalCreatePostVisible = true">
          {{ $t('social.post.createFirst') }}
        </Btn>
      </Empty>

      <!-- Modal - Create Post -->
      <modal v-model:show="modalCreatePostVisible" :title="$t('social.post.new')">
        <FormSocialPost @submit-success="modalCreatePostVisible = false" @create-success="checkUnfinishedPost" />
      </modal>
    </slot>
    <template v-if="postStore.hasPosts" #learn>
      <GrillChat v-if="postStore.settings" :style="scrollStyle" />
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const postStore = usePostStore();

let postInterval: any = null as any;
const pageLoading = ref<boolean>(true);
const headingRef = ref<HTMLElement>();
const modalCreatePostVisible = ref<boolean | null>(false);

useHead({
  title: $i18n.t('dashboard.nav.social'),
});

const scrollStyle = computed(() => {
  return {
    height: `calc(100dvh - ${184 + (headingRef.value?.clientHeight || 73)}px)`,
  };
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await postStore.getPosts();
  checkUnfinishedPost();

  /** Set first chat as default */
  if (!postStore.active?.postId && postStore.items.length) {
    postStore.active = postStore.items[0];
  }

  pageLoading.value = false;
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
    const posts = await postStore.fetchPosts(postStore.pagination.page, postStore.pagination.pageSize, false);
    const post = posts.find(item => item.post_uuid === unfinishedPost.post_uuid);
    if (!post || post.status >= SocialStatus.ACTIVE) {
      clearInterval(postInterval);
    }
  }, 30000);
}
</script>
