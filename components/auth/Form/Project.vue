<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item path="projectName" :label="$t('form.label.projectName')">
      <n-input
        v-model:value="modelRef.projectName"
        :placeholder="$t('form.placeholder.projectName')"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-tag :bordered="false" type="info" class="mb-8">Project_name.AUTHTRSIL.COM/ </n-tag>
    <n-form-item path="projectDescription" :label="$t('form.label.projectDescription')">
      <n-input
        v-model:value="modelRef.projectDescription"
        type="textarea"
        :placeholder="$t('form.placeholder.projectDescription')"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item path="terms" :show-label="false">
      <n-checkbox id="terms" v-model:checked="modelRef.terms" size="large" :label="termsLabel" />
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
  NCheckbox,
  NForm,
  NFormItem,
  NInput,
  NTag,
  FormInst,
  createDiscreteApi,
  FormValidationError,
} from 'naive-ui';
import { useI18n } from 'vue-i18n';

/** Terms label with link */
const $i18n = useI18n();
const termsLabel = computed(() => {
  return h('span', {}, [
    $i18n.t('form.label.terms'),
    h('a', { href: '#terms', target: '_blank' }, $i18n.t('general.terms')),
  ]);
});

interface ModelType {
  projectName: string | null;
  projectDescription: string | null;
  terms: boolean | null;
}

const formRef = ref<FormInst | null>(null);
const { message } = createDiscreteApi(['message']);
const $emit = defineEmits(['submit']);

const modelRef = ref<ModelType>({
  projectName: null,
  projectDescription: null,
  terms: null,
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
  terms: [
    {
      required: true,
      message: 'Please accept the terms',
    },
  ],
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
