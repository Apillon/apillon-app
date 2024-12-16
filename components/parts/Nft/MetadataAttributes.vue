<template>
  <n-checkbox-group
    v-if="collectionStore.csvAttributes.length > 0"
    v-bind="$attrs"
    v-model:value="collectionStore.csvSelectedAttributes"
    class="text-left"
  >
    <n-space vertical class="mb-2" size="small">
      <div class="mb-6 text-center">
        <!-- <strong class="mr-4 text-body">{{ $t('nft.upload.selectAttributes') }}:</strong> -->

        <Btn type="builders" size="tiny" href="https://wiki.apillon.io/web3-services/4-nfts.html">
          {{ $t('general.learnMore') }}
        </Btn>
      </div>

      <n-space
        v-for="(column, key) in collectionStore.csvAttributes"
        :key="key"
        class="min-h-[40px]"
        align="center"
        justify="space-between"
      >
        <n-checkbox
          v-if="!column?.hidden"
          :class="{ hidden: !!column?.hidden }"
          :value="column.value"
          :label="column.label"
        />
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

    <!-- Select/deselect all -->
    <n-button
      v-if="!!collectionStore.csvSelectedAttributes.length"
      class="min-w-[150px]"
      size="small"
      type="error"
      ghost
      @click="deselectAllAttributes"
    >
      {{ $t('general.deselectAll') }}
    </n-button>
    <n-button v-else class="min-w-[150px]" size="small" @click="selectAllAttributes">
      {{ $t('general.selectAll') }}
    </n-button>
  </n-checkbox-group>
  <div v-else>
    <h5>{{ $t('nft.validation.csvMissingAttributes') }}</h5>
  </div>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const collectionStore = useCollectionStore();

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
function deselectAllAttributes() {
  collectionStore.csvSelectedAttributes = [];
}
</script>
