<template>
  <Dashboard :loading="authStore.loadingProfile">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('profile.mySettings') }}</h1>
        </slot>

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
        <p class="text-body">{{ $t('profile.password.info') }}</p>
        <FormPasswordResetRequest class="w-full mt-8" :email="authStore.email">
          {{ $t('profile.password.btn') }}
        </FormPasswordResetRequest>

        <!-- Wallet Connect -->
        <AuthWalletConnect />

        <!-- 2FA -->
        <template
          v-if="isFeatureEnabled(Feature.TWO_FACTOR_AUTHENTICATION, authStore.getUserRoles())"
        >
          <n-h5>{{ $t('profile.2fa') }}</n-h5>
          <p class="text-body">{{ $t('profile.2faText') }}</p>
          <Btn class="w-full my-8" type="secondary">{{ $t('profile.setup2fa') }}</Btn>
        </template>
      </FormWrapper>

      <!-- Marketing -->
      <FormWrapper
        v-if="isFeatureEnabled(Feature.MARKETING, authStore.getUserRoles())"
        class="mb-8"
        :title="$t('profile.marketing')"
      >
        <p class="text-body mb-4">{{ $t('profile.marketingInfo') }}</p>
        <n-checkbox
          v-model:checked="marketing"
          size="medium"
          :label="$t('profile.marketingCheck')"
        />
      </FormWrapper>

      <!-- Modal - Change password -->
      <modal v-model:show="showModalChangePassword" :title="$t('profile.changePassword')">
        <FormPassword :token="authStore.jwt" @submit-success="passwordChanged" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const marketing = ref<boolean>(false);

useHead({
  title: $i18n.t('profile.mySettings'),
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
