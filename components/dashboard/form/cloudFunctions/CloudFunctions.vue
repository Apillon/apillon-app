<template>
  <div>
    <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <template v-else>
      <!-- Info text -->
      <p v-if="$te('computing.cloudFunctions.infoNew')" class="mb-8 text-body">
        {{ $t('computing.cloudFunctions.infoNew') }}
      </p>
      <p v-else-if="$te('computing.cloudFunctions.infoEdit')" class="mb-8 text-body">
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
      <n-form-item path="name" :label="$t('form.label.cloudFunctions.name')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.cloudFunctions.name')"
          clearable
        />
      </n-form-item>

      <!--  CloudFunctions description -->
      <n-form-item path="description" :label="$t('form.label.description')" :label-props="{ for: 'description' }">
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
        <Btn type="primary" class="mt-2 w-full" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
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
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);
const props = defineProps({
  functionUuid: { type: String, default: null },
});

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const cloudFunctionStore = useCloudFunctionStore();

const loading = ref<boolean>(true);
const cloudFunction = ref<CloudFunctionInterface | undefined>();
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormCloudFunctions>({
  name: null,
  description: null,
});

const rules: NFormRules = {
  name: ruleRequired(t('validation.cloudFunctions.nameRequired')),
  description: ruleDescription(t('validation.descriptionTooLong')),
};

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

onMounted(async () => {
  if (props.functionUuid) {
    cloudFunction.value = await cloudFunctionStore.getCloudFunction(props.functionUuid);

    if (cloudFunction.value) {
      formData.value.name = cloudFunction.value.name;
      formData.value.description = cloudFunction.value.description;
    }
  }
  loading.value = false;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (props.functionUuid) {
      updateCloudFunction();
    } else {
      createCloudFunction();
    }
  });
}

async function createCloudFunction() {
  if (!dataStore.projectUuid) return;

  loading.value = true;
  try {
    const bodyData = {
      project_uuid: dataStore.projectUuid,
      name: formData.value.name,
      description: formData.value.description,
    };
    const res = await $api.post<CloudFunctionResponse>(endpoints.cloudFunctions(), bodyData);

    cloudFunctionStore.items.unshift(res.data);

    message.success(t('form.success.created.cloudFunction'));

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateCloudFunction() {
  loading.value = true;

  try {
    const res = await $api.patch<CloudFunctionResponse>(endpoints.cloudFunctions(props.functionUuid), formData.value);
    cloudFunctionStore.items.forEach(item => {
      if (item.function_uuid === res.data.function_uuid) {
        Object.assign(item, res.data);
      }
    });

    message.success(t('form.success.updated.cloudFunction'));

    /** Emit events */
    emit('submitSuccess');
    emit('updateSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
