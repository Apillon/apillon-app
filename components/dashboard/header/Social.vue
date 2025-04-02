<template>
  <Heading>
    <slot>
      <h1>{{ $t('dashboard.nav.social') }}</h1>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <n-button size="small" @click="$router.push({ name: 'dashboard-service-social-hub' })">
          <span class="text-primary"> {{ $t('social.post.manageHubs') }}</span>
        </n-button>
        <IconInfo
          v-if="$te('w3Warn.social.info') || $te('w3Warn.social.grillChat')"
          @click="modalW3WarnVisible = true"
        />
      </n-space>
    </template>
    <template #submenu>
      <MenuSocial />
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
