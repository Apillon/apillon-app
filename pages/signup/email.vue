<template>
  <div class="container flex flex-col justify-center items-center">
    <div class="text-center max-w-[510px]">
      <div class="mb-7 text-center text-blue">
        <span class="icon-new text-[34px]"></span>
      </div>
      <h2 class="mb-7">{{ $t('signup.checkEmail') }}</h2>
      <p class="mb-12 whitespace-pre-line">{{ $t('signup.emailSent', { afna: '@' }) }}</p>

      <strong class="inline-block mb-4">{{ $t('signup.checkInbox') }}</strong>
      <Btn type="primary" class="w-full">
        <span class="icon-apillon-icon"></span>
        {{ $t('signup.sendAgain') }}
      </Btn>

      <div class="mt-10 text-center">
        <span class="text-sm text-grey"> {{ $t('signup.madeMistake') }} </span>&nbsp;
        <Btn to="/login" class="">
          {{ $t('general.tryAgain') }}
        </Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: 'SignUp - check your e-mail',
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.SIGN_UP_EMAIL;
});
</script>
