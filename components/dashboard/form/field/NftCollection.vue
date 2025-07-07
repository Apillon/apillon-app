<template>
  <n-form-item path="nftCollection" :label="labelInfo('integration')" :label-props="{ for: 'embeddedWallet' }">
    <n-select
      v-bind="$attrs"
      :loading="collectionStore.loading"
      :placeholder="$t('form.placeholder.select')"
      :options="items"
      filterable
    />
  </n-form-item>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const collectionStore = useCollectionStore();
const { getChainName } = useCollection();

const { labelInfo } = useForm('form.label.collection');
const items = ref<SelectOption[]>([]);

onMounted(async () => {
  await collectionStore.getCollections();

  if (collectionStore.hasCollections) {
    items.value = collectionStore.items
      .filter(c => c.collectionStatus > CollectionStatus.CREATED && c.collectionStatus <= CollectionStatus.DEPLOYED)
      .map((item: CollectionInterface) => ({
        value: item.collection_uuid,
        label: `${getChainName(item.chain)}: ${item.name}`,
      }));
  }
});
</script>
