<template>
  <Dashboard>
    <template #heading>
      <h4 class="-mb-2">{{ $t('dashboard.mySettings') }}</h4>
    </template>
    <slot>
      <div class="mb-4">
        <!-- Edit user profile -->
        <FormUserProfile />

        <div>
          <!-- Change password -->
          <n-h5 prefix="bar">{{ $t('dashboard.password') }}</n-h5>
          <Btn type="secondary">{{ $t('dashboard.changePassword') }}</Btn>

          <!-- 2FA -->
          <n-h5 class="mb-0" prefix="bar">{{ $t('dashboard.2fa') }}</n-h5>
          <p class="mb-6">{{ $t('dashboard.2faText') }}</p>
          <Btn type="secondary">{{ $t('dashboard.setup2fa') }}</Btn>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  title: t('dashboard.mySettings'),
});
</script>
