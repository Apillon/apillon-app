<template>
  <div class="w-full flex flex-col justify-center items-center">
    <div class="text-center">
      <div class="mb-7 text-center text-blue">
        <span class="icon-wow text-[34px]"></span>
      </div>
      <h2 class="mb-6 text-center">{{ $t('signup.emailConfirmed') }}</h2>
      <p class="mb-7">{{ $t('signup.enterDesiredPassword') }}</p>

      <FormPassword class="mx-auto max-w-[520px] text-left" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: 'SignUp - e-mail seccessfully confirmed',
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.SIGN_UP_CONFIRMED;
});
</script>
