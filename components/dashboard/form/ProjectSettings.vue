<template>
  <n-form
    ref="formRef"
    class="max-w-lg"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
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
      />
    </n-form-item>

    <!--  Project description -->
    <n-form-item
      path="description"
      :label="$t('form.label.projectDescription')"
      :label-props="{ for: 'projectDescription' }"
    >
      <n-input
        v-model:value="formData.description"
        :input-props="{ id: 'projectDescription' }"
        :placeholder="$t('form.placeholder.projectDescription')"
      />
    </n-form-item>

    <!--  Submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.save')" />
      <Btn type="primary" class="mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.save') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { FormInst, useMessage, FormValidationError, FormRules } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useDataStore } from '~~/stores/data';
import { FormProjectSettings, ProjectSettingsResponse } from '~~/types/data';

const { t } = useI18n();
const dataStore = useDataStore();
const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const message = useMessage();

const formData = ref<FormProjectSettings>({
  name: dataStore.currentProject?.name || null,
  description: dataStore.currentProject?.description || null,
});

onMounted(() => {
  /** If page was reloaded, populate form data after projects has been loaded */
  Promise.all(Object.values(dataStore.promises)).then(_ => {
    if (!formData.value.name) {
      formData.value.name = dataStore.currentProject?.name;
      formData.value.description = dataStore.currentProject?.description;
    }
  });
});

const rules: FormRules = {
  name: [],
  description: [],
};

// Submit
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      await updateUserProfile();
    }
  });
}
async function updateUserProfile() {
  loading.value = true;

  try {
    const { data, error } = await $api.patch<ProjectSettingsResponse>(
      `${ProjectEndpoint.project}/${dataStore.currentProjectId}`,
      formData.value
    );

    if (error) {
      message.error(error.message);
      loading.value = false;
      return;
    }

    if (data.data) {
      dataStore.updateCurrentProject(data.data);
    }
    loading.value = false;
  } catch (error) {
    message.error(t('error.API'));
    loading.value = false;
  }
}
</script>
