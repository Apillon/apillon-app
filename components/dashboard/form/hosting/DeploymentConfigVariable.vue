<template>
  <n-form
    v-bind="$attrs"
    ref="formRef"
    :model="deploymentStore.variableForm"
    :rules="rules"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <n-form-item path="key" :label="$t('hosting.deploy.env-vars.key')" :label-props="{ for: 'key' }">
      <n-input
        v-model:value="deploymentStore.variableForm.key"
        :input-props="{ id: 'key' }"
        :placeholder="$t('hosting.deploy.env-vars.key-placeholder')"
      />
    </n-form-item>
    <n-form-item path="value" :label="$t('hosting.deploy.env-vars.value')" :label-props="{ for: 'value' }">
      <n-input
        v-model:value="deploymentStore.variableForm.value"
        :input-props="{ id: 'value' }"
        :placeholder="$t('hosting.deploy.env-vars.value-placeholder')"
      />
    </n-form-item>
    <n-form-item :show-feedback="false" :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.save')" />

      <Btn type="primary" class="mt-2 w-full" :loading="deploymentStore.loading" @click="handleSubmit">
        {{ $t('form.save') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
const deploymentStore = useDeploymentStore();
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();

const props = defineProps({
  configId: { type: Number, default: 0 },
});
const rules: NFormRules = {
  key: [ruleRequired($i18n.t('validation.deploy-env.key-required'))],
  value: [ruleRequired($i18n.t('validation.deploy-env.value-required'))],
};
const formRef = ref<NFormInst | null>(null);

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => window.$message.error(error.message || 'Error')));
    } else {
      await createVariable();
    }
  });
}

async function createVariable() {
  await deploymentStore.saveVariables(props.configId);
  emit('submitSuccess');
}
</script>
