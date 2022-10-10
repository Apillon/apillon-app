<template>
  <div class="bg-gradientDarkReverse">
    <div v-if="!isFooterHidden" class="container py-6 pt-24">
      <div class="flex items-center">
        <div class="flex md:w-1/2 justify-center md:justify-start">
          <span class="text-grey-light">{{ $t('general.copyrights') }}</span>
        </div>
        <div class="flex md:w-1/2 justify-center md:justify-end">
          <ul class="body-sm flex text-white">
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
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';

const authStore = useAuthStore();

const isFooterHidden = computed(() => {
  return authStore.authStep === AuthStep.LOGIN || authStore.authStep === AuthStep.SIGN_UP;
});
</script>

<style lang="postcss" scoped>
ul {
  li + li {
    @apply ml-10;
  }
}
</style>
