<template>
  <n-form ref="formRef" :model="formData" :rules="rules">
    <n-form-item path="password" :label="$t('form.label.password')">
      <n-input
        v-model:value="formData.password"
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
        v-model:value="formData.reenteredPassword"
        :disabled="!formData.password"
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
import { FormPassword } from '~~/types/form';
import { useAuthStore } from '~~/stores/auth';

const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);
const { message } = createDiscreteApi(['message']);
const authStore = useAuthStore();
const router = useRouter();

const formData = ref<FormPassword>({
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
    !!formData.value.password &&
    formData.value.password.startsWith(value) &&
    formData.value.password.length >= value.length
  );
}
function validatePasswordSame(_: FormItemRule, value: string): boolean {
  return value === formData.value.password;
}

function handlePasswordInput() {
  if (formData.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' });
  }
}

// Submit
function handleValidateClick(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      await register();
    }
  });
}
async function register() {
  loading.value = true;

  const { data, error } = await $api.post(UsersEndpoint.register, {
    ...formData.value,
    email: authStore.email,
  });

  if (error) {
    loading.value = false;
    return;
  }

  if (data) {
    router.push('/login');
  }
  loading.value = false;
}
</script>
