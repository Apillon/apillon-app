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

      <!-- Admin Wallet Address -->
      <n-form-item
        path="walletAddress"
        :label="$t('form.label.simplet.walletAddress')"
        :label-props="{ for: 'walletAddress' }"
      >
        <FormFieldWalletAddress
          v-model:value="simpletsStore.form.walletAddress"
          :placeholder="$t('form.placeholder.simplet.walletAddress')"
          @connected="address => (simpletsStore.form.walletAddress = address)"
        />
      </n-form-item>

      <FormFieldEmbeddedWallet
        v-if="embeddedWalletStore.hasEmbeddedWallets"
        v-model:value="simpletsStore.form.embeddedWallet"
        @update:value="ew => (simpletsStore.form.embeddedWallet = ew)"
      />

      <n-grid v-if="simpletsStore.form.type === SimpletType.POAP" :cols="12" :x-gap="32">
        <n-form-item-gi
          path="startTime"
          :span="6"
          :label="$t('form.label.simplet.startTime')"
          :label-props="{ for: 'startTime' }"
        >
          <n-date-picker
            v-model:value="simpletsStore.form.startTime"
            class="w-full"
            type="datetime"
            :input-props="{ id: 'startTime' }"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi
          path="endTime"
          :span="6"
          :label="$t('form.label.simplet.endTime')"
          :label-props="{ for: 'endTime' }"
        >
          <n-date-picker
            v-model:value="simpletsStore.form.endTime"
            class="w-full"
            type="datetime"
            :input-props="{ id: 'endTime' }"
            clearable
          />
        </n-form-item-gi>
      </n-grid>

      <FormFieldApiKey
        :api-key="simpletsStore.form.apiKey"
        :api-secret="simpletsStore.form.apiSecret"
        @update:api-key="apiKey => (simpletsStore.form.apiKey = apiKey)"
        @update:api-secret="apiSecret => (simpletsStore.form.apiSecret = apiSecret)"
      />
    </n-form>
  </div>
</template>

<script lang="ts" setup>
defineExpose({ handleSubmit });

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const simpletsStore = useSimpletsStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const { ruleApiKey, ruleApiSecret } = useHosting();
const formRef = ref<NFormInst | null>(null);

const rules: NFormRules = {
  name: [ruleRequired(t('validation.simplet.nameRequired'))],
  description: [ruleDescription(t('validation.descriptionTooLong'))],
  walletAddress: [ruleRequired(t('validation.simplet.walletAddressRequired'))],
  apiKey: ruleApiKey(simpletsStore.form),
  apiSecret: ruleApiSecret(simpletsStore.form),
  embeddedWallet: {
    required: embeddedWalletStore.hasEmbeddedWallets,
    message: t('validation.embeddedWallet.integrationRequired'),
  },
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
