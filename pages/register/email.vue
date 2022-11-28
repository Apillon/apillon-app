<template>
  <div class="w-full flex flex-col justify-center items-center">
    <div class="text-center max-w-[550px]">
      <div class="mb-7 text-center text-blue">
        <span class="icon-new text-[34px]"></span>
      </div>
      <h2 class="mb-7">{{ $t('signup.checkEmail') }}</h2>
      <p class="mb-12 whitespace-pre-line">
        {{ $t('signup.emailSent', { email: authStore.email }) }}
      </p>

      <strong class="inline-block mb-4">{{ $t('signup.checkInbox') }}</strong>
      <AuthFormSignup :send-again="hasEmail" />

      <div class="mt-10 text-center">
        <span class="text-sm text-grey"> {{ $t('signup.madeMistake') }} </span>&nbsp;
        <Btn type="link" :to="{ name: 'register' }">
          {{ $t('general.tryAgain') }}
        </Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore();
const router = useRouter();
const { t } = useI18n();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: t('signup.checkEmail'),
});

onMounted(() => {
  authStore.authStep = AuthStep.SIGN_UP_EMAIL;

  /** If user hasn't signup, redirect him to signup form */
  if (!hasEmail.value) {
    router.push({ name: 'register' });
  }
});

/** If user has written his email on signup, then allow him to send email again */
const hasEmail = computed(() => {
  return authStore.email && authStore.email.length > 0;
});
</script>
