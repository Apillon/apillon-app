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

      <FormProject
        class="max-w-[520px]"
        @submit-active="loaderStatus"
        @submit-success="projectCreated"
      />

      <div class="mt-10">
        <NuxtLink :to="{ name: 'dashboard' }" class="text-grey text-bold">
          {{ $t('login.skip') }}
        </NuxtLink>
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
const router = useRouter();

definePageMeta({
  layout: 'onboarding',
});
useHead({
  title: 'SignUp - e-mail seccessfully confirmed',
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.LOGIN_FIRST;
});

function loaderStatus(status: boolean) {
  if (status) {
    loading.value = status;
  } else {
    setTimeout(() => {
      loading.value = status;
    }, 2001);
  }
}

/** Credirect after project has been created */
function projectCreated() {
  setTimeout(() => {
    router.push({ name: 'dashboard' });
  }, 2000);
}
</script>

<style lang="postcss" module>
.loader {
  height: 70vh;
  max-height: calc(100vh - 350px);
}
</style>
