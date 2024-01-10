<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="chatStore.search"
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
      <!-- Refresh chats -->
      <n-button size="small" :loading="chatStore.loading" @click="chatStore.fetchChats()">
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new chat -->
      <n-button size="small" :disabled="authStore.isAdmin()" @click="modalCreateChatVisible = true">
        <span class="icon-create-folder text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('social.chat.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create Chat -->
  <modal v-model:show="modalCreateChatVisible" :title="$t('social.chat.new')">
    <FormSocialChat
      @submit-success="modalCreateChatVisible = false"
      @create-success="$emit('createSuccess')"
    />
  </modal>
</template>

<script lang="ts" setup>
defineEmits(['createSuccess']);
const authStore = useAuthStore();
const chatStore = useChatStore();
const modalCreateChatVisible = ref<boolean>(false);
</script>
