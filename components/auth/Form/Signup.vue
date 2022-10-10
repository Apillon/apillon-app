<template>
  <n-form ref="formRef" :model="formValue" :rules="rules">
    <n-form-item path="email">
      <n-input
        v-model:value="formValue.email"
        :input-props="{ type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
      />
    </n-form-item>
    <n-form-item :show-label="false">
      <Btn type="primary" class="w-full mt-2" @click="handleValidateClick">
        {{ $t('form.continue') }}
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
} from 'naive-ui';

const formRef = ref<FormInst | null>(null);
const { message } = createDiscreteApi(['message']);

const formValue = ref({
  email: '',
});
const rules = {
  email: [
    {
      type: 'email',
      message: 'Email address is not valid',
      trigger: 'input',
    },
    {
      required: true,
      message: 'Please enter your email',
      trigger: 'input',
    },
  ],
};

function handleValidateClick(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      message.success('Valid');
    } else {
      console.log(errors);
      message.error('Invalid');
    }
  });
}
</script>
