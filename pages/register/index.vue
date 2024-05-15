<template>
  <div>
    <!-- Heading -->
    <h1 class="mb-2 text-center sm:text-left">
      {{
        route.query.REF === 'ZIGGI' ? $t('auth.signup.titleReferalZiggi') : $t('auth.signup.signup')
      }}
    </h1>

    <!-- Separator -->
    <SeparatorText
      v-if="!authStore.wallet.signature && !allowWalletRegister"
      :border-left="allowWalletRegister"
    >
      <template v-if="authStore.wallet.signature">
        <span class="lowercase">{{ $t('auth.signup.walletEmail') }}</span>
      </template>
      <template v-else-if="!allowWalletRegister">
        {{ $t('auth.signup.withEmail') }}
      </template>
    </SeparatorText>

    <!-- Form -->
    <AuthFormSignup />

    <!-- Links -->
    <n-space class="mt-8" vertical>
      <div>
        <span class="text-sm text-body">{{ $t('auth.signup.alreadyHaveAccount') }} </span>&nbsp;
        <Btn type="builders" size="tiny" inner-class="text-sm" :to="{ name: 'login' }">
          {{ $t('general.login') }}
        </Btn>
      </div>
    </n-space>

    <!-- Separator -->
    <SeparatorText :border-left="allowWalletRegister">
      <template v-if="allowWalletRegister">
        {{ $t('auth.signup.withWallet') }}
      </template>
    </SeparatorText>

    <!-- Wallet -->
    <AuthWalletLogin
      v-if="allowWalletRegister && !walletRegister"
      class="w-full"
      register
      @register="onWalletRegister"
    />
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
