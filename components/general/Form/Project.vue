<template>
  <div>
    <Notification v-if="dataStore.project.quotaReached === true" type="warning" class="mb-4">
      {{ $t('project.quotaReached') }},
      <NuxtLink class="text-yellow" :to="{ name: 'dashboard-payments' }" @click="$emit('close')">
        {{ $t('project.upgradePlan') }} </NuxtLink
      >.
    </Notification>
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="dataStore.project.quotaReached === true"
      @submit.prevent="handleSubmit"
    >
      <!--  Project name -->
      <n-form-item path="name" :label="$t('form.label.projectName')" :label-props="{ for: 'projectName' }">
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'projectName' }"
          :placeholder="$t('form.placeholder.projectName')"
          @keydown.enter.prevent
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
          type="textarea"
          rows="4"
          :input-props="{ id: 'projectDescription' }"
          :placeholder="$t('form.placeholder.projectDescription')"
        />
      </n-form-item>

      <p>
        <span class="text-placeholder">{{ $t('dashboard.onboarding.modal.credits.reward') }}: </span>
        <span class="inline-block whitespace-nowrap text-blue">
          <span class="icon-credits mx-2 inline-block align-text-top text-xl"></span>
          <strong class="text-xs"> 1200 </strong>
        </span>
      </p>
      <slot />

      <!--  Project submit -->
      <n-form-item :show-feedback="false">
        <input type="submit" class="hidden" :value="$t('form.createNewProject')" />
        <Btn
          class="mt-2 w-full"
          size="large"
          type="primary"
          :loading="loading"
          :disabled="dataStore.project.quotaReached === true"
          @click="handleSubmit"
        >
          {{ $t('form.createNewProject') }}
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
type FormProject = {
  name: string | null;
  description: string | null;
};

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const { clearAll } = useStore();

const emit = defineEmits(['submitActive', 'submitSuccess', 'close']);

onMounted(async () => {
  /** GET Project quota */
  await dataStore.getProjectQuota();
});

/** Form project */
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormProject>({
  name: null,
  description: null,
});

const rules: NFormRules = {
  name: [
    {
      required: true,
      message: t('validation.projectNameRequired'),
      trigger: 'input',
    },
  ],
  description: [],
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      await createProject();
    }
  });
}
async function createProject() {
  loading.value = true;
  emit('submitActive', true);

  try {
    const res = await $api.post<CreateProjectResponse>(endpoints.projects, formData.value);

    if (res.data) {
      /** Clear all stored data */
      clearAll();

      /** Set new project as current project */
      dataStore.setCurrentProject(res.data.project_uuid);

      emit('submitSuccess');
      emit('submitActive', false);
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
  emit('submitActive', false);
}
</script>
