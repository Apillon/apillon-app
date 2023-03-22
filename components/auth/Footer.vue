<template>
  <div class="bg-gradientDarkReverse">
    <div v-if="!isFooterHidden" class="container py-6">
      <div class="flex items-center flex-wrap-reverse md:flex-nowrap">
        <div class="flex w-full md:w-1/2 justify-center md:justify-start">
          <span class="text-white">{{ $t('general.copyrights') }}</span>
          &nbsp;
          <span>{{ new Date().getFullYear() }}</span>
        </div>
        <div class="flex w-full md:w-1/2 justify-center md:justify-end mb-4 md:mb-0">
          <ul class="body-sm flex text-white">
            <li>
              <a href="mailto:info@apillon.io" target="_blank">{{ $t('auth.footer.support') }}</a>
            </li>
            <li>
              <NuxtLink href="https://wiki.apillon.io/" target="_blank">
                {{ $t('auth.footer.docs') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink href="https://apillon.io/legal-disclaimer" target="_blank">
                {{ $t('auth.footer.terms') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink href="https://apillon.io/privacy-policy/" target="_blank">
                {{ $t('auth.footer.privacy') }}
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
