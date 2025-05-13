<template>
  <div class="body-sm mt-8 text-body md:mt-12 lg:mt-16">
    <n-space justify="space-between" :size="32">
      <span class="text-white">{{ $t('general.copyrights') }}</span>

      <n-space :size="32">
        <a href="mailto:info@apillon.io" target="_blank">{{ $t('auth.footer.support') }}</a>
        <NuxtLink href="https://wiki.apillon.io/" target="_blank">
          {{ $t('auth.footer.docs') }}
        </NuxtLink>
        <NuxtLink href="https://apillon.io/legal-disclaimer" target="_blank">
          {{ $t('auth.footer.terms') }}
        </NuxtLink>
        <NuxtLink href="https://apillon.io/privacy-policy/" target="_blank">
          {{ $t('auth.footer.privacy') }}
        </NuxtLink>
      </n-space>
    </n-space>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="postcss" scoped>
ul {
  li + li {
    @apply ml-8;
  }
}
</style>
