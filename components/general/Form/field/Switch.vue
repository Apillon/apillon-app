<template>
  <div class="my-6 flex items-center text-sm">
    <span v-if="textInactive" :class="{ 'text-disabled': $attrs.value }"> {{ textInactive }}</span>
    <n-switch v-bind="$attrs" />
    <strong v-if="textActive" :class="[$attrs.value ? 'text-green' : 'text-disabled']"> {{ textActive }}</strong>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  textActive: { type: String, default: '' },
  textInactive: { type: String, default: '' },
});
</script>
