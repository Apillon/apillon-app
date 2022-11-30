<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Project name -->
    <n-form-item
      path="name"
      :label="$t('form.label.projectName')"
      :label-props="{ for: 'projectName' }"
    >
      <n-input
        v-model:value="formData.name"
        :input-props="{ id: 'projectName' }"
        :placeholder="$t('form.placeholder.projectName')"
        @keydown.enter.prevent
      />
    </n-form-item>

    <!-- Project TAG - currently not in use
    <n-tag :bordered="false" type="info" class="mb-8">{{ projectNameText }}</n-tag>
    -->

    <!--  Project description -->
    <n-form-item
      path="description"
      :label="$t('form.label.projectDescription')"
      :label-props="{ for: 'projectDescription' }"
    >
      <n-input
        v-model:value="formData.description"
        type="textarea"
        :input-props="{ id: 'projectDescription' }"
        :placeholder="$t('form.placeholder.projectDescription')"
      />
    </n-form-item>

    <!--  Project terms -->
    <n-form-item path="terms" :show-label="false">
      <n-checkbox id="terms" v-model:checked="formData.terms" size="large" :label="termsLabel" />
    </n-form-item>

    <!--  Project submit -->
    <n-form-item>
      <input type="submit" class="hidden" :value="$t('form.login')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        <template v-if="dataStore.hasProjects">
          {{ $t('form.createNewProject') }}
        </template>
        <template v-else>
          {{ $t('form.startFirstProject') }}
        </template>
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const dataStore = useDataStore();
const emit = defineEmits(['submitActive', 'submitSuccess']);

/** Terms label with link */
const $i18n = useI18n();
const termsLabel = computed(() => {
  return h('span', {}, [
    $i18n.t('form.terms.project'),
    h('a', { href: '#terms', target: '_blank' }, $i18n.t('general.terms')),
  ]);
});

/** Tag Project_name text - Currently not in use
const projectNameText = computed(() => {
  return formData.value.name
    ? `${formData.value.name}.Appilon.io`
    : `${$i18n.t('login.projectName')}.Appilon.io`;
}); */

/** Form project */
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const formData = ref<FormProject>({
  name: null,
  description: null,
  terms: null,
});

const rules: NFormRules = {
  name: [
    {
      required: true,
      message: $i18n.t('validation.projectNameRequired'),
      trigger: 'input',
    },
  ],
  description: [],
  terms: [
    {
      required: true,
      validator: validateRequiredCheckbox,
      message: $i18n.t('validation.terms'),
    },
  ],
};

// Submit
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      await createProject();
    }
  });
}
async function createProject() {
  loading.value = true;
  emit('submitActive', true);

  try {
    const { data, error } = await $api.post<CreateProjectResponse>(
      endpoints.project,
      formData.value
    );

    if (error) {
      setTimeout(() => {
        message.error(userFriendlyMsg($i18n, error));
        loading.value = false;
        emit('submitActive', false);
      }, 2000);
      return;
    }

    if (data) {
      /** Set new project as current project */
      dataStore.setCurrentProject(data.data.id);

      emit('submitSuccess');
      emit('submitActive', false);
    }
    loading.value = false;
  } catch (error) {
    message.error(userFriendlyMsg($i18n, error));
    loading.value = false;
    emit('submitActive', false);
  }
}
</script>
