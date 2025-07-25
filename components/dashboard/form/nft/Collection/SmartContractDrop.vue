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
          :show-button="false"
          clearable
        >
          <template #suffix>{{ chainCurrency(metadataStore.form.smartContract.chain) }}</template>
        </n-input-number>
      </n-form-item-gi>

      <!--  Collection Drop start -->
      <n-form-item-gi path="dropStart" :span="6" :label="labelInfo('dropStart')" :label-props="{ for: 'dropStart' }">
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
        :label="labelInfo('dropReserve')"
        :label-props="{ for: 'dropReserve' }"
      >
        <n-input-number
          v-model:value="metadataStore.form.smartContract.dropReserve"
          :min="0"
          :step="1"
          :input-props="{ id: 'dropReserve' }"
          :show-button="false"
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

const { rulesCollection: rules, labelInfo } = useForm();
const { formRef } = useCollection();
defineExpose({ formRef, handleSubmitForm });

onMounted(() => {
  if (props.simplet) {
    metadataStore.form.smartContract.dropReserve = metadataStore.metadata.length;
  }
});

// Submit
async function handleSubmitForm(e?: Event | MouseEvent): Promise<boolean> {
  e?.preventDefault();
  return !(await formRef.value?.validate())?.warnings;
}
</script>
