<template>
  <Dashboard>
    <template #heading>
      <h4 class="-mb-2">{{ $t('dashboard.mySettings') }}</h4>
    </template>
    <slot>
      <!-- Edit user profile -->
      <FormUserProfile />

      <div>
        <!-- Change password -->
        <n-h5 prefix="bar">{{ $t('dashboard.password') }}</n-h5>
        <FormPasswordResetRequest :email="authStore.email">
          {{ $t('dashboard.changePassword') }}
        </FormPasswordResetRequest>

        <!-- 2FA -->
        <n-h5 class="mb-0" prefix="bar">{{ $t('dashboard.2fa') }}</n-h5>
        <p class="mb-6">{{ $t('dashboard.2faText') }}</p>
        <Btn type="secondary">{{ $t('dashboard.setup2fa') }}</Btn>
      </div>

      <!-- Modal - Change password -->
      <n-modal v-model:show="showModalChangePassword">
        <n-card
          style="width: 660px"
          :title="$t('dashboard.changePassword')"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
        >
          <FormPassword :token="authStore.jwt" @submit-success="passwordChanged" />
        </n-card>
      </n-modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~~/stores/auth';

const $i18n = useI18n();
const authStore = useAuthStore();

useHead({
  title: $i18n.t('dashboard.mySettings'),
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
