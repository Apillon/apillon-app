<template>
  <Btn
    v-if="subscribed && subscribed === authStore.email"
    class="locked cursor-default"
    type="primary"
    size="large"
  >
    {{ $t('profile.marketing.subscribed') }}
  </Btn>
  <Btn v-else type="secondary" size="large" :loading="loading" @click="subscribe">
    {{ $t('profile.marketing.btn') }}
  </Btn>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();

const loading = ref(false);
const subscribed = ref<string | null>(localStorage.getItem(LS_KEY_NEWSLETTER));

/**
 * Subscribe person to newsletter - MailerLite
 */
async function subscribe() {
  loading.value = true;

  const subscribeResponse = await subscribeToNewsletter(authStore.email, authStore.username);

  if (subscribeResponse) {
    subscribed.value = authStore.email;
  }

  loading.value = false;
}
</script>
