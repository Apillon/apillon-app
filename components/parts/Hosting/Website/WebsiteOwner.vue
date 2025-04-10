<template>
  <span v-if="owner" class="flex items-center gap-1 text-sm text-white">
    <img :src="avatar" alt="" class="h-6 w-6 rounded-lg" />
    <span>{{ owner }}</span>
    <span>/</span>
    <small>{{ dateTimeToMonthDay(date) }}</small>
  </span>
</template>

<script lang="ts" setup>
defineProps({
  avatar: { type: String, default: null },
  owner: { type: String, default: null },
  date: { type: String, default: null },
});
</script>
