<template>
  <div class="w-full flex flex-col justify-center items-center">
    <div class="w-full text-center">
      <div class="mb-7 text-center text-blue">
        <span class="icon-wow text-[34px]"></span>
      </div>
      <h2 class="mb-2 text-center">{{ $t('auth.signup.emailConfirmed') }}</h2>
      <p class="mb-7">{{ $t('auth.signup.enterDesiredPassword') }}</p>

      <FormPassword class="mx-auto max-w-lg text-left" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const $i18n = useI18n();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: $i18n.t('auth.signup.emailConfirmed'),
});

onMounted(() => {
  /** Track Registration start */
  setTimeout(() => {
    trackEvent('registration_email_confirmed');
  }, 1000);
});
</script>
