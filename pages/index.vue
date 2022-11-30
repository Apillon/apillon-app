<template>
  <!-- Notification examples -->
  <Notification class="mt-5">
    Authentication service was successfully attached. Below enter the name and select desired
    network.
  </Notification>
  <Notification type="info" class="mt-5">
    Authentication service was successfully attached. Below enter the name and select desired
    network.
  </Notification>
  <Notification type="warning" class="mt-5">
    Authentication service was successfully attached. Below enter the name and select desired
    network.
  </Notification>
  <Notification type="error" class="mt-5">
    Authentication service was successfully attached. Below enter the name and select desired
    network.
  </Notification>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

onBeforeMount(() => {
  if (authStore.loggedIn) {
    router.push({ name: 'dashboard' });
  }
  router.push({ name: 'login' });
});
</script>
