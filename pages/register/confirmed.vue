<template>
  <div class="flex w-full flex-col items-center justify-center">
    <div class="w-full text-center">
      <div class="mb-10 text-center">
        <AnimationLoader v-if="isWalletRegister" />
        <NuxtIcon v-else name="dashboard/success" class="mx-auto inline-block text-8xl text-green" filled />
      </div>
      <h4 class="mb-4 text-center">{{ $t('auth.signup.emailConfirmed') }}</h4>
      <p v-if="isWalletRegister">{{ $t('auth.signup.walletConfirmed') }}</p>
      <p v-else>{{ $t('auth.signup.setPassword') }}</p>

      <FormPassword class="mx-auto mt-10 max-w-lg text-left" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { query } = useRoute();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: t('auth.signup.emailConfirmed'),
});

const isWalletRegister = computed(() => query.walletLogin === 'true');

onMounted(() => {
  /** Track Registration start */
  setTimeout(() => {
    trackEvent('registration_email_confirmed');
  }, 1000);
});
</script>
