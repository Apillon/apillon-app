<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item path="password" :label="$t('form.label.password')">
      <n-input
        v-model:value="modelRef.password"
        type="password"
        :placeholder="$t('form.placeholder.complexPassword')"
        @input="handlePasswordInput"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item
      ref="rPasswordFormItemRef"
      path="reenteredPassword"
      :label="$t('form.label.confirmPassword')"
    >
      <n-input
        v-model:value="modelRef.reenteredPassword"
        :disabled="!modelRef.password"
        type="password"
        :placeholder="$t('form.placeholder.reenterPassword')"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item>
      <Btn type="primary" class="w-full mt-2" @click="handleValidateClick">
        {{ $t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NInput,
  FormInst,
  createDiscreteApi,
  FormValidationError,
  FormItemRule,
  FormItemInst,
} from 'naive-ui';

interface ModelType {
  password: string | null;
  reenteredPassword: string | null;
}

const formRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);
const { message } = createDiscreteApi(['message']);

const modelRef = ref<ModelType>({
  password: null,
  reenteredPassword: null,
});

const rules = {
  password: [
    {
      required: true,
      message: 'Please enter your password',
      trigger: 'input',
    },
    {
      min: 12,
      message: 'Password must contain at least 12 characters.',
      trigger: 'input',
    },
  ],
  reenteredPassword: [
    {
      required: true,
      message: 'Re-entered password is required',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordStartWith,
      message: 'Password is not same as re-entered password!',
      trigger: 'input',
    },
    {
      validator: validatePasswordSame,
      message: 'Password is not same as re-entered password!',
      trigger: ['blur', 'password-input'],
    },
  ],
};
// Custom validations
function validatePasswordStartWith(_: FormItemRule, value: string): boolean {
  return (
    !!modelRef.value.password &&
    modelRef.value.password.startsWith(value) &&
    modelRef.value.password.length >= value.length
  );
}
function validatePasswordSame(_: FormItemRule, value: string): boolean {
  return value === modelRef.value.password;
}

function handlePasswordInput() {
  if (modelRef.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' });
  }
}

// Submit
function handleValidateClick(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      message.success('Valid');
    } else {
      message.error('Invalid');
    }
  });
}
</script>
