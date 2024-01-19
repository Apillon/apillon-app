<template>
  <Heading>
    <slot>
      <div ref="headingRef">
        <n-space align="center" size="large">
          <NuxtLink :to="{ name: 'dashboard-service-social' }">
            <span class="icon-back text-2xl align-sub"></span>
          </NuxtLink>
          <h2>{{ chatStore.active.name }}</h2>

          <n-space class="" align="center" size="small" :wrap="false">
            <span>{{ $t('social.chat.uuid') }}:</span>
            <n-ellipsis class="text-body align-bottom" :line-clamp="1">
              {{ chatStore.active.space_uuid }}
            </n-ellipsis>
            <button class="text-body" @click="copyToClipboard(chatStore.active.space_uuid)">
              <span class="icon-copy"></span>
            </button>
          </n-space>
        </n-space>
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
    <GrillChatSettings
      v-if="chatStore.active.spaceId"
      :space-id="chatStore.active.spaceId.toString()"
    />
  </modal>
</template>

<script lang="ts" setup>
const chatStore = useChatStore();

const modalInfoVisible = ref<boolean>(false);
</script>
