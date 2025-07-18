<template>
  <Dashboard :loading="authStore.loadingProfile">
    <template #heading>
      <Heading :headline="$t('profile.mySettings')">
        <template #submenu>
          <MenuProfile />
        </template>
      </Heading>
    </template>
    <slot>
      <!-- Edit user profile -->
      <FormWrapper :title="$t('profile.accountInformation')">
        <FormUserProfile />
      </FormWrapper>

      <!-- Security -->
      <FormWrapper :title="$t('profile.security')">
        <!-- Change password -->
        <n-h5>{{ $t('profile.password.title') }}</n-h5>
        <p class="mb-4">{{ $t('profile.password.info') }}</p>
        <FormPasswordResetRequest class="w-full" :email="authStore.email">
          {{ $t('profile.password.btn') }}
        </FormPasswordResetRequest>

        <!-- Wallet Connect -->
        <AuthWalletConnect />

        <!-- EVM Wallet Connect -->
        <AuthWalletConnectEvm />

        <!-- 2FA -->
        <template v-if="isFeatureEnabled(Feature.TWO_FACTOR_AUTHENTICATION, authStore.getUserRoles())">
          <n-h5>{{ $t('profile.2fa') }}</n-h5>
          <p>{{ $t('profile.2faText') }}</p>
          <Btn class="my-8 w-full" type="secondary">{{ $t('profile.setup2fa') }}</Btn>
        </template>
      </FormWrapper>

      <!-- Marketing -->
      <FormWrapper
        v-if="isFeatureEnabled(Feature.MARKETING, authStore.getUserRoles())"
        class="mb-8"
        :title="$t('profile.marketing.title')"
      >
        <div class="mb-4">
          <p>{{ $t('profile.marketing.info') }}</p>
          <Btn class="inline-block text-sm" type="link" href="https://apillon.io/privacy-policy/" target="_blank">
            {{ $t('profile.marketing.privacy') }}
          </Btn>
        </div>
        <FormNewsletter />
      </FormWrapper>

      <!-- Modal - Change password -->
      <modal v-model:show="showModalChangePassword" :title="$t('profile.password.change')">
        <FormPassword :token="authStore.jwt" @submit-success="passwordChanged" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();

useHead({
  title: t('profile.mySettings'),
});

onMounted(async () => {
  await settingsStore.getOauthLinks();
});

/** Modal Change password */
const showModalChangePassword = ref(false);

/** Close modal after password has been changed */
function passwordChanged() {
  setTimeout(() => {
    showModalChangePassword.value = false;
  }, 2000);
}
</script>
