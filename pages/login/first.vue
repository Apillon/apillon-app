<template>
  <div class="flex xl:pt-8 md:pt-6 pt-4">
    <div class="md:w-1/2">
      <h1 class="mb-10">{{ $t('login.web3Gateway') }}</h1>
      <div class="grid grid-cols-2 gap-8 mb-8 lg:mb-16 md:mb-10">
        <div class="p-6 flex flex-col justify-between bg-grey-dark shadow-black">
          <div>
            <h4 class="mb-1">{{ $t('login.createWeb3Project') }}</h4>
            <p class="mb-4">{{ $t('login.buildCustomApp') }}</p>
          </div>
          <div>
            <Btn type="primary" class="w-full" @click="router.push('/login/project')">
              {{ $t('login.startBuilding') }}
            </Btn>
          </div>
        </div>
        <div class="p-6 flex flex-col justify-between bg-grey-dark shadow-black">
          <div>
            <h4 class="mb-1">{{ $t('login.demoProject') }}</h4>
            <p class="mb-4">{{ $t('login.walkThroughWeb3') }}</p>
          </div>
          <div>
            <Btn type="secondary" class="w-full">{{ $t('login.buildDemo') }}</Btn>
          </div>
        </div>
      </div>
      <NuxtLink to="/" class="text-grey text-bold">{{ $t('login.skip') }}</NuxtLink>
    </div>
    <AuthProjectHelp />
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';
const authStore = useAuthStore();
const router = useRouter();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: 'SignUp - e-mail seccessfully confirmed',
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.LOGIN_FIRST;
});
</script>
