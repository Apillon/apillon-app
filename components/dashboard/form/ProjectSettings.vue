<template>
  <n-form
    ref="formRef"
    class="max-w-lg"
    :model="formData"
    :rules="rules"
    :disabled="!settingsStore.isUserOwner()"
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
      <Btn
        type="primary"
        class="mt-2"
        :loading="loading"
        :disabled="!settingsStore.isUserOwner()"
        @click="handleSubmit"
      >
        {{ $t('form.save') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

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

const rules: NFormRules = {
  name: [],
  description: [],
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => window.$message.error(error.message || 'Error'))
      );
    } else {
      await updateProjectData();
    }
  });
}
async function updateProjectData() {
  loading.value = true;

  try {
    const res = await $api.patch<ProjectSettingsResponse>(
      endpoints.project(dataStore.currentProjectId),
      formData.value
    );

    if (res.data) {
      dataStore.updateCurrentProject(res.data);
    }
  } catch (error) {
    window.$message.error(userFriendlyMsg(error, $i18n));
  }
  loading.value = false;
}
</script>
