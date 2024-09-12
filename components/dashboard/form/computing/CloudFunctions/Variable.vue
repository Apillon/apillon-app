<template>
  <n-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <n-grid v-for="(item, key) in formData" :key="key" class="items-end" :cols="2" :x-gap="32">
      <!--  Variable key -->
      <n-form-item-gi
        class="mb-4"
        :class="{ 'hide-feedback': item.key || !formErrors }"
        :path="`${key}.key`"
        :label="$t('form.label.cloudFunctions.varKey')"
        :show-label="key === 0"
      >
        <n-input v-model:value="item.key" :placeholder="$t('general.typeHere')" clearable />
      </n-form-item-gi>

      <!--  Variable value -->
      <n-form-item-gi
        class="mb-4"
        :class="{ 'hide-feedback': item.key || !formErrors }"
        :path="`${key}.value`"
        :label="$t('form.label.cloudFunctions.varValue')"
        :show-label="key === 0"
      >
        <n-input v-model:value="item.value" :placeholder="$t('general.typeHere')" clearable />
      </n-form-item-gi>
    </n-grid>

    <div class="text-right mb-8">
      <n-button size="small" @click="formData.push({ key: '', value: '' })">
        <span class="icon-add text-xl mr-2 text-primary"></span>
        <span class="text-primary">{{ $t('computing.cloudFunctions.variable.addRow') }}</span>
      </n-button>
    </div>

    <!--  Form submit -->
    <n-form-item :show-feedback="false" :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.continue')" />
      <Btn type="primary" class="w-full mt-2" :loading="envLoading" @click="handleSubmit">
        {{ $t('form.continue') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormItemRule } from 'naive-ui';

const emit = defineEmits(['submitSuccess', 'createSuccess']);

const { t } = useI18n();
const message = useMessage();
const cloudFunctionStore = useCloudFunctionStore();
const { envLoading } = useCloudFunctions();

const formErrors = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<EnvVariable[]>([{ key: '', value: '' }]);

const rules = computed<NFormRules>(() =>
  formData.value.reduce((acc, field, key) => {
    acc[`${key}.key`] = [
      ruleRequired(t('validation.cloudFunctions.keyRequired')),
      {
        validator: validateVariableKey,
        message: t('validation.cloudFunctions.keyNotUnique'),
      },
    ];
    acc[`${key}.value`] = ruleRequired(t('validation.cloudFunctions.valueRequired'));
    return acc;
  }, {})
);

function validateVariableKey(rule: FormItemRule, value): boolean {
  return (
    formData.value.filter(item => isLowercaseEqual(item.key, value)).length === 1 &&
    !cloudFunctionStore.variables.some(item => isLowercaseEqual(item.key, value)) &&
    !cloudFunctionStore.variablesNew.some(item => isLowercaseEqual(item.key, value))
  );
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    formErrors.value = !!errors;
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      cloudFunctionStore.variablesNew = [...cloudFunctionStore.variablesNew, ...formData.value];
      emit('submitSuccess');
    }
  });
}
</script>
