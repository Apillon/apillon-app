<template>
  <div v-if="loadingForm" class="min-h-52">
    <Spinner />
  </div>
  <div v-else>
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
      <n-form-item
        v-show="!cloudFunction?.bucket_uuid"
        path="bucket_uuid"
        :label="$t('form.label.bucketName')"
        :label-props="{ for: 'bucket_uuid' }"
      >
        <select-options
          v-model:value="formData.bucket_uuid"
          :options="buckets"
          :loading="loading"
          :placeholder="$t('general.pleaseSelect')"
          filterable
          clearable
        />
      </n-form-item>
      <!--  CloudFunctions name -->
      <n-form-item
        path="name"
        :label="$t('form.label.cloudFunctions.jobName')"
        :label-props="{ for: 'name' }"
        :required="true"
      >
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.cloudFunctions.jobName')"
          clearable
        />
      </n-form-item>
      <!--  CloudFunctions slots -->
      <n-form-item path="slots" :label="labelInfo('slots')" :label-props="{ for: 'slots' }">
        <n-input-number
          v-model:value="formData.slots"
          :min="1"
          :step="1"
          :input-props="{ id: 'slots' }"
          :placeholder="$t('form.placeholder.number')"
          disabled
          clearable
        />
      </n-form-item>

      <!-- Info text with icon for allowed file types -->
      <n-alert type="info" class="mb-4">
        <template #icon>
          <span class="icon-info"></span>
        </template>
        {{ $t('form.placeholder.onlyJsFiles') }}
      </n-alert>

      <!--  File -->
      <n-form-item
        v-if="!props.jobUuid"
        path="file"
        :label="$t('form.label.contract.file')"
        :label-props="{ for: 'file' }"
      >
        <FormFieldUploadFile :file="formData.file" @upload="onFileChange" />
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
import type { SelectOption, UploadCustomRequestOptions } from 'naive-ui';

const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);
const props = defineProps({
  functionUuid: { type: String, required: true },
  jobUuid: { type: String, default: '' },
});

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const warningStore = useWarningStore();
const cloudFunctionStore = useCloudFunctionStore();
const { createNewJob } = useCloudFunctions();
const { labelInfo } = useForm('form.label.cloudFunctions');

const loading = ref<boolean>(false);
const loadingForm = ref<boolean>(true);
const formRef = ref<NFormInst | null>(null);
const cloudFunction = ref<CloudFunctionInterface | undefined>();
const job = ref<JobInterface | undefined>();

const formData = ref<FormCloudFunctionsJob>({
  name: null,
  slots: 1,
  scriptCid: null,
  file: null,
  bucket_uuid: null,
});

const rules: NFormRules = {
  // slots: ruleRequired(t('validation.cloudFunctions.slotsRequired')),
  name: ruleRequired(t('validation.cloudFunctions.nameRequired')),
  file: ruleRequired(t('validation.cloudFunctions.fileRequired')),
};

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});
const buckets = computed<Array<SelectOption>>(() => {
  return bucketStore.items.map(item => {
    return { label: item.name, value: item.bucket_uuid };
  });
});

onMounted(async () => {
  cloudFunction.value = await cloudFunctionStore.getCloudFunction(props.functionUuid);
  if (cloudFunction.value.bucket_uuid) {
    formData.value.bucket_uuid = cloudFunction.value.bucket_uuid;
  } else {
    await bucketStore.getBuckets();
  }
  loadingForm.value = false;

  job.value = cloudFunctionStore.jobs.find(item => item.job_uuid === props.jobUuid);
  if (props.jobUuid && job.value) {
    formData.value.name = job.value.name;
    formData.value.slots = Number(job.value.slots || 0);
    formData.value.scriptCid = job.value.scriptCid;
  }
});

async function onFileChange({ file, onError, onFinish }: UploadCustomRequestOptions) {
  const size = file.file?.size || 0;

  if (!file.type?.startsWith('text/javascript') && !file.type?.startsWith('application/x-javascript')) {
    message.warning(t('validation.cloudFunctions.fileType'));
    console.warn('File type is not supported:', file.type);
    onError();
    return;
  }

  formData.value.file = {
    ...file,
    path: file.fullPath,
    percentage: 0,
    size,
    timestamp: Date.now(),
    onFinish,
    onError,
  };
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (props.jobUuid) {
      updateJob();
    } else {
      warningStore.showSpendingWarning(PriceServiceName.COMPUTING_JOB_CREATE, () => createJob());
    }
  });
}

async function createJob() {
  loading.value = true;
  emit('submitSuccess');

  if (cloudFunction.value && !cloudFunction.value.bucket_uuid) {
    cloudFunctionStore.active.bucket_uuid = formData.value.bucket_uuid || '';
    updateCloudFunctionBucket();
  }

  const newJob = await createNewJob(formData.value, props.functionUuid);
  if (newJob) {
    /** Emit events */
    emit('createSuccess', newJob);
  }
  loading.value = false;
}

async function updateJob() {
  loading.value = true;

  try {
    const res = await $api.patch<JobResponse>(endpoints.acurastJobs(props.jobUuid), formData.value);
    cloudFunctionStore.updateJob(res.data);

    message.success(t('form.success.updated.cloudFunctionJob'));

    /** Emit events */
    emit('submitSuccess');
    emit('updateSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateCloudFunctionBucket() {
  try {
    const bodyData = {
      ...cloudFunctionStore.active,
      bucket_uuid: formData.value.bucket_uuid,
    };
    const res = await $api.patch<CloudFunctionResponse>(endpoints.cloudFunctions(props.functionUuid), bodyData);

    cloudFunctionStore.active.bucket_uuid = res.data.bucket_uuid;
    cloudFunctionStore.items.forEach(item => {
      if (item.function_uuid === res.data.function_uuid) {
        Object.assign(item, res.data);
      }
    });
  } catch (error) {
    console.error(error);
    message.error(userFriendlyMsg(error));
  }
}
</script>
