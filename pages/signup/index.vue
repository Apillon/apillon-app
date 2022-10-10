<template>
  <div>
    <h2>{{ $t('signup.title') }}</h2>
    <p class="text-grey-bright mb-5">{{ $t('signup.description') }}</p>

    <Btn type="secondary" class="w-full">
      <span class="icon-apillon-icon"></span>
      {{ $t('signup.continueWithAT') }}
    </Btn>
    <div class="my-8 flex items-center">
      <span class="bg-grey-light h-[1px] w-full"></span>
      <strong class="inline-block px-5 mx-[8%] text-grey whitespace-nowrap">
        {{ $t('signup.useEmail') }}
      </strong>
      <span class="bg-grey-light h-[1px] w-full"></span>
    </div>

    <AuthFormSignup />

    <div class="mt-10 text-center">
      <span class="text-sm text-grey"> {{ $t('signup.alreadyHaveAccount') }} </span>&nbsp;
      <Btn to="/login" class="">
        {{ $t('general.login') }}
      </Btn>
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
  title: 'SignUp',
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.SIGN_UP;
});
</script>
