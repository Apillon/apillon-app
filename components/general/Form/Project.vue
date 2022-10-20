<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-form-item path="name" :label="$t('form.label.projectName')">
      <n-input
        v-model:value="formData.name"
        :placeholder="$t('form.placeholder.projectName')"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-tag :bordered="false" type="info" class="mb-8">{{ projectNameText }}</n-tag>
    <n-form-item path="description" :label="$t('form.label.projectDescription')">
      <n-input
        v-model:value="formData.description"
        type="textarea"
        :placeholder="$t('form.placeholder.projectDescription')"
      />
    </n-form-item>
    <n-form-item path="terms" :show-label="false">
      <n-checkbox id="terms" v-model:checked="formData.terms" size="large" :label="termsLabel" />
    </n-form-item>
    <n-form-item>
      <input type="submit" class="hidden" :value="$t('form.login')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
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
  FormItemRule,
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { CreateProjectResponse, FormProject } from '~~/types/form';

const dataStore = useDataStore();
const $emit = defineEmits(['submitActive', 'submitSuccess']);

/** Terms label with link */
const $i18n = useI18n();
const termsLabel = computed(() => {
  return h('span', {}, [
    $i18n.t('form.label.terms'),
    h('a', { href: '#terms', target: '_blank' }, $i18n.t('general.terms')),
  ]);
});

/** Tag Project_name text */
const projectNameText = computed(() => {
  return formData.value.name
    ? `${formData.value.name}.Appilon.io`
    : `${$i18n.t('login.projectName')}.Appilon.io`;
});

/** Form project */
const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const { message } = createDiscreteApi(['message']);

const formData = ref<FormProject>({
  name: null,
  description: null,
  terms: null,
});

const rules = {
  name: [
    {
      required: true,
      message: 'Please enter project name',
      trigger: 'input',
    },
  ],
  description: [],
  terms: [
    {
      required: true,
      validator: validateRequiredCheckbox,
      message: 'Please accept the terms',
    },
  ],
};

// Custom validations
function validateRequiredCheckbox(_: FormItemRule, value: boolean | null): boolean {
  return value === true;
}

// Submit
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      await createProject();
    }
  });
}
async function createProject() {
  loading.value = true;
  $emit('submitActive', true);

  const { data, error } = await $api.post<CreateProjectResponse>(
    ProjectEndpoint.project,
    formData.value
  );

  if (error) {
    setTimeout(() => {
      message.error(error.message);

      loading.value = false;
      $emit('submitActive', false);
    }, 2000);
    return;
  }

  if (data) {
    /** Set new project as current project */
    dataStore.setCurrentProject(data.data.id);

    loading.value = false;
    $emit('submitSuccess');
    $emit('submitActive', false);
  }
  loading.value = false;
}
</script>
