<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-if="archive" v-model:value="chatStore.archive.search" />
      <FormFieldSearch v-else v-model:value="chatStore.search" />
    </div>

    <n-space size="large">
      <!-- Modal Price list for Social -->
      <ModalCreditCosts :service="ServiceTypeName.SOCIAL" />

      <!-- Refresh chats -->
      <n-button
        size="medium"
        :loading="chatStore.loading"
        @click="archive ? chatStore.fetchChatArchive() : chatStore.fetchChats()"
      >
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new chat -->
      <n-button size="medium" :disabled="authStore.isAdmin()" @click="modalCreateChatVisible = true">
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('social.chat.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create Chat -->
  <modal v-model:show="modalCreateChatVisible" :title="$t('social.chat.new')">
    <FormSocialChat
      @submit-success="modalCreateChatVisible = false"
      @create-success="chat => $emit('createSuccess', chat)"
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
const chatStore = useChatStore();
const modalCreateChatVisible = ref<boolean>(false);
</script>
