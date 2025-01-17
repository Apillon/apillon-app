<template>
  <div class="sticky -bottom-4 -mx-2 mb-2 flex items-center justify-between bg-bg-dark px-5 py-2">
    <strong>Mark all as read</strong>
    <span>Only show unread</span>
    <n-switch v-model:value="showUnread" class="" />
  </div>
</template>

<script lang="ts" setup>
const showUnread = ref<boolean>(true);
</script>
