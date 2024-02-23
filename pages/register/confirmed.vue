<template>
  <div class="w-full flex flex-col justify-center items-center">
    <div class="w-full text-center">
      <div class="mb-7 text-center text-blue">
        <AnimationLoader v-if="isWalletRegister" />
        <span v-else class="icon-wow text-[34px]"></span>
      </div>
      <h2 class="mb-2 text-center">{{ $t('auth.signup.emailConfirmed') }}</h2>
      <p v-if="isWalletRegister" class="mb-7">{{ $t('auth.signup.walletConfirmed') }}</p>
      <p v-else class="mb-7">{{ $t('auth.signup.enterDesiredPassword') }}</p>

      <FormPassword class="mx-auto max-w-lg text-left" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const { query } = useRoute();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: $i18n.t('auth.signup.emailConfirmed'),
});

const isWalletRegister = computed(() => query.walletLogin === 'true');

onMounted(() => {
  /** Track Registration start */
  setTimeout(() => {
    trackEvent('registration_email_confirmed');
  }, 1000);
});
</script>
