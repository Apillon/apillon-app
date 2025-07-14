<template>
  <div>
    <!-- Heading -->
    <h1 class="mb-2">{{ $t('auth.login.resetPassword') }}</h1>
    <p class="mb-7 text-body">{{ $t('auth.login.enterNewPassword') }}</p>

    <!-- Form -->
    <FormPassword :reset-password="true" :token="query?.token?.toString()" @submit-success="passwordChanged" />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { query } = useRoute();
const router = useRouter();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: t('auth.login.resetPassword'),
});

onMounted(() => {
  if (!query.token || query.token.length < 100) {
    router.push({ name: 'register' });
  }
});

/** Close modal after password has been changed */
function passwordChanged() {
  setTimeout(() => {
    router.push({ name: 'login' });
  }, 2000);
}
</script>
