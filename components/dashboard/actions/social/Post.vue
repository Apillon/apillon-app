<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <n-input
        v-model:value="postStore.search"
        type="text"
        name="search"
        size="small"
        :placeholder="$t('general.search')"
        clearable
      >
        <template #prefix>
          <span class="icon-search text-2xl"></span>
        </template>
      </n-input>
    </div>

    <n-space size="large">
      <!-- Modal Price list for Social -->
      <ModalCreditCosts :service="ServiceTypeName.SOCIAL" />

      <!-- Refresh posts -->
      <n-button
        size="small"
        :loading="postStore.loading"
        @click="archive ? postStore.fetchPostsArchive() : postStore.fetchPosts()"
      >
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new post -->
      <n-button size="small" :disabled="authStore.isAdmin()" @click="modalCreatePostVisible = true">
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('social.post.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create Post -->
  <modal v-model:show="modalCreatePostVisible" :title="$t('social.post.new')">
    <FormSocialPost
      @submit-success="modalCreatePostVisible = false"
      @create-success="post => $emit('createSuccess', post)"
    />
  </modal>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/lib/types/service';

defineEmits(['createSuccess']);
defineProps({
  archive: { type: Boolean, default: false },
});

const authStore = useAuthStore();
const postStore = usePostStore();
const modalCreatePostVisible = ref<boolean>(false);

// const isDisabled = computed<boolean>(() => {
//   return chatStore.active.status < SocialStatus.ACTIVE;
// });
</script>
