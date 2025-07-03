<template>
  <div>
    <!-- Heading -->
    <h4 class="mb-2 text-center sm:text-left">
      {{ route.query.REF === 'ZIGGI' ? $t('auth.signup.titleReferalZiggi') : $t('auth.signup.signup') }}
    </h4>

    <!-- Links -->
    <div class="my-5">
      <span class="text-sm text-body">{{ $t('auth.signup.alreadyHaveAccount') }} </span>&nbsp;
      <Btn type="builders" size="tiny" inner-class="text-sm" :to="{ name: 'login' }">
        {{ $t('general.login') }}
      </Btn>
    </div>

    <!-- Separator -->
    <SeparatorText v-if="authStore.wallet.signature" :border-left="true">
      <span class="lowercase">{{ $t('auth.signup.walletEmail') }}</span>
    </SeparatorText>

    <!-- Form -->
    <AuthFormSignup />

    <!-- Separator -->
    <SeparatorText v-if="!authStore.wallet.signature" :border-left="allowWalletRegister">
      <template v-if="allowWalletRegister">
        {{ $t('auth.signup.withWallet') }}
      </template>
    </SeparatorText>

    <!-- Wallet -->
    <n-space size="large" vertical>
      <AuthLoginGoogle register />
      <AuthWalletLogin
        v-if="allowWalletRegister && !walletRegister"
        class="w-full"
        register
        @register="onWalletRegister"
      />
    </n-space>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const route = useRoute();
const message = useMessage();
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: t('general.signup'),
});

const walletRegister = ref<boolean>(false);
const allowWalletRegister = computed<boolean>(
  () =>
    isFeatureEnabled(Feature.WALLET_LOGIN, authStore.getUserRoles()) &&
    (!authStore.wallet.signature || walletRegister.value)
);

onMounted(() => {
  /** Track Registration start */
  setTimeout(() => {
    trackEvent('registration_start');
  }, 1000);
});

function onWalletRegister() {
  walletRegister.value = true;

  message.info(t('auth.signup.walletEmail'));
}
</script>
