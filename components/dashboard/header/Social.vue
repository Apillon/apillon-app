<template>
  <Heading>
    <slot>
      <h1>{{ $t('dashboard.nav.social') }}</h1>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <n-button
          v-if="postStore.active.post_uuid || 1"
          size="small"
          @click="modalInfoVisible = true"
        >
          <span class="text-primary"> {{ $t('social.chat.showSettings') }}</span>
        </n-button>
        <IconInfo
          v-if="$te('w3Warn.social.info') || $te('w3Warn.social.grillChat')"
          @click="modalW3WarnVisible = true"
        />
      </n-space>
    </template>
  </Heading>

  <W3Warn v-model:show="modalW3WarnVisible">
    <p>{{ $t('w3Warn.social.info') }}</p>
    <p>
      <Btn type="link" href="https://grill.chat/">Grill.chat</Btn>
      {{ $t('w3Warn.social.grillChat') }}
    </p>
  </W3Warn>

  <!-- Modal - Create Service -->
  <modal v-model:show="modalInfoVisible" :title="$t('social.chat.settings')">
    <GrillChatSettings :space-id="chatStore.active.spaceId?.toString()" />
  </modal>
</template>

<script lang="ts" setup>
const chatStore = useChatStore();
const postStore = usePostStore();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.SOCIAL_NEW);

const modalInfoVisible = ref<boolean>(false);
</script>
