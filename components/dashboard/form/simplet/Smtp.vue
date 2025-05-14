<template>
  <div>
    <!-- Permissions Error Notification -->
    <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>

    <Headline :title="$t('simplet.wizard.smtp.setup')" :content="$t('simplet.wizard.smtp.info')" />
    <Notification type="warning" class="mb-8 w-full">
      {{ $t('simplet.wizard.smtp.warning') }}
    </Notification>

    <n-form
      ref="formRef"
      :model="simpletStore.form.smtp"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <n-grid class="items-end" :cols="12" :x-gap="24">
        <n-form-item-gi path="host" :span="9" :label="$t('form.label.smtp.host')" :label-props="{ for: 'host' }">
          <n-input
            v-model:value="simpletStore.form.smtp.host"
            :input-props="{ id: 'host' }"
            :placeholder="$t('form.placeholder.smtp.host')"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi path="port" :span="3" :label="$t('form.label.smtp.port')" :label-props="{ for: 'port' }">
          <n-input-number
            v-model:value="simpletStore.form.smtp.port"
            :min="0"
            :input-props="{ id: 'port' }"
            :placeholder="$t('form.placeholder.smtp.host')"
          />
        </n-form-item-gi>
      </n-grid>

      <n-form-item path="username" :label="$t('form.label.smtp.username')" :label-props="{ for: 'username' }">
        <n-input
          v-model:value="simpletStore.form.smtp.username"
          :input-props="{ id: 'username' }"
          :placeholder="$t('form.placeholder.smtp.username', { afna: '@' })"
          clearable
        />
      </n-form-item>

      <n-form-item path="password" :label="$t('form.label.smtp.password')" :label-props="{ for: 'password' }">
        <n-input
          v-model:value="simpletStore.form.smtp.password"
          type="password"
          :input-props="{ id: 'password', autocomplete: 'smtp-password' }"
          :placeholder="$t('form.placeholder.smtp.password')"
          clearable
        />
      </n-form-item>

      <n-form-item path="senderName" :label="$t('form.label.smtp.sender')" :label-props="{ for: 'senderName' }">
        <n-input
          v-model:value="simpletStore.form.smtp.senderName"
          :input-props="{ id: 'senderName' }"
          :placeholder="$t('form.placeholder.smtp.sender')"
          clearable
        />
      </n-form-item>
      <n-form-item path="senderEmail" :label="$t('form.label.smtp.email')" :label-props="{ for: 'senderEmail' }">
        <n-input
          v-model:value="simpletStore.form.smtp.senderEmail"
          :input-props="{ id: 'senderEmail' }"
          :placeholder="$t('form.placeholder.smtp.email', { afna: '@' })"
          clearable
        />
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['skip']);
defineExpose({ handleSubmit });
const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const simpletStore = useSimpletStore();
const formRef = ref<NFormInst | null>(null);

const rules: NFormRules = {
  host: ruleRequired(t('validation.smtp.hostRequired')),
  port: ruleRequired(t('validation.smtp.portRequired')),
  username: ruleRequired(t('validation.smtp.usernameRequired')),
  password: ruleRequired(t('validation.smtp.passwordRequired')),
  senderName: ruleRequired(t('validation.smtp.senderNameRequired')),
  senderEmail: ruleRequired(t('validation.smtp.senderEmailRequired')),
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
