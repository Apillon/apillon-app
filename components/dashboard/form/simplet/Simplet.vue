<template>
  <div>
    <!-- Permissions Error Notification -->
    <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>

    <Headline :title="$t('dashboard.simplet.wizard.setData')" :content="$t('dashboard.simplet.wizard.info')" />

    <n-form
      ref="formRef"
      :model="simpletsStore.form"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <!-- Existing form items for basic simplet -->
      <n-form-item path="name" :label="$t('form.label.simplet.name')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="simpletsStore.form.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.simplet.name')"
          clearable
        />
      </n-form-item>

      <n-form-item path="description" :label="$t('form.label.description')" :label-props="{ for: 'description' }">
        <n-input
          v-model:value="simpletsStore.form.description"
          type="textarea"
          :input-props="{ id: 'description' }"
          :placeholder="$t('form.placeholder.simplet.description')"
          clearable
        />
      </n-form-item>

      <!-- Admin Address -->
      <n-form-item
        path="walletAddress"
        :label="$t('form.label.simplet.walletAddress')"
        :label-props="{ for: 'walletAddress' }"
      >
        <FormFieldWalletAddress
          v-model:value="simpletsStore.form.walletAddress"
          :placeholder="$t('form.placeholder.simplet.walletAddress')"
        />
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
defineExpose({ handleSubmit });

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const warningStore = useWarningStore();
const simpletsStore = useSimpletsStore();
const formRef = ref<NFormInst | null>(null);

const rules: NFormRules = {
  name: [ruleRequired(t('validation.simplet.nameRequired'))],
  description: [ruleDescription(t('validation.descriptionTooLong'))],
  walletAddress: [ruleRequired(t('validation.simplet.walletAddressRequired'))],
};

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

// Submit
async function handleSubmit(e?: Event | MouseEvent): Promise<boolean> {
  e?.preventDefault();

  const validation = await formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    errors?.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
  });
  return !validation?.warnings;
}
</script>
