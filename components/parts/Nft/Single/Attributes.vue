<template>
  <div>
    <n-form
      ref="formRef"
      class="max-w-xl"
      :model="collectionStore.attribute"
      @submit.prevent="handleSubmitForm"
    >
      <n-grid class="items-end" :cols="12" :x-gap="32">
        <n-form-item-gi
          :span="12"
          path="trait_type"
          :label="infoLabel('nftTraitType')"
          :label-props="{ for: 'trait_type' }"
        >
          <n-input
            v-model:value="collectionStore.attribute.trait_type"
            :input-props="{ id: 'trait_type' }"
            :placeholder="$t('general.typeHere')"
            clearable
          />
        </n-form-item-gi>

        <n-form-item-gi
          :span="12"
          path="display_type"
          :label="infoLabel('nftDisplayType')"
          :label-props="{ for: 'display_type' }"
        >
          <select-options
            v-model:value="collectionStore.attribute.display_type"
            :options="displayTypes"
            :render-option="renderOption"
            filterable
            clearable
          />
        </n-form-item-gi>

        <n-form-item-gi
          :span="12"
          path="value"
          :label="infoLabel('nftValue')"
          :label-props="{ for: 'value' }"
        >
          <n-input
            v-model:value="collectionStore.attribute.value"
            :input-props="{ id: 'value' }"
            :placeholder="$t('general.typeHere')"
            clearable
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>

    <Btn class="mt-8" type="primary" size="large" @click="handleSubmitForm">
      {{ $t('nft.addAttribute') }}
    </Btn>
  </div>
</template>

<script lang="ts" setup>
import { NTooltip, type SelectOption } from 'naive-ui';

const emit = defineEmits(['close']);

const { t } = useI18n();
const collectionStore = useCollectionStore();
const { infoLabel } = useCollection();

const types = ['string', 'date', 'number', 'boost_number', 'boost_percentage'];
const displayTypes = ref<Array<SelectOption>>(
  types.map(type => {
    return {
      value: type,
      label: t(`nft.collection.displayTypes.${type}.label`),
      info: t(`nft.collection.displayTypes.${type}.info`),
    };
  })
);

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

function handleSubmitForm() {
  collectionStore.form.single.attributes.push(collectionStore.attribute);

  collectionStore.attribute = {
    display_type: '',
    value: '',
    trait_type: '',
  };
  emit('close');
}
</script>
