<template>
  <n-form ref="formRef" :model="metadataStore.form.smartContract" :rules="rules" @submit.prevent="handleSubmitForm">
    <n-form-item
      path="royaltiesAddress"
      :span="8"
      :label="labelInfo('royaltiesAddress')"
      :label-props="{ for: 'royaltiesAddress' }"
    >
      <FormFieldWalletAddress
        v-model:value="metadataStore.form.smartContract.royaltiesAddress"
        :input-props="{ id: 'royaltiesAddress' }"
        @connected="address => (metadataStore.form.smartContract.royaltiesAddress = address)"
      />
    </n-form-item>
    <n-grid class="items-end" :cols="12" :x-gap="32">
      <n-form-item-gi
        path="royaltiesFees"
        :span="isLg ? 6 : 12"
        :label="labelInfo('royaltiesFees')"
        :label-props="{ for: 'royaltiesFees' }"
      >
        <n-input-number
          v-model:value="metadataStore.form.smartContract.royaltiesFees"
          :min="0"
          :max="100"
          :input-props="{ id: 'royaltiesFees' }"
          :placeholder="$t('general.typeHere')"
          :show-button="false"
          clearable
        >
          <template #suffix>%</template>
        </n-input-number>
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
defineProps({
  hideSubmit: { type: Boolean, default: true },
});
const { isLg } = useScreen();
const message = useMessage();
const metadataStore = useMetadataStore();

const { rulesCollection: rules, labelInfo } = useForm();
const { formRef } = useCollection();
defineExpose({ formRef, handleSubmitForm });

// Submit
async function handleSubmitForm(e?: Event | MouseEvent): Promise<boolean> {
  e?.preventDefault();
  return !(await formRef.value?.validate())?.warnings;
}
</script>
