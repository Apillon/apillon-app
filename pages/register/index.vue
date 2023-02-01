<template>
  <div>
    <h2 class="text-center sm:text-left">{{ $t('signup.title') }}</h2>
    <p class="text-grey-bright mb-10">{{ $t('signup.description') }}</p>

    <template v-if="isFeatureEnabled(Feature.APILLON_REGISTER, authStore.getUserRoles())">
      <Btn type="secondary" class="w-full">
        <span class="icon-apillon-icon"></span>
        {{ $t('signup.continueWithAT') }}
      </Btn>
    </template>
    <div class="my-8 flex items-center">
      <span class="bg-white h-[1px] w-full"></span>
      <strong class="inline-block px-5 mx-[8%] text-grey whitespace-nowrap">
        <template v-if="isFeatureEnabled(Feature.APILLON_REGISTER, authStore.getUserRoles())">
          {{ $t('signup.orUseEmail') }}
        </template>
        <template v-else>{{ $t('signup.withEmail') }}</template>
      </strong>
      <span class="bg-white h-[1px] w-full"></span>
    </div>

    <AuthFormSignup />

    <div class="mt-10 text-center">
      <span class="text-sm text-grey"> {{ $t('signup.alreadyHaveAccount') }} </span>&nbsp;
      <Btn :to="{ name: 'login' }" type="link">
        {{ $t('general.login') }}
      </Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
