<template>
  <Dashboard>
    <template #heading>
      <h4 class="-mb-2">{{ $t('profile.mySettings') }}</h4>
    </template>
    <slot>
      <!-- Edit user profile -->
      <FormUserProfile />

      <div>
        <!-- Change password -->
        <n-h5 prefix="bar">{{ $t('profile.password') }}</n-h5>
        <FormPasswordResetRequest :email="authStore.email">
          {{ $t('profile.changePassword') }}
        </FormPasswordResetRequest>

        <!-- 2FA -->
        <template v-if="isFeatureEnabled(Feature.TWO_FACTOR_AUTHENTICATION)">
          <n-h5 class="mb-0" prefix="bar">{{ $t('profile.2fa') }}</n-h5>
          <p class="mb-6">{{ $t('profile.2faText') }}</p>
          <Btn type="secondary">{{ $t('profile.setup2fa') }}</Btn>
        </template>
      </div>

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

useHead({
  title: $i18n.t('profile.mySettings'),
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
