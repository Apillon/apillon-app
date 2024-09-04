<template>
  <div>
    <Notification v-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <template v-else>
      <!-- Info text -->
      <p v-if="$i18n.te('computing.cloudFunctions.infoNew')" class="text-body mb-8">
        {{ $t('computing.cloudFunctions.infoNew') }}
      </p>
      <p v-else-if="$i18n.te('computing.cloudFunctions.infoEdit')" class="text-body mb-8">
        {{ $t('computing.cloudFunctions.infoEdit') }}
      </p>
    </template>

    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="isFormDisabled"
      autocomplete="off"
      @submit.prevent="handleSubmit"
    >
      <!--  CloudFunctions name -->
      <n-form-item
        path="name"
        :label="$t('form.label.cloudFunctions.name')"
        :label-props="{ for: 'name' }"
      >
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.cloudFunctions.name')"
          clearable
        />
      </n-form-item>

      <!--  CloudFunctions description -->
      <n-form-item
        path="description"
        :label="$t('form.label.cloudFunctions.description')"
        :label-props="{ for: 'description' }"
      >
        <n-input
          v-model:value="formData.description"
          type="textarea"
          :input-props="{ id: 'description' }"
          :placeholder="$t('form.placeholder.cloudFunctions.description')"
          clearable
        />
      </n-form-item>

      <!--  Form submit -->
      <n-form-item :show-feedback="false" :show-label="false">
        <input type="submit" class="hidden" :value="$t('form.continue')" />
        <Btn
          type="primary"
          class="w-full mt-2"
          :loading="loading"
          :disabled="isFormDisabled"
          @click="handleSubmit"
        >
          {{ $t('form.continue') }}
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
type FormCloudFunctions = {
  name: string | null;
  description?: string | null;
};
const emit = defineEmits(['submitSuccess', 'createSuccess']);

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const warningStore = useWarningStore();
const cloudFunctionStore = useCloudFunctionStore();

const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormCloudFunctions>({
  name: null,
  description: null,
});

const rules: NFormRules = {
  name: ruleRequired($i18n.t('validation.cloudFunctions.nameRequired')),
  description: ruleDescription($i18n.t('validation.descriptionTooLong')),
};

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      warningStore.showSpendingWarning(PriceServiceName.COMPUTING_JOB_CREATE, () =>
        createCloudFunctions()
      );
    }
  });
}

async function createCloudFunctions() {
  loading.value = true;

  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
    if (!dataStore.projectUuid) return;
  }

  try {
    const bodyData = {
      project_uuid: dataStore.projectUuid,
      name: formData.value.name,
      description: formData.value.description,
    };
    const res = await $api.post<CloudFunctionResponse>(endpoints.cloudFunctions(), bodyData);

    cloudFunctionStore.items.push(res.data);

    message.success($i18n.t('form.success.created.cloudFunction'));

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
