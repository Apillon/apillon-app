<template>
  <div class="w-full">
    <!-- Heading -->
    <h2 class="mb-2">{{ $t('auth.signup.checkEmail') }}</h2>
    <p class="mb-7 whitespace-pre-line">
      {{ $t('auth.signup.emailSent', { email: authStore.email }) }}
    </p>

    <!-- Form -->
    <strong class="inline-block mb-2">{{ $t('auth.signup.checkInbox') }}</strong>
    <AuthFormSignup :send-again="hasEmail" />

    <!-- Links -->
    <n-space vertical>
      <div>
        <span class="text-sm text-body">{{ $t('auth.signup.madeMistake') }} </span>&nbsp;
        <Btn type="builders" size="tiny" inner-class="text-sm" :to="{ name: 'register' }">
          {{ $t('general.tryAgain') }}
        </Btn>
      </div>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const router = useRouter();
const { t } = useI18n();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: t('auth.signup.checkEmail'),
});

onMounted(() => {
  /** If user hasn't signup, redirect him to signup form */
  if (!hasEmail.value) {
    router.push({ name: 'register' });
  }

  /** Track Registration start */
  setTimeout(() => {
    trackEvent('registration_email_sent');
  }, 1000);
});

/** If user has written his email on signup, then allow him to send email again */
const hasEmail = computed<boolean>(() => {
  return !!authStore.email && authStore.email.length > 0;
});
</script>
