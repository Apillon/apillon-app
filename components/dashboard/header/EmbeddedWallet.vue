<template>
  <Heading>
    <slot>
      <h1>{{ $t('dashboard.nav.embeddedWallet') }}</h1>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <n-button size="small" @click="$router.push({ name: '' })">
          <span class="icon-credits text-xl mr-2"></span>
          <span> {{ $t('embeddedWallet.checkPrice') }}</span>
        </n-button>
      </n-space>
    </template>
  </Heading>

  <!-- <W3Warn v-model:show="modalW3WarnVisible">
    <p>{{ $t('w3Warn.social.info') }}</p>
    <p>
      <Btn type="link" href="https://grill.chat/">Grill.chat</Btn>
      {{ $t('w3Warn.social.grillChat') }}
    </p>
  </W3Warn> -->
</template>

<script lang="ts" setup>
// const postStore = usePostStore();
// const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.SOCIAL_NEW);
</script>
