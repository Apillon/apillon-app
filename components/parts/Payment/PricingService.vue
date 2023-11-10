<template>
  <div v-if="value" class="my-4">
    <small>{{ name }}</small>
    <p v-bind="$attrs" :class="innerClass">
      <strong class="text-white">{{ value }}</strong>
    </p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  name: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  innerClass: { type: String, default: '' },
});
</script>
