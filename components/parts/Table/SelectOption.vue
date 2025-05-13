<template>
  <select-options v-model:value="selected" :placeholder="$t('form.placeholder.select')" size="small" filterable />
</template>

<script lang="ts" setup>
const attrs = useAttrs();
const emit = defineEmits(['change']);

const selected = computed({
  get() {
    return attrs.model;
  },
  set(newValue): void {
    emit('change', newValue);
  },
});
</script>
