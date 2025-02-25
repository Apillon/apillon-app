<template>
  <div class="w-full">
    <!-- Heading -->
    <h4 class="mb-4 text-center sm:text-left">{{ $t('auth.login.title') }}</h4>
    <div class="mb-6">
      <span class="text-sm text-body">{{ $t('auth.login.dontHaveAccount') }} </span>&nbsp;
      <Btn type="builders" size="tiny" inner-class="text-sm" :to="{ name: 'register' }">
        {{ $t('general.signup') }}
      </Btn>
    </div>

    <!-- Form -->
    <AuthFormLogin />

    <SeparatorText border-left>
      {{ $t('general.or') }}
    </SeparatorText>

    <!-- Wallet -->
    <n-space size="large" vertical>
      <AuthLoginGoogle />
      <AuthWalletLogin v-if="isFeatureEnabled(Feature.WALLET_LOGIN, authStore.getUserRoles())" class="w-full" />
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { AuthLoginGoogle } from '#components';

const { t } = useI18n();
const { isLg } = useScreen();
const authStore = useAuthStore();
const oauthToken = ref<string | undefined>('');

definePageMeta({
  layout: 'auth',
});
useHead({
  title: t('auth.login.title'),
});

onMounted(async () => {
  oauthToken.value = await getOauthSession();
});

async function getOauthSession() {
  try {
    const { data } = await $api.get<OauthSessionResponse>(endpoints.oauthSession);
    return data.sessionToken;
  } catch (error) {
    console.error(error);
  }
}
</script>
