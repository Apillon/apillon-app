<template>
  <n-checkbox-group
    v-if="collectionStore.csvAttributes.length > 0"
    v-bind="$attrs"
    v-model:value="collectionStore.csvSelectedAttributes"
  >
    <n-space vertical size="large">
      <n-space
        v-for="(column, key) in collectionStore.csvAttributes"
        :key="key"
        class="min-h-[40px]"
        align="center"
        justify="space-between"
      >
        <n-checkbox v-if="!column?.hidden" class="hide-box" :id="column.label" :value="column.value">
          <n-switch :value="collectionStore.csvSelectedAttributes.includes(column.value)" />
          <strong :class="{ 'text-green': collectionStore.csvSelectedAttributes.includes(column.value) }">
            {{ column.label }}
          </strong>
        </n-checkbox>
        <select-options
          v-if="collectionStore.csvSelectedAttributes.includes(column.value)"
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

const collectionStore = useCollectionStore();

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
  collectionStore.csvSelectedAttributes = collectionStore.csvAttributes.map(item => item.value);
}
</script>
