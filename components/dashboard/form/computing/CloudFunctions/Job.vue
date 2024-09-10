<template>
  <div>
    <Notification v-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <template v-else>
      <!-- Info text -->
      <p v-if="$te('computing.cloudFunctions.infoNew')" class="text-body mb-8">
        {{ $t('computing.cloudFunctions.infoNew') }}
      </p>
      <p v-else-if="$te('computing.cloudFunctions.infoEdit')" class="text-body mb-8">
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
        :label="$t('form.label.cloudFunctions.jobName')"
        :label-props="{ for: 'name' }"
      >
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.cloudFunctions.jobName')"
          clearable
        />
      </n-form-item>
      <!--  CloudFunctions slots -->
      <n-form-item
        path="slots"
        :label="$t('form.label.cloudFunctions.slots')"
        :label-props="{ for: 'slots' }"
      >
        <n-input-number
          v-model:value="formData.slots"
          :min="1"
          :step="1"
          :input-props="{ id: 'slots' }"
          :placeholder="$t('form.placeholder.number')"
          clearable
        />
      </n-form-item>

      <!--  File -->
      <n-form-item
        v-if="!props.jobUuid"
        accept="text/javascript, text/plain"
        path="file"
        :label="$t('form.label.contract.file')"
        :label-props="{ for: 'file' }"
      >
        <FormFieldUploadFile :file="formData.file" @upload="onFileChange" />
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
import type { UploadCustomRequestOptions } from 'naive-ui';

type FormCloudFunctions = {
  name: string | null;
  slots?: number | null;
  scriptCid: string | null;
  file: FileListItemType | undefined | null;
};

const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);
const props = defineProps({
  functionUuid: { type: String, required: true },
  jobUuid: { type: String, default: '' },
});

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const warningStore = useWarningStore();
const cloudFunctionStore = useCloudFunctionStore();
const { checkUnfinishedJobs } = useCloudFunctions();
const { uploadFileToIPFS } = useComputing();

const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const cloudFunction = ref<CloudFunctionInterface | undefined>();
const job = ref<JobInterface | undefined>();

const formData = ref<FormCloudFunctions>({
  name: null,
  slots: null,
  scriptCid: null,
  file: null,
});

const rules: NFormRules = {
  slots: ruleRequired(t('validation.cloudFunctions.slotsRequired')),
  file: ruleRequired(t('validation.cloudFunctions.fileRequired')),
};

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

onMounted(async () => {
  if (props.jobUuid) {
    cloudFunction.value = await cloudFunctionStore.getCloudFunction(props.functionUuid);
    job.value = cloudFunctionStore.jobs.find(item => item.job_uuid === props.jobUuid);

    if (job.value) {
      formData.value.name = job.value.name;
      formData.value.slots = Number(job.value.slots || 0);
      formData.value.scriptCid = job.value.scriptCid;
    }
  }
});

async function onFileChange({ file, onError, onFinish }: UploadCustomRequestOptions) {
  const size = file.file?.size || 0;

  // if (!file.type?.startsWith('text/javascript')) {
  //   message.warning(t('validation.cloudFunctions.fileType'));
  //   onError();
  //   return;
  // }

  formData.value.file = {
    ...file,
    percentage: 0,
    size: size,
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
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (props.jobUuid) {
      updateCloudFunction();
    } else {
      warningStore.showSpendingWarning(PriceServiceName.COMPUTING_JOB_CREATE, () =>
        createCloudFunction()
      );
    }
  });
}

async function createCloudFunction() {
  loading.value = true;

  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
    if (!dataStore.projectUuid) return;
  }

  try {
    await uploadFile(formData.value.file);

    const bodyData = {
      project_uuid: dataStore.projectUuid,
      function_uuid: props.functionUuid,
      name: formData.value.name,
      slots: formData.value.slots,
      scriptCid: formData.value.scriptCid,
    };
    const res = await $api.post<JobResponse>(
      endpoints.cloudFunctionJobs(props.functionUuid),
      bodyData
    );
    cloudFunctionStore.addJob(res.data);

    message.success(t('form.success.created.cloudFunctionJob'));

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', res.data);

    setTimeout(() => checkUnfinishedJobs(), 20000);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateCloudFunction() {
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

async function uploadFile(file?: FileListItemType | null) {
  if (!file?.file) return;

  const fileDetails = await uploadFileToIPFS(file, cloudFunctionStore.active.bucket_uuid);

  if (fileDetails) {
    const cid = fileDetails.CIDv1 || fileDetails.CID;

    const fileLink = new URL(fileDetails.link);
    const token = fileLink.searchParams.get('token');
    formData.value.scriptCid = `${cid}/?token=${token}`;
  }
}
</script>
