<template>
  <div class="w-full flex flex-col justify-center items-center">
    <div class="w-full text-center">
      <div class="mb-7 text-center text-blue">
        <span class="icon-wow text-[34px]"></span>
      </div>
      <h2 class="mb-6 text-center">{{ $t('signup.emailConfirmed') }}</h2>
      <p class="mb-7">{{ $t('signup.enterDesiredPassword') }}</p>

      <FormPassword class="mx-auto max-w-lg text-left" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: $i18n.t('signup.emailConfirmed'),
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.SIGN_UP_CONFIRMED;
});
</script>
