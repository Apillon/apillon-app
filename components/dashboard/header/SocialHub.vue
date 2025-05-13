<template>
  <Heading>
    <slot>
      <div class="flex items-center gap-4">
        <NuxtLink :to="{ name: 'dashboard-service-social' }">
          <span class="icon-back align-sub text-2xl"></span>
        </NuxtLink>
        <div>
          <h1>{{ $t('social.chat.title') }}</h1>
        </div>
      </div>
    </slot>

    <template #info>
      <n-space :size="32" align="center">
        <IconInfo
          v-if="$te('w3Warn.social.info') || $te('w3Warn.social.grillChat')"
          @click="modalW3WarnVisible = true"
        />
      </n-space>
    </template>

    <template #submenu>
      <MenuSocialHub />
    </template>
  </Heading>

  <W3Warn v-model:show="modalW3WarnVisible">
    <p>{{ $t('w3Warn.social.info') }}</p>
    <p>
      <Btn type="link" href="https://grill.chat/">Grill.chat</Btn>
      {{ $t('w3Warn.social.grillChat') }}
    </p>
  </W3Warn>
</template>

<script lang="ts" setup>
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.SOCIAL_NEW);
</script>
