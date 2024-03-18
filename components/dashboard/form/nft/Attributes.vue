<template>
  <button class="ml-auto" @click="modalShowAttribute = true">
    <span class="icon-add text-xl border-1 border-bg-bg-light p-1 rounded-md"></span>
  </button>
  <Modal v-model:show="modalShowAttribute" :title="title">
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
            path="traitType"
            :label="infoLabel('nftName')"
            :label-props="{ for: 'traitType' }"
          >
            <n-input
              v-model:value="collectionStore.attribute.trait_type"
              :input-props="{ id: 'nftName' }"
              :placeholder="$t('general.typeHere')"
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
  </Modal>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: { type: String, default: null },
  type: { type: String, default: null },
});

const $i18n = useI18n();
const collectionStore = useCollectionStore();

const modalShowAttribute = ref<boolean>(false);

watch(modalShowAttribute, (newValue, oldValue) => {
  if (modalShowAttribute.value) {
    collectionStore.attribute.display_type = props.type;
  } else {
    collectionStore.attribute = {} as AttributeInterface;
  }
});
function handleSubmitForm() {
  collectionStore.form.single.attributes.push(collectionStore.attribute);

  collectionStore.attribute = {} as AttributeInterface;

  modalShowAttribute.value = false;
}

function infoLabel(field: string) {
  if (
    $i18n.te(`form.label.${field}`) &&
    $i18n.te(`nft.nft.labelInfo.${field}`) &&
    $i18n.t(`nft.nft.labelInfo.${field}`)
  ) {
    return [
      h('span', { class: 'mr-1' }, $i18n.t(`form.label.${field}`)),
      h(
        resolveComponent('IconInfo'),
        { size: 'sm', tooltip: $i18n.t(`nft.collection.labelInfo.${field}`) },
        ''
      ),
    ];
  }
  return $i18n.te(`form.label.${field}`) ? $i18n.t(`form.label.${field}`) : field;
}
</script>
