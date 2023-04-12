<template>
  <div class="flex items-center w-full mb-8 md:mb-12 lg:mb-16">
    <div class="flex flex-auto pr-3 sm:pr-0">
      <Logo :width="162" :height="28" />
    </div>

    <div v-if="authStore.loggedIn || true" class="flex w-1/2 items-end justify-end">
      <HeaderProfile />
    </div>
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
</script>
