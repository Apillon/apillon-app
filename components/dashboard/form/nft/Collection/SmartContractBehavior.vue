<template>
  <n-form ref="formRef" :model="metadataStore.form.smartContract" :rules="rules" @submit.prevent="handleSubmitForm">
    <FormFieldSwitch
      v-if="!simplet"
      v-model:value="metadataStore.form.smartContract.supplyLimited"
      :text-active="$t('form.supplyTypes.limited')"
      :text-inactive="$t('form.supplyTypes.unlimited')"
    />
    <n-grid
      v-if="!simplet"
      v-show="metadataStore.form.smartContract.supplyLimited"
      class="items-end"
      :cols="12"
      :x-gap="32"
    >
      <n-form-item-gi path="maxSupply" :span="6" :label="labelInfo('maxSupply')" :label-props="{ for: 'maxSupply' }">
        <n-input-number
          v-model:value="metadataStore.form.smartContract.maxSupply"
          :min="0"
          :max="NFT_MAX_SUPPLY"
          :disabled="!metadataStore.form.smartContract.supplyLimited"
          :input-props="{ id: 'maxSupply' }"
          :placeholder="t('form.placeholder.collectionMaxSupply')"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid class="items-end" :cols="12" :x-gap="32">
      <n-form-item-gi path="revocable" :span="4" :label="labelInfo('revocable')" :label-props="{ for: 'revocable' }">
        <select-options
          v-model:value="metadataStore.form.smartContract.revocable"
          :options="booleanSelect"
          :input-props="{ id: 'revocable' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
        />
      </n-form-item-gi>
      <n-form-item-gi path="soulbound" :span="4" :label="labelInfo('soulbound')" :label-props="{ for: 'soulbound' }">
        <select-options
          v-model:value="metadataStore.form.smartContract.soulbound"
          :options="booleanSelect"
          :input-props="{ id: 'soulbound' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
        />
      </n-form-item-gi>
      <n-form-item-gi
        path="isAutoIncrement"
        :span="4"
        :label="labelInfo('autoIncrement')"
        :label-props="{ for: 'autoIncrement' }"
      >
        <select-options
          v-model:value="metadataStore.form.smartContract.isAutoIncrement"
          :options="booleanSelect"
          :input-props="{ id: 'autoIncrement' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
        />
      </n-form-item-gi>
    </n-grid>

    <!--  Form submit -->
    <n-form-item v-if="!hideSubmit" :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.proceed')" />
      <Btn type="primary" class="mt-2 w-full" @click="handleSubmitForm">
        {{ $t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
const props = defineProps({
  hideSubmit: { type: Boolean, default: true },
  simplet: { type: Boolean, default: false },
});
const { t } = useI18n();
const message = useMessage();
const metadataStore = useMetadataStore();

const { rulesCollection: rules, labelInfo } = useForm();
const { booleanSelect, formRef } = useCollection();
defineExpose({ formRef, handleSubmitForm });

onMounted(() => {
  if (props.simplet) {
    metadataStore.form.smartContract.supplyLimited = true;
    metadataStore.form.smartContract.maxSupply = metadataStore.metadata.length;
  } else if (metadataStore.form.smartContract.maxSupply === 0) {
    metadataStore.form.smartContract.maxSupply = metadataStore.metadata.length;
  }
});

async function handleSubmitForm(e?: Event | MouseEvent): Promise<boolean> {
  e?.preventDefault();
  return !(
    await formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
      errors?.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    })
  )?.warnings;
}
</script>
