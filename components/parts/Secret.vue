<template>
  <div v-if="secret">
    <div v-if="title" class="body-sm mb-2">
      <strong>{{ title }}</strong>
      <span v-if="info" class="text-[11px]"> ({{ info }})</span>
    </div>
    <div class="relative">
      <n-input type="password" class="!bg-bg-dark" show-password-on="click" :value="secret" />
      <button
        v-if="copy"
        class="absolute right-4 top-1/2 ml-2 -translate-y-1/2 text-body"
        @click="copyToClipboard(secret)"
      >
        <span class="icon-copy"></span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  secret: { type: String, default: '' },
  title: { type: String, default: '' },
  info: { type: String, default: '' },
  copy: { type: Boolean, default: false },
});
</script>
