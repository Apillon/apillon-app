<template>
  <transition name="fade">
    <div class="container">
      <div class="md:w-1/2 max-w-md">
        <h2>{{ $t('signup.title') }}</h2>
        <p class="text-grey-bright mb-5">{{ $t('signup.description') }}</p>

        <Btn type="secondary" class="w-full">
          <span class="icon-apillon-icon"></span>
          {{ $t('signup.continueWithAT') }}
        </Btn>
        <div class="mt-14 mb-8 flex items-center">
          <span class="bg-grey-lighter h-[1px] w-full"></span>
          <span class="inline-block mx-[30px] text-grey-bright whitespace-nowrap">
            {{ $t('signup.useEmail') }}
          </span>
          <span class="bg-grey-lighter h-[1px] w-full"></span>
        </div>

        <Btn type="primary" class="w-full">
          {{ $t('general.continue') }}
        </Btn>

        <FormSignupEmail />

        <span class="text-sm text-grey-light">{{ $t('signup.alreadyHaveAccount') }} </span>&nbsp;
        <NuxtLink to="/login" class="text-sm text-purple font-bold">
          {{ $t('general.login') }}
        </NuxtLink>
      </div>
    </div>
  </transition>
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
