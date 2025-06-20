<template>
  <n-form
    ref="formRef"
    class="max-w-lg"
    :model="formData"
    :rules="rules"
    :disabled="!dataStore.isUserOwner"
    @submit.prevent="handleSubmit"
  >
    <!--  Project name -->
    <n-form-item path="name" :label="$t('form.label.projectName')" :label-props="{ for: 'projectName' }">
      <n-input
        v-model:value="formData.name"
        :input-props="{ id: 'projectName' }"
        :placeholder="$t('form.placeholder.projectName')"
        clearable
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
        clearable
      />
    </n-form-item>

    <!--  Submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.save')" />
      <Btn type="primary" class="mt-2" :loading="loading" :disabled="!dataStore.isUserOwner" @click="handleSubmit">
        {{ $t('form.save') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormProjectSettings = {
  name?: string | null;
  description?: string | null;
};
const { t } = useI18n();
const dataStore = useDataStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormProjectSettings>({
  name: dataStore.currentProject?.name || null,
  description: dataStore.currentProject?.description || null,
});

onMounted(async () => {
  await dataStore.waitOnPromises();

  if (!formData.value.name) {
    formData.value.name = dataStore.currentProject?.name;
    formData.value.description = dataStore.currentProject?.description;
  }
});

const rules: NFormRules = {
  name: [],
  description: [],
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (!errors) {
      await updateProjectData();
    }
  });
}
async function updateProjectData() {
  if (!dataStore.project.selected) return;
  loading.value = true;

  try {
    const res = await $api.patch<ProjectSettingsResponse>(
      endpoints.project(dataStore.project.selected),
      formData.value
    );

    if (res.data) {
      dataStore.updateCurrentProject(res.data);
      window.$message.success(t('form.success.updated.project'));
    }
  } catch (error) {
    window.$message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
