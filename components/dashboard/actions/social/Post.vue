<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] max-w-xs">
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
      <n-button size="small" :loading="postStore.loading" @click="refresh()">
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new post -->
      <n-button size="small" :disabled="authStore.isAdmin()" @click="modalCreatePostVisible = true">
        <span class="icon-create-folder text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('social.post.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create Post -->
  <modal v-model:show="modalCreatePostVisible" :title="$t('social.post.new')">
    <FormSocialPost
      :space-uuid="spaceUuid"
      @submit-success="modalCreatePostVisible = false"
      @create-success="post => $emit('createSuccess', post)"
    />
  </modal>
</template>

<script lang="ts" setup>
const props = defineProps({
  spaceUuid: { type: String, required: true },
});
defineEmits(['createSuccess']);

const authStore = useAuthStore();
const chatStore = useChatStore();
const postStore = usePostStore();
const modalCreatePostVisible = ref<boolean>(false);

const isDisabled = computed<boolean>(() => {
  return chatStore.active.status < SocialStatus.ACTIVE;
});

async function refresh() {
  postStore.fetchPosts(props.spaceUuid);

  if (isDisabled.value) {
    chatStore.active = await chatStore.fetchChat(props.spaceUuid);
  }
}
</script>
