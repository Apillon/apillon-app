<template>
  <div v-show="loading" class="flex w-full items-center justify-center" :class="$style.loader">
    <div>
      <AnimationLoader />
      <h3>{{ $t('auth.onboarding.loader') }}</h3>
    </div>
  </div>
  <div v-show="!loading" class="flex w-full flex-wrap pt-4 md:pt-6 lg:pt-8 xl:pt-10">
    <div class="w-full md:w-1/2">
      <h3 class="mb-4">{{ $t('auth.onboarding.web3ProjectName') }}</h3>

      <FormProject class="md:max-w-lg" @submit-active="loaderStatus" @submit-success="projectCreated" />

      <div class="mt-10">
        <NuxtLink :to="{ name: 'dashboard' }" class="text-bold text-body">
          {{ $t('auth.onboarding.skip') }}
        </NuxtLink>
      </div>
    </div>
    <AuthProjectHelp />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const $style = useCssModule();
const loading = ref<boolean>(false);

definePageMeta({
  layout: 'onboarding',
});
useHead({
  title: t('auth.signup.emailConfirmed'),
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

/** Redirect after project has been created */
function projectCreated() {
  setTimeout(() => {
    router.push({ name: 'dashboard' });
  }, 2000);
}
</script>

<style lang="postcss" module>
.loader {
  height: 70vh;
  max-height: calc(100dvh - 350px);
}
</style>
