<template>
  <n-checkbox-group
    v-if="metadataStore.csvAttributes.length > 0"
    v-bind="$attrs"
    v-model:value="metadataStore.csvSelectedAttributes"
  >
    <n-space vertical size="large">
      <n-space
        v-for="(column, key) in metadataStore.csvAttributes"
        :key="key"
        class="min-h-10"
        align="center"
        justify="space-between"
      >
        <n-checkbox v-if="!column?.hidden" :id="column.label" class="hide-box" :value="column.value">
          <n-switch :value="metadataStore.csvSelectedAttributes.includes(column.value)" />
          <strong :class="{ 'text-green': metadataStore.csvSelectedAttributes.includes(column.value) }">
            {{ column.label }}
          </strong>
        </n-checkbox>
        <select-options
          v-if="metadataStore.csvSelectedAttributes.includes(column.value)"
          v-model:value="column.display_type"
          :options="displayTypes"
          size="small"
          filterable
          clearable
        />
      </n-space>
    </n-space>
  </n-checkbox-group>
  <div v-else>
    <h6>{{ $t('nft.validation.csvMissingAttributes') }}</h6>
  </div>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const metadataStore = useMetadataStore();

onMounted(() => {
  selectAllAttributes();
});

const displayTypes = ref<Array<SelectOption>>([
  { value: 'string', label: 'String' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
  { value: 'boost_number', label: 'Boost number' },
  { value: 'boost_percentage', label: 'Boost percentage' },
]);

function selectAllAttributes() {
  metadataStore.csvSelectedAttributes = metadataStore.csvAttributes.map(item => item.value);
}
</script>
