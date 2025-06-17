<template>
  <n-form ref="formRef" :model="metadataStore.form.smartContract" :rules="rules" @submit.prevent="handleSubmitForm">
    <n-grid class="items-end" :cols="12" :x-gap="32">
      <!--  Collection Mint price -->
      <n-form-item-gi
        path="dropPrice"
        :span="6"
        :label="
          $t('form.label.collection.dropPrice', { currency: chainCurrency(metadataStore.form.smartContract.chain) })
        "
        :label-props="{ for: 'dropPrice' }"
      >
        <n-input-number
          v-model:value="metadataStore.form.smartContract.dropPrice"
          :min="0"
          :max="10000000000"
          :step="0.00001"
          :input-props="{ id: 'dropPrice' }"
          clearable
        />
      </n-form-item-gi>

      <!--  Collection Drop start -->
      <n-form-item-gi path="dropStart" :span="6" :label="infoLabel('dropStart')" :label-props="{ for: 'dropStart' }">
        <n-date-picker
          v-model:value="metadataStore.form.smartContract.dropStart"
          class="w-full"
          type="datetime"
          :input-props="{ id: 'dropStart' }"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid class="items-end" :cols="12" :x-gap="32">
      <!--  Collection Reserve -->
      <n-form-item-gi
        v-if="!simplet && metadataStore.form.smartContract.chainType === ChainType.EVM"
        path="dropReserve"
        :span="6"
        :label="infoLabel('dropReserve')"
        :label-props="{ for: 'dropReserve' }"
      >
        <n-input-number
          v-model:value="metadataStore.form.smartContract.dropReserve"
          :min="0"
          :step="1"
          :input-props="{ id: 'dropReserve' }"
          clearable
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
const message = useMessage();
const metadataStore = useMetadataStore();

const { labelInfo } = useComputing();
const { formRef, rules } = useCollection();
defineExpose({ formRef, handleSubmitForm });

onMounted(() => {
  if (props.simplet) {
    metadataStore.form.smartContract.dropReserve = metadataStore.metadata.length;
  }
});

function infoLabel(field: string) {
  return labelInfo(field, 'form.label.collection');
}

// Submit
async function handleSubmitForm(e?: Event | MouseEvent): Promise<boolean> {
  e?.preventDefault();
  return !(
    await formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
      errors?.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    })
  )?.warnings;
}
</script>
