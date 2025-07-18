<template>
  <Form class="pb-8" :disabled="simpletStore.quotaReached">
    <Headline :title="$t('simplet.wizard.setData')" :content="$t('simplet.wizard.info')" />

    <n-form
      ref="formRef"
      :model="simpletStore.form"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <!-- Existing form items for basic simplet -->
      <n-form-item path="name" :label="$t('form.label.simplet.name')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="simpletStore.form.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.simplet.name')"
          clearable
        />
      </n-form-item>

      <n-form-item path="description" :label="$t('form.label.description')" :label-props="{ for: 'description' }">
        <n-input
          v-model:value="simpletStore.form.description"
          type="textarea"
          :input-props="{ id: 'description' }"
          :placeholder="$t('form.placeholder.simplet.description')"
          clearable
        />
      </n-form-item>

      <!-- Admin Wallet Address -->
      <n-form-item path="walletAddress" :label="label('walletAddress')" :label-props="{ for: 'walletAddress' }">
        <FormFieldWalletAddress
          v-model:value="simpletStore.form.walletAddress"
          :placeholder="$t('form.placeholder.simplet.walletAddress')"
          @connected="address => (simpletStore.form.walletAddress = address)"
        />
      </n-form-item>

      <FormFieldEmbeddedWallet
        v-if="embeddedWalletStore.hasEmbeddedWallets"
        v-model:value="simpletStore.form.embeddedWallet"
        clearable
        @update:value="ew => (simpletStore.form.embeddedWallet = ew)"
      />

      <n-grid v-if="simpletStore.form.type?.name === SimpletName.POAP" :cols="12" :x-gap="32">
        <n-form-item-gi
          path="startTime"
          :span="6"
          :label="$t('form.label.simplet.startTime')"
          :label-props="{ for: 'startTime' }"
        >
          <n-date-picker
            v-model:value="simpletStore.form.startTime"
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
            v-model:value="simpletStore.form.endTime"
            class="w-full"
            type="datetime"
            :input-props="{ id: 'endTime' }"
            clearable
          />
        </n-form-item-gi>
      </n-grid>

      <FormFieldApiKey
        :api-key="simpletStore.form.apiKey"
        :api-secret="simpletStore.form.apiSecret"
        @update:api-key="apiKey => (simpletStore.form.apiKey = apiKey)"
        @update:api-secret="apiSecret => (simpletStore.form.apiSecret = apiSecret)"
      >
        <n-checkbox v-model:checked="useDifferentDB" class="mb-8" size="medium" :label="labelInfo('useDifferentDB')" />

        <FormFieldMySql v-if="useDifferentDB" :form="simpletStore.form.mysql" />
      </FormFieldApiKey>
    </n-form>
  </Form>
</template>

<script lang="ts" setup>
defineExpose({ handleSubmit });

const authStore = useAuthStore();
const dataStore = useDataStore();
const simpletStore = useSimpletStore();
const settingsStore = useSettingsStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const { t } = useI18n();
const { labelInfo } = useForm('simplet.mysql');
const { labelInfo: label } = useForm('form.label.simplet');
const { ruleApiKey, ruleApiSecret } = useForm();

const formRef = ref<NFormInst | null>(null);
const useDifferentDB = ref<boolean>(false);

const rules = computed(() => ({
  name: ruleRequired(t('validation.simplet.nameRequired')),
  description: ruleDescription(t('validation.descriptionTooLong')),
  walletAddress: [
    ruleRequired(t('validation.simplet.walletAddressRequired')),
    ruleWalletAddress(t('validation.evmWalletAddress')),
  ],
  apiKey: [
    { required: settingsStore.apiKeyQuotaReached, message: t('validation.apiRequired') },
    ruleApiKey(simpletStore.form),
  ],
  apiSecret: ruleApiSecret(simpletStore.form),
  ['mysql.host']: { required: useDifferentDB.value, message: t('validation.mysqlRequired') },
  ['mysql.database']: { required: useDifferentDB.value, message: t('validation.mysqlRequired') },
  ['mysql.user']: { required: useDifferentDB.value, message: t('validation.mysqlRequired') },
  ['mysql.password']: { required: useDifferentDB.value, message: t('validation.mysqlRequired') },
}));

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser || !!simpletStore.quotaReached;
});

onMounted(() => {
  simpletStore.form.mysql.user = authStore.username || authStore.email.split('@')[0];
  simpletStore.form.mysql.password = generatePassword();
});

async function handleSubmit(e?: Event | MouseEvent): Promise<boolean> {
  e?.preventDefault();

  return !(await formRef.value?.validate())?.warnings;
}
</script>
