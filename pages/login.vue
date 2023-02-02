<template>
  <div>
    <h2 class="mb-4 text-center sm:text-left">{{ $t('login.title') }}</h2>
    <p class="mb-11">{{ $t('login.description') }}</p>
    <template v-if="isFeatureEnabled(Feature.WALLET_LOGIN, authStore.getUserRoles())">
      <AuthWalletConnect class="w-full mb-2" />
    </template>
    <template v-if="isFeatureEnabled(Feature.MAGIC_LINK, authStore.getUserRoles())">
      <Btn type="secondary" class="w-full">
        {{ $t('login.magicLink') }}
      </Btn>
    </template>
    <div class="my-8 flex items-center">
      <span class="bg-white h-[1px] w-full"></span>
      <strong class="inline-block px-5 mx-[8%] text-body whitespace-nowrap">
        <template
          v-if="
            isFeatureEnabled(Feature.WALLET_LOGIN, authStore.getUserRoles()) ||
            isFeatureEnabled(Feature.MAGIC_LINK, authStore.getUserRoles())
          "
        >
          {{ $t('login.orUseEmail') }}
        </template>
        <template v-else>{{ $t('login.withEmail') }}</template>
      </strong>
      <span class="bg-white h-[1px] w-full"></span>
    </div>

    <AuthFormLogin />

    <div class="mt-2 text-center">
      <span class="text-sm text-body">{{ $t('login.dontHaveAccount') }} </span>&nbsp;
      <Btn :to="{ name: 'register' }" type="link">
        {{ $t('general.signup') }}
      </Btn>
    </div>

    <AuthSocial />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: t('login.title'),
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.LOGIN;
});
</script>
