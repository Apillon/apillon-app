<template>
  <div class="w-full text-center">
    <!-- Heading -->
    <h4 class="mb-2">{{ $t('auth.signup.checkEmail') }}</h4>
    <p class="my-4 whitespace-pre-line">
      {{ $t('auth.signup.emailSent') }}
    </p>

    <span class="text-sm">{{ authStore.email }}</span>
    <SeparatorText />

    <!-- Form -->
    <strong class="my-2 inline-block text-sm">{{ $t('auth.signup.checkInbox') }}</strong>
    <AuthFormSignup class="w-full" :send-again="hasEmail" />

    <!-- Links -->
    <div class="mt-10">
      <span class="text-sm text-body">{{ $t('auth.signup.madeMistake') }} </span>&nbsp;
      <Btn type="builders" size="tiny" inner-class="text-sm" :to="{ name: 'register' }">
        {{ $t('auth.signup.fix') }}
      </Btn>
    </div>
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
