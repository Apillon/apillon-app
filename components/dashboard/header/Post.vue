<template>
  <Heading>
    <slot>
      <div class="flex gap-4 items-center">
        <NuxtLink :to="{ name: 'dashboard-service-social' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <div>
          <h2>{{ postStore.active.name }}</h2>
          <TableEllipsis :prefix="$t('social.chat.uuid')" :text="postStore.active.post_uuid" />
        </div>
      </div>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <n-button v-if="postStore.active.hubId" size="small" @click="modalInfoVisible = true">
          <span class="text-primary"> {{ $t('social.chat.showSettings') }}</span>
        </n-button>
      </n-space>
    </template>
  </Heading>

  <!-- Modal - Create Service -->
  <modal v-model:show="modalInfoVisible" :title="$t('social.chat.settings')">
    <GrillChatSettings :space-id="postStore.active.hubId?.toString()" />
  </modal>
</template>

<script lang="ts" setup>
const postStore = usePostStore();

const modalInfoVisible = ref<boolean>(false);
</script>
