<template>
  <Spinner v-if="bucketUuid && !bucket" />
  <div v-else>
    <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <template v-else>
      <!-- Info text -->
      <p v-if="!bucketUuid && $te('storage.bucket.infoNew')" class="mb-8 text-body">
        {{ $t('storage.bucket.infoNew') }}
      </p>
      <p v-else-if="!!bucketUuid && $te('storage.bucket.infoEdit')" class="mb-8 text-body">
        {{ $t('storage.bucket.infoEdit') }}
      </p>
    </template>

    <n-form ref="formRef" :model="formData" :rules="rules" :disabled="isFormDisabled" @submit.prevent="handleSubmit">
      <!--  Bucket name -->
      <n-form-item path="bucketName" :label="$t('form.label.bucketName')" :label-props="{ for: 'bucketName' }">
        <n-input
          v-model:value="formData.bucketName"
          :input-props="{ id: 'bucketName' }"
          :placeholder="$t('form.placeholder.bucketName')"
          clearable
        />
      </n-form-item>

      <!--  Bucket description -->
      <n-form-item
        path="bucketDescription"
        :label="$t('form.label.bucketDescription')"
        :label-props="{ for: 'bucketDescription' }"
      >
        <n-input
          v-model:value="formData.bucketDescription"
          type="textarea"
          :input-props="{ id: 'bucketDescription' }"
          :placeholder="$t('form.placeholder.bucketDescription')"
          clearable
        />
      </n-form-item>

      <!--  Form submit -->
      <n-form-item :show-label="false" :show-feedback="false">
        <input type="submit" class="hidden" :value="$t('form.createBucketAndContinue')" />
        <Btn type="primary" class="mt-2 w-full" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
          <template v-if="submitText">
            {{ submitText }}
          </template>
          <template v-else-if="bucketType === BucketType.NFT_METADATA">
            {{ $t('storage.bucket.update') }}
          </template>
          <template v-else-if="bucket">
            {{ $t('storage.bucket.update') }}
          </template>
          <template v-else>
            {{ $t('form.createBucketAndContinue') }}
          </template>
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
type FormNewBucket = {
  bucketName: string;
  bucketDescription: string | null;
};

const props = defineProps({
  bucketType: { type: Number, default: BucketType.STORAGE },
  bucketUuid: { type: String, default: '' },
  submitText: { type: String, default: null },
});
const emit = defineEmits(['submit', 'submitSuccess', 'createSuccess', 'updateSuccess']);

const message = useMessage();
const { t } = useI18n();
const dataStore = useDataStore();
const bucketStore = useBucketStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const bucket = ref<BucketInterface | null>(null);

const formData = ref<FormNewBucket>({
  bucketName: bucket.value?.name || '',
  bucketDescription: bucket.value?.description || '',
});

const rules: NFormRules = {
  bucketName: [ruleRequired(t('validation.bucketNameRequired'))],
  bucketDescription: [ruleDescription(t('validation.descriptionTooLong'))],
};

onMounted(async () => {
  if (props.bucketUuid) {
    bucket.value = await bucketStore.getBucket(props.bucketUuid);
    formData.value.bucketName = bucket.value.name;
    formData.value.bucketDescription = bucket.value.description;
  }
});

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (props.bucketUuid) {
      await updateBucket();
    } else {
      await createBucket();
    }
  });
}

async function createBucket() {
  const projectUuid = await dataStore.getProjectUuid();

  loading.value = true;
  emit('submit');

  const bodyData = {
    project_uuid: projectUuid,
    bucketType: props.bucketType,
    name: formData.value.bucketName,
    description: formData.value.bucketDescription,
  };

  try {
    const res = await $api.post<BucketResponse>(endpoints.buckets, bodyData);

    message.success(t('form.success.created.bucket'));

    /** On new bucket created push data to list */
    bucketStore.items.push(res.data);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateBucket() {
  loading.value = true;
  emit('submit');

  const bodyData = {
    name: formData.value.bucketName,
    description: formData.value.bucketDescription,
  };

  try {
    const res = await $api.patch<BucketResponse>(endpoints.bucket(props.bucketUuid), bodyData);

    message.success(t('form.success.updated.bucket'));

    /** On bucket updated refresh bucket data */
    bucketStore.items.forEach((item: BucketInterface) => {
      if (item.bucket_uuid === props.bucketUuid) {
        item.name = res.data.name;
        item.description = res.data.description;
      }
    });
    if (bucketStore.active?.bucket_uuid === props.bucketUuid) {
      bucketStore.active.name = res.data.name;
      bucketStore.active.description = res.data.description;
    }

    /** Emit events */
    emit('submitSuccess');
    emit('updateSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
