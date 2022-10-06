<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div class="container py-6">
    <div class="flex items-center">
      <div class="flex md:w-1/2 justify-center md:justify-start">
        <span class="text-grey-bright">{{ $t('general.copyrights') }}</span>
      </div>
      <div class="flex md:w-1/2 justify-center md:justify-end">
        <ul class="body-sm flex" :class="linksClass">
          <li>
            <NuxtLink to="/">{{ $t('footer.support') }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/docs">{{ $t('footer.docs') }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/terms">{{ $t('footer.terms') }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/privacy">{{ $t('footer.privacy') }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';

const authStore = useAuthStore();

const linksClass = computed(() => {
  return [
    authStore.authStep === AuthStep.SIGN_UP ||
    authStore.authStep === AuthStep.SIGN_UP_CONFIRM ||
    authStore.authStep === AuthStep.SIGN_UP_CONFIRMED
      ? 'text-white'
      : 'tex-grey-bright',
  ];
});
</script>

<style lang="postcss" scoped>
ul {
  li + li {
    @apply ml-10;
  }
}
</style>
