<template>
  <div class="container flex flex-col justify-center items-center">
    <div class="text-center">
      <h1 class="mb-6">{{ $t('login.resetPassword') }}</h1>
      <p class="mb-7">{{ $t('login.enterNewPassword') }}</p>

      <FormPassword
        class="mx-auto max-w-lg text-left"
        :reset-password="true"
        :token="query?.token?.toString()"
        @submit-success="passwordChanged"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { query } = useRoute();
const router = useRouter();
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: t('login.resetPassword'),
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.PASSWORD_RESET;
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
