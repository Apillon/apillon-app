<template>
  <transition name="fade">
    <div class="container">
      <div class="md:w-1/2 max-w-md">
        <h2 class="text-white">{{ $t('login.title') }}</h2>
        <p class="text-white mb-5">{{ $t('login.description') }}</p>

        <Btn type="secondary" class="w-full mb-2">
          {{ $t('login.wallet') }}
        </Btn>
        <Btn type="secondary" class="w-full">
          {{ $t('login.magicLink') }}
        </Btn>
        <div class="mt-6 mb-8 flex items-center">
          <span class="bg-grey-lighter h-[1px] w-full"></span>
          <span class="inline-block mx-[30px] text-grey-bright whitespace-nowrap">
            {{ $t('login.useEmail') }}
          </span>
          <span class="bg-grey-lighter h-[1px] w-full"></span>
        </div>

        <FormSignupEmail />

        <span class="text-sm text-grey-light">{{ $t('login.dontHaveAccount') }} </span>&nbsp;
        <NuxtLink to="/signup" class="text-sm text-purple font-bold">
          {{ $t('general.signup') }}
        </NuxtLink>

        <AuthSocial />
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
  title: 'AuthTrail',
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.LOGIN;
});
</script>
