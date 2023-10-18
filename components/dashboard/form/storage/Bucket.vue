<template>
  <Spinner v-if="bucketId > 0 && !bucket" />
  <div v-else>
    <!-- Notification - show if qouta has been reached -->
    <Notification v-if="isQuotaReached" type="warning" class="w-full mb-8">
      {{ $t('storage.bucket.quotaReached') }}
    </Notification>
    <Notification v-else-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <template v-else>
      <!-- Info text -->
      <p v-if="bucketId === 0 && $i18n.te('storage.bucket.infoNew')" class="text-body mb-8">
        {{ $t('storage.bucket.infoNew') }}
      </p>
      <p v-else-if="bucketId > 0 && $i18n.te('storage.bucket.infoEdit')" class="text-body mb-8">
        {{ $t('storage.bucket.infoEdit') }}
      </p>
    </template>

    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <!--  Bucket name -->
      <n-form-item
        path="bucketName"
        :label="$t('form.label.bucketName')"
        :label-props="{ for: 'bucketName' }"
      >
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
      <n-form-item>
        <input type="submit" class="hidden" :value="$t('form.createBucketAndContinue')" />
        <Btn
          type="primary"
          class="w-full mt-2"
          :loading="loading"
          :disabled="isFormDisabled"
          @click="handleSubmit"
        >
          <template v-if="bucketType === BucketType.NFT_METADATA">
            {{ $t('nft.metadata.createBucket') }}
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
const props = defineProps({
  bucketId: { type: Number, default: 0 },
  bucketType: { type: Number, default: BucketType.STORAGE },
});
const emit = defineEmits(['submit', 'submitSuccess', 'createSuccess', 'updateSuccess']);

const message = useMessage();
const $i18n = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const settingsStore = useSettingsStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const bucket = ref<BucketInterface | null>(null);

onMounted(async () => {
  if (props.bucketId) {
    bucket.value = await bucketStore.getBucket(props.bucketId);
    formData.value.bucketName = bucket.value.name;
    formData.value.bucketDescription = bucket.value.description;
  }
});

const formData = ref<FormNewBucket>({
  bucketName: bucket.value?.name || '',
  bucketDescription: bucket.value?.description || '',
});

const rules: NFormRules = {
  bucketName: [
    {
      required: true,
      message: $i18n.t('validation.bucketNameRequired'),
    },
  ],
  bucketDescription: [
    {
      max: 255,
      message: $i18n.t('validation.bucketDescriptionTooLong'),
      trigger: 'input',
    },
  ],
};

const isQuotaReached = computed<boolean>(() => {
  return props.bucketId === 0 && bucketStore.quotaReached === true;
});
const isFormDisabled = computed<boolean>(() => {
  return isQuotaReached.value || dataStore.isProjectUser;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (props.bucketId > 0) {
      await updateBucket();
    } else {
      await createBucket();
    }
  });
}

async function createBucket() {
  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  loading.value = true;
  emit('submit');

  const bodyData = {
    project_uuid: dataStore.projectUuid,
    bucketType: props.bucketType,
    name: formData.value.bucketName,
    description: formData.value.bucketDescription,
  };

  try {
    const res = await $api.post<BucketResponse>(endpoints.buckets, bodyData);

    message.success($i18n.t('form.success.created.bucket'));

    /** On new bucket created push data to list */
    bucketStore.items.push(res.data);

    /** Reset bucket qouta limit */
    bucketStore.quotaReached = undefined;

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', res.data);

    /** Redirect to new bucket */
    if (props.bucketType !== BucketType.NFT_METADATA) {
      router.push(`/dashboard/service/storage/${res.data.id}`);
    }
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
    const res = await $api.patch<BucketResponse>(endpoints.bucket(props.bucketId), bodyData);

    message.success($i18n.t('form.success.updated.bucket'));

    /** On bucket updated refresh bucket data */
    bucketStore.items.forEach((item: BucketInterface) => {
      if (item.id === props.bucketId) {
        item.name = res.data.name;
        item.description = res.data.description;
      }
    });
    if (bucketStore.active.id === props.bucketId) {
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
