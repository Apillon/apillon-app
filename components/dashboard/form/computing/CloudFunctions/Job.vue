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

      <n-grid class="items-end" :cols="2" :x-gap="32">
        <!--  CloudFunctions Start time -->
        <n-form-item-gi
          path="startTime"
          :label="$t('form.label.cloudFunctions.startTime')"
          :label-props="{ for: 'startTime' }"
        >
          <n-date-picker
            v-model:value="formData.startTime"
            class="w-full"
            type="datetime"
            :input-props="{ id: 'startTime' }"
            clearable
            :is-date-disabled="disablePasteDate"
            :is-time-disabled="disablePasteTime"
          />
        </n-form-item-gi>

        <!--  CloudFunctions End time -->
        <n-form-item-gi
          path="endTime"
          :label="$t('form.label.cloudFunctions.endTime')"
          :label-props="{ for: 'endTime' }"
        >
          <n-date-picker
            v-model:value="formData.endTime"
            class="w-full"
            type="datetime"
            :input-props="{ id: 'endTime' }"
            clearable
            :is-date-disabled="disablePasteDate"
            :is-time-disabled="disablePasteTime"
          />
        </n-form-item-gi>
      </n-grid>

      <!--  File -->
      <n-form-item
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
  slots?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  scriptCid: string | null;
  file: FileListItemType | undefined | null;
};

const props = defineProps({
  functionUuid: { type: String, default: '' },
});
const emit = defineEmits(['submitSuccess', 'createSuccess']);

const { t } = useI18n();
const message = useMessage();
const jobStore = useJobStore();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const warningStore = useWarningStore();
const { uploadFileToIPFS } = useComputing();
const { disablePasteDate, disablePasteTime } = useCollection();

const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormCloudFunctions>({
  name: null,
  slots: null,
  startTime: null,
  endTime: null,
  scriptCid: null,
  file: null,
});

const rules: NFormRules = {
  slots: ruleRequired(t('validation.cloudFunctions.slotsRequired')),
  startTime: ruleRequired(t('validation.cloudFunctions.startTimeRequired')),
  endTime: ruleRequired(t('validation.cloudFunctions.endTimeRequired')),
  file: ruleRequired(t('validation.cloudFunctions.fileRequired')),
};

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

onMounted(async () => {
  if (props.functionUuid) {
    // bucket.value = await bucketStore.getBucket(props.functionUuid);
    // formData.value.bucketName = bucket.value.name;
    // formData.value.bucketslots = bucket.value.slots;
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
    await uploadFile(formData.value.file);

    const bodyData = {
      project_uuid: dataStore.projectUuid,
      function_uuid: props.functionUuid,
      name: formData.value.name,
      slots: formData.value.slots,
      endTime: formData.value.endTime,
      startTime: formData.value.startTime,
      scriptCid: formData.value.scriptCid,
    };
    const res = await $api.post<JobResponse>(
      endpoints.cloudFunctionJobs(props.functionUuid),
      bodyData
    );
    jobStore.items.push(res.data);

    message.success(t('form.success.created.cloudFunction'));

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function uploadFile(file?: FileListItemType | null) {
  if (!file?.file) return;

  // const buckets = (await bucketStore.getBuckets()) || [];
  const fileDetails = await uploadFileToIPFS(file, '3d02fe42-ab65-443d-a1d3-623bcd1c98c3');

  if (fileDetails) {
    const cid = fileDetails.CIDv1 || fileDetails.CID;

    const fileLink = new URL(fileDetails.link);
    const token = fileLink.searchParams.get('token');
    formData.value.scriptCid = `${cid}/?token=${token}`;
  }
}
</script>
