<template>
  <div>
    <p class="text-body mb-8">
      {{ $t('storage.bucket.infoNew') }}
    </p>

    <!-- Notification - show if qouta has been reached -->
    <Notification v-if="isQuotaReached" type="warning" class="w-full mb-8">
      {{ $t('storage.bucket.quotaReached') }}
    </Notification>

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

      <!--  Bucket Sizes -->
      <n-form-item path="bucketSizes" :label="$t('form.label.bucketSize')">
        <n-radio-group v-model:value="formData.bucketSize" name="bucketSize" class="w-full">
          <n-grid :cols="2" :x-gap="32" :y-gap="32">
            <n-gi v-for="(size, key) in bucketSizes" :key="key">
              <!-- If option is disabled, show tooltip on hover -->
              <n-tooltip v-if="size?.disabled" trigger="hover" :style="{ maxWidth: '220px' }">
                <template #trigger>
                  <n-radio-button
                    :key="key"
                    :value="size.value"
                    :label="size.label"
                    :disabled="true"
                  />
                </template>
                {{ $t('dashboard.currentlyNotAvailable') }}
              </n-tooltip>
              <n-radio-button v-else :key="key" :value="size.value" :label="size.label" />
            </n-gi>
          </n-grid>
        </n-radio-group>
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
          <template v-if="bucket">
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
import { useMessage } from 'naive-ui';

const props = defineProps({
  bucketId: { type: Number, default: 0 },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const message = useMessage();
const $i18n = useI18n();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const bucket: BucketInterface | null =
  props.bucketId > 0 ? await dataStore.getBucket(props.bucketId) : null;

const formData = ref<FormNewBucket>({
  bucketName: bucket?.name || '',
  bucketDescription: bucket?.description || '',
  bucketSize: 5,
});

const rules: NFormRules = {
  bucketName: [
    {
      required: true,
      message: $i18n.t('validation.bucketNameRequired'),
      trigger: 'input',
    },
  ],
  bucketDescription: [
    {
      max: 255,
      message: $i18n.t('validation.bucketDescriptionTooLong'),
      trigger: 'input',
    },
  ],
  bucketSize: [],
};

const bucketSizes: Array<NRadioOption> = [
  {
    value: 5,
    label: $i18n.t('form.bucketSizes.5gb'),
  },
  {
    value: 100,
    label: $i18n.t('form.bucketSizes.100gb'),
    disabled: true,
  },
];

const isQuotaReached = computed<boolean>(() => {
  return !bucket && dataStore.bucket.quotaReached === true;
});
const isFormDisabled = computed<boolean>(() => {
  return isQuotaReached.value || settingsStore.isProjectUser();
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else if (bucket) {
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

  const bodyData = {
    project_uuid: dataStore.projectUuid,
    bucketType: BucketType.STORAGE,
    name: formData.value.bucketName,
    description: formData.value.bucketDescription,
    size: formData.value.bucketSize,
  };

  try {
    await $api.post<BucketResponse>(endpoints.buckets, bodyData);

    message.success($i18n.t('form.success.created.bucket'));

    /** On new bucket created redirect to storage list in refresh data */
    dataStore.fetchBuckets();

    /** Reset bucket qouta limit */
    dataStore.bucket.quotaReached = undefined;

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateBucket() {
  loading.value = true;

  const bodyData = {
    name: formData.value.bucketName,
    description: formData.value.bucketDescription,
  };

  try {
    const res = await $api.patch<BucketResponse>(endpoints.bucket(props.bucketId), bodyData);

    message.success($i18n.t('form.success.updated.bucket'));

    /** On bucket updated refresh bucket data */
    dataStore.bucket.items.forEach((item: BucketInterface) => {
      if (item.id === props.bucketId) {
        item.name = res.data.name;
        item.description = res.data.description;
      }
    });
    if (dataStore.bucket.active.id === props.bucketId) {
      dataStore.bucket.active.name = res.data.name;
      dataStore.bucket.active.description = res.data.description;
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
