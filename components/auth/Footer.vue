<template>
  <div class="bg-gradientDarkReverse">
    <div v-if="!isFooterHidden" class="container py-6 pt-24">
      <div class="flex items-center flex-wrap-reverse md:flex-nowrap">
        <div class="flex w-full md:w-1/2 justify-center md:justify-start">
          <span class="text-grey-light">{{ $t('general.copyrights') }}</span>
        </div>
        <div class="flex w-full md:w-1/2 justify-center md:justify-end mb-4 md:mb-0">
          <ul class="body-sm flex text-white">
            <li>
              <NuxtLink :to="{ name: 'support' }">{{ $t('footer.support') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink href="https://wiki.apillon.io/" target="_blank">
                {{ $t('footer.docs') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink href="https://apillon.io/legal-disclaimer" target="_blank">
                {{ $t('footer.terms') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink href="https://apillon.io/privacy-policy/" target="_blank">
                {{ $t('footer.privacy') }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();

const isFooterHidden = computed(() => {
  return (
    authStore.authStep === AuthStep.SIGN_UP_EMAIL ||
    authStore.authStep === AuthStep.SIGN_UP_CONFIRMED
  );
});
</script>

<style lang="postcss" scoped>
ul {
  li + li {
    @apply ml-10;
  }
}
</style>
