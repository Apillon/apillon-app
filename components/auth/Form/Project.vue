<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item path="projectName" :label="$t('form.label.projectName')">
      <n-input
        v-model:value="modelRef.projectName"
        :placeholder="$t('form.placeholder.projectName')"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item path="projectDescription" :label="$t('form.label.projectDescription')">
      <n-input
        v-model:value="modelRef.projectDescription"
        type="textarea"
        :placeholder="$t('form.placeholder.projectDescription')"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item>
      <Btn type="primary" class="w-full mt-2" @click="handleValidateClick">
        {{ $t('form.startFirstProject') }}
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

interface ModelType {
  projectName: string | null;
  projectDescription: string | null;
}

const formRef = ref<FormInst | null>(null);
const { message } = createDiscreteApi(['message']);
const $emit = defineEmits(['submit']);

const modelRef = ref<ModelType>({
  projectName: null,
  projectDescription: null,
});

const rules = {
  projectName: [
    {
      required: true,
      message: 'Please enter project name',
      trigger: 'input',
    },
  ],
  projectDescription: [],
};

// Submit
function handleValidateClick(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      message.success('Valid');
      $emit('submit', true);
    } else {
      message.error('Invalid');
    }
  });
}
</script>
