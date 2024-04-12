<template>
  <div class="bg-bg-light p-4 w-full rounded-md">
    <div class="flex items-center">
      <h4>{{ $t('nft.upload.attributes') }}</h4>
      <n-button class="ml-auto rounded-lg" size="small" @click="modalAttributeVisible = true">
        <span class="icon-add text-xl p-1 rounded-md"></span>
      </n-button>
    </div>
    <div class="mt-4">
      <n-data-table
        :bordered="false"
        :columns="columns"
        :data="collectionStore.form.single.attributes"
      />
    </div>

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
      title: t('form.label.nftName'),
      key: 'trait_type',
      render(row) {
        return h('span', { class: 'whitespace-nowrap' }, row.trait_type);
      },
    },
    {
      title: t('form.label.nftDisplayType'),
      key: 'display_type',
      render(row) {
        return h('span', { class: 'whitespace-nowrap' }, row.display_type);
      },
    },
    {
      title: t('form.label.nftValue'),
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
        return h(
          'button',
          { class: 'icon-delete text-xl text-white', onClick: () => removeItem(row) },
          ''
        );
      },
    },
  ];
};

const columns = createColumns();

function removeItem(attribute: AttributeInterface) {
  collectionStore.form.single.attributes = collectionStore.form.single.attributes.filter(
    att => att !== attribute
  );
}
</script>
