<template>
  <Btn
    v-if="subscribed && subscribed === authStore.email"
    class="locked cursor-default"
    type="primary"
    size="large"
  >
    {{ $t('profile.marketing.subscribed') }}
  </Btn>
  <Btn v-else type="secondary" size="large" :loading="loading" @click="subscribeToNewsletter">
    {{ $t('profile.marketing.btn') }}
  </Btn>
</template>

<script lang="ts" setup>
import queryString from 'query-string';

const LS_KEY = 'al_newsletter_subscribed';
const $i18n = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const loading = ref(false);
const subscribed = ref<string | null>(localStorage.getItem(LS_KEY));

/**
 * Subscribe person to newsletter - MailerLite
 */
async function subscribeToNewsletter() {
  if (!config.public.mailerLiteSubscribeUrl) {
    return;
  }
  loading.value = true;

  const data = {
    'fields[email]': authStore.email,
    'fields[firstName]': authStore.username,
    'ml-submit': 1,
    anticsrf: true,
    ajax: 1,
  };
  const URL =
    config.public.mailerLiteSubscribeUrl +
    '?' +
    queryString.stringify(data, { arrayFormat: 'comma' });

  try {
    await fetch(URL, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    }).then(response => response.json());

    window.$message.success($i18n.t('form.success.newsletter.subscribed'));

    localStorage.setItem(LS_KEY, authStore.email);
    subscribed.value = authStore.email;
  } catch (error: ApiError | ReferenceError | any) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
