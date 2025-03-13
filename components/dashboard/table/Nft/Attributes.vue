<template>
  <n-data-table :bordered="false" :columns="columns" :data="metadataStore.form.single.attributes" />
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';
import { NInput, NTooltip } from 'naive-ui';

const { t } = useI18n();
const metadataStore = useMetadataStore();

const displayTypes = ref<SelectOption[]>(
  enumValues(TraitTypes).map(type => {
    return {
      value: type,
      label: t(`nft.collection.displayTypes.${type}.label`),
      info: t(`nft.collection.displayTypes.${type}.info`),
    };
  })
);
const createColumns = (): NDataTableColumns<AttributeInterface> => {
  return [
    {
      title: t('form.label.nft.traitType'),
      key: 'trait_type',
      render(row: AttributeInterface) {
        return h(NInput, {
          value: row.trait_type,
          size: 'small',
          onUpdateValue(v) {
            row.trait_type = v;
          },
        });
      },
    },
    {
      title: t('form.label.nft.displayType'),
      key: 'display_type',
      render(row: AttributeInterface) {
        return h(resolveComponent('TableSelectOption'), {
          model: row.display_type,
          options: displayTypes.value,
          renderOption: renderOption,
          onChange: (value: string) => {
            row.display_type = value;
          },
        });
      },
    },
    {
      title: t('form.label.nft.value'),
      key: 'value',
      render(row: AttributeInterface) {
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

const renderOption = ({ node, option }: DropdownRenderOption) => {
  if (option.info) {
    return h(
      NTooltip,
      { keepAliveOnHover: false, style: { width: 'max-content' } },
      {
        trigger: () => node,
        default: () => option.info,
      }
    );
  }
  return node;
};

function removeItem(attribute: AttributeInterface) {
  metadataStore.form.single.attributes = metadataStore.form.single.attributes.filter(att => att !== attribute);
}
</script>
