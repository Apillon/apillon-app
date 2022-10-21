<template>
  <div>
    <h2 class="text-white mb-4">{{ $t('login.title') }}</h2>
    <p class="text-white mb-11">{{ $t('login.description') }}</p>

    <WalletConnect class="w-full mb-2" />
    <Btn type="secondary" class="w-full">
      {{ $t('login.magicLink') }}
    </Btn>
    <div class="my-8 flex items-center">
      <span class="bg-grey-light h-[1px] w-full"></span>
      <strong class="inline-block px-5 mx-[8%] text-grey whitespace-nowrap">
        {{ $t('login.useEmail') }}
      </strong>
      <span class="bg-grey-light h-[1px] w-full"></span>
    </div>

    <AuthFormLogin />

    <div class="mt-10 text-center">
      <span class="text-sm text-grey">{{ $t('login.dontHaveAccount') }} </span>&nbsp;
      <Btn to="/signup" type="link">
        {{ $t('general.signup') }}
      </Btn>
    </div>

    <AuthSocial />
  </div>
</template>

<script lang="ts" setup>
import WalletConnect from '../../components/auth/WalletConnect.vue';
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: 'Log in',
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.LOGIN;
});
</script>
