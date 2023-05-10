<template>
  <div>
    <!-- Heading -->
    <h1 class="mb-2 text-center sm:text-left">{{ $t('auth.login.title') }}</h1>
    <p class="mb-7 text-body">{{ $t('auth.login.description') }}</p>

    <!-- Wallet -->
    <template v-if="isLg && isFeatureEnabled(Feature.WALLET_LOGIN, authStore.getUserRoles())">
      <AuthWalletLogin class="w-full" />
    </template>

    <!-- Magic link -->
    <template v-if="isFeatureEnabled(Feature.MAGIC_LINK, authStore.getUserRoles())">
      <Btn type="secondary" class="w-full mt-2">
        <span class="icon-magic-link"></span>
        {{ $t('auth.login.magicLink') }}
      </Btn>
    </template>

    <!-- Separator -->
    <SeparatorText>
      <template
        v-if="
          (isLg && isFeatureEnabled(Feature.WALLET_LOGIN, authStore.getUserRoles())) ||
          isFeatureEnabled(Feature.MAGIC_LINK, authStore.getUserRoles())
        "
      >
        {{ $t('auth.login.orUseEmail') }}
      </template>
      <template v-else>{{ $t('auth.login.withEmail') }}</template>
    </SeparatorText>

    <!-- Form -->
    <AuthFormLogin />

    <!-- Links -->
    <n-space vertical>
      <div>
        <span class="text-sm text-body">{{ $t('auth.login.forgotPassword') }} </span>&nbsp;
        <NuxtLink :to="{ name: 'login-reset-password' }">
          <Btn type="builders" size="tiny" inner-class="text-sm">
            {{ $t('auth.login.resetHere') }}
          </Btn>
        </NuxtLink>
      </div>
      <div>
        <span class="text-sm text-body">{{ $t('auth.login.dontHaveAccount') }} </span>&nbsp;
        <NuxtLink :to="{ name: 'register' }">
          <Btn type="builders" size="tiny" inner-class="text-sm">
            {{ $t('general.signup') }}
          </Btn>
        </NuxtLink>
      </div>
    </n-space>

    <AuthSocial />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { isLg } = useScreen();
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: t('auth.login.title'),
});
</script>