<template>
  <n-form ref="formRef" :model="formValue" :rules="rules">
    <n-form-item path="email">
      <n-input
        v-model:value="formValue.email"
        :input-props="{ type: 'email' }"
        :placeholder="$t('general.emailPlaceholder', { afna: '@' })"
      />
    </n-form-item>
    <n-form-item>
      <n-button type="primary" class="w-full" @click="handleValidateClick">
        {{ $t('general.continue') }}
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { NForm, NFormItem, NInput, NButton, FormInst, createDiscreteApi } from 'naive-ui';

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
  formRef.value?.validate(errors => {
    if (!errors) {
      message.success('Valid');
    } else {
      console.log(errors);
      message.error('Invalid');
    }
  });
}
</script>
