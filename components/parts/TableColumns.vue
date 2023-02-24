<template>
  <n-checkbox-group v-bind="$attrs" v-model:value="selectedColumns">
    <n-space vertical class="p-3">
      <strong class="text-body mr-4">{{ $t('dashboard.visibleColumns') }}:</strong>
      <template v-for="column in columns">
        <n-checkbox
          v-if="!column?.hidden"
          :class="{ hidden: !!column?.hidden }"
          :value="column.value"
          :label="column.label"
        />
      </template>
    </n-space>
  </n-checkbox-group>
</template>

<script lang="ts" setup>
defineProps({
  columns: { type: Array<{ value: string; label: string; hidden?: boolean }>, default: [] },
});

const attrs = useAttrs();
const emit = defineEmits(['columnChange']);

const selectedColumns = computed<Array<string>>({
  get() {
    return attrs.model as Array<string>;
  },
  set(newValue): void {
    emit('columnChange', newValue);
  },
});
</script>
