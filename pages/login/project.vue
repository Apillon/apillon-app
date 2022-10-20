<template>
  <div v-show="loading" class="w-full flex justify-center items-center" :class="$style.loader">
    <div>
      <AnimationLoader />
      <h3>{{ $t('login.loader') }}</h3>
    </div>
  </div>
  <div v-show="!loading" class="flex w-full xl:pt-10 lg:pt-8 md:pt-6 pt-4">
    <div class="md:w-1/2">
      <h3 class="mb-4">{{ $t('login.web3ProjectName') }}</h3>

      <AuthFormProject class="max-w-[520px]" @submit="startProject" />

      <div class="mt-10">
        <NuxtLink to="/" class="text-grey text-bold">{{ $t('login.skip') }}</NuxtLink>
      </div>
    </div>
    <AuthProjectHelp />
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';

const $style = useCssModule();
const authStore = useAuthStore();
const loading = ref<boolean>(false);

definePageMeta({
  layout: 'auth',
});
useHead({
  title: 'SignUp - e-mail seccessfully confirmed',
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.LOGIN_FIRST;
});

function startProject(status: boolean) {
  loading.value = status;
}
</script>

<style lang="postcss" module>
.loader {
  height: 70vh;
  max-height: calc(100vh - 350px);
}
</style>
