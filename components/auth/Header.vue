<template>
  <div class="mb-8 flex w-full items-center md:mb-12 lg:mb-16">
    <div class="pr-3 sm:pr-0">
      <Logo :width="162" :height="28" />
    </div>

    <div v-if="authStore.loggedIn" class="flex w-1/2 items-end justify-end">
      <HeaderProfile />
    </div>
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
</script>
