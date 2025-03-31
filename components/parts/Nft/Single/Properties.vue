<template>
  <div class="w-full">
    <div class="mb-4">
      <n-data-table :bordered="false" :columns="columns" :data="collectionStore.form.single.attributes" />
    </div>
    <Btn type="secondary" class="ml-auto rounded-lg" @click="modalAttributeVisible = true">
      <span class="flex items-center gap-2">
        <span class="icon-add rounded-md p-1 text-xl"></span>
        <span>{{ t('nft.addAttribute') }}</span>
      </span>
    </Btn>

    <Modal v-model:show="modalAttributeVisible" title="Attribute">
      <NftSingleAttributes @close="modalAttributeVisible = false" />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { NInput } from 'naive-ui';

const { t } = useI18n();
const collectionStore = useCollectionStore();

const modalAttributeVisible = ref<boolean>(false);

const createColumns = (): NDataTableColumns<AttributeInterface> => {
  return [
    {
      title: t('form.label.nft.name'),
      key: 'trait_type',
      render(row) {
        return h('span', { class: 'whitespace-nowrap' }, row.trait_type);
      },
    },
    {
      title: t('form.label.nft.displayType'),
      key: 'display_type',
      render(row) {
        return h('span', { class: 'whitespace-nowrap' }, row.display_type);
      },
    },
    {
      title: t('form.label.nft.value'),
      key: 'value',
      render(row) {
        return h(NInput, {
          value: row.value,
          size: 'small',
          onUpdateValue(v) {
            row.value = v;
          },
        });
      },
    },
    {
      key: 'action_remove',
      title: '',
      align: 'right',
      render(row: AttributeInterface) {
        return h('button', { class: 'icon-delete text-xl text-white', onClick: () => removeItem(row) }, '');
      },
    },
  ];
};

const columns = createColumns();

function removeItem(attribute: AttributeInterface) {
  collectionStore.form.single.attributes = collectionStore.form.single.attributes.filter(att => att !== attribute);
}
</script>
