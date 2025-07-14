<template>
  <Btn v-if="subscribed && subscribed === authStore.email" class="locked cursor-default" type="primary" :size="size">
    {{ $t('profile.marketing.subscribed') }}
  </Btn>
  <Btn v-else type="secondary" :size="size" :loading="loading" @click="subscribe">
    <template v-if="btnText">
      {{ btnText }}
    </template>
    <template v-else>
      {{ $t('profile.marketing.btn') }}
    </template>
  </Btn>
</template>

<script lang="ts" setup>
import type { Size } from 'naive-ui/es/button/src/interface';

defineProps({
  size: { type: String as PropType<Size>, default: 'large' },
  btnText: { type: String, default: null },
});

const authStore = useAuthStore();

const loading = ref(false);
const subscribed = ref<string | null>(localStorage.getItem(LS_KEYS.NEWSLETTER));

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
