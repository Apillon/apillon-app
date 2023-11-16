<template>
  <div>
    <!-- Heading -->
    <h1 class="mb-2 text-center sm:text-left">{{ $t('auth.signup.title') }}</h1>
    <p class="mb-7 text-body">{{ $t('auth.signup.description') }}</p>

    <!-- Apillon Oauth -->
    <template v-if="isFeatureEnabled(Feature.APILLON_REGISTER, authStore.getUserRoles())">
      <Btn type="secondary" class="w-full">
        <span class="icon-apillon-icon"></span>
        {{ $t('auth.signup.continueWithAT') }}
      </Btn>
    </template>

    <!-- Separator -->
    <SeparatorText>
      <template v-if="isFeatureEnabled(Feature.APILLON_REGISTER, authStore.getUserRoles())">
        {{ $t('auth.signup.orUseEmail') }}
      </template>
      <template v-else>{{ $t('auth.signup.withEmail') }}</template>
    </SeparatorText>

    <!-- Form -->
    <AuthFormSignup />

    <!-- Links -->
    <n-space vertical>
      <div>
        <span class="text-sm text-body">{{ $t('auth.signup.alreadyHaveAccount') }} </span>&nbsp;
        <Btn type="builders" size="tiny" inner-class="text-sm" :to="{ name: 'login' }">
          {{ $t('general.login') }}
        </Btn>
      </div>
    </n-space>
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

onMounted(() => {
  /** Track Registration start */
  setTimeout(() => {
    trackEvent('registration_start');
  }, 1000);
});
</script>
