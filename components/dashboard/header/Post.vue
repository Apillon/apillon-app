<template>
  <Heading>
    <slot>
      <div class="flex gap-4 items-center">
        <NuxtLink :to="{ name: 'dashboard-service-social' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <div>
          <h2>{{ chatStore.active.name }}</h2>
          <TableEllipsis :prefix="$t('social.chat.uuid')" :text="chatStore.active.space_uuid" />
        </div>
      </div>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <n-button v-if="chatStore.active.spaceId" size="small" @click="modalInfoVisible = true">
          <span class="text-primary"> {{ $t('social.chat.showSettings') }}</span>
        </n-button>
      </n-space>
    </template>
  </Heading>

  <!-- Modal - Create Service -->
  <modal v-model:show="modalInfoVisible" :title="$t('social.chat.settings')">
    <GrillChatSettings :space-id="chatStore.active.spaceId?.toString()" />
  </modal>
</template>

<script lang="ts" setup>
const chatStore = useChatStore();

const modalInfoVisible = ref<boolean>(false);
</script>
