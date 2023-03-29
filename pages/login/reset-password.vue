<template>
  <div class="w-full">
    <!-- Headings -->
    <h1 class="mb-6">{{ $t('auth.login.resetPassword') }}</h1>
    <p class="mb-2 text-body">{{ $t('auth.login.enterYourEmail') }}</p>

    <!-- Form -->
    <FormPasswordResetRequest btn-type="primary" />

    <!-- Links -->
    <n-space vertical>
      <div>
        <span class="text-sm text-body">{{ $t('auth.login.dontHaveAccount') }} </span>&nbsp;
        <NuxtLink :to="{ name: 'register' }">
          <Btn type="builders" size="tiny" inner-class="text-sm">
            {{ $t('general.signup') }}
          </Btn>
        </NuxtLink>
      </div>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: t('auth.login.resetPassword'),
});
</script>
