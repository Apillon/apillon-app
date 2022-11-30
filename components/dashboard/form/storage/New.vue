<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Service name -->
    <n-form-item
      path="bucketName"
      :label="$t('form.label.bucketName')"
      :label-props="{ for: 'bucketName' }"
    >
      <n-input
        v-model:value="formData.bucketName"
        :input-props="{ id: 'bucketName' }"
        :placeholder="$t('form.placeholder.bucketName')"
      />
    </n-form-item>
    <n-tag :bordered="false" type="info" class="mb-8">Servicename.com/ </n-tag>

    <!--  Bucket Sizes -->
    <n-form-item path="bucketSizes" :label="$t('form.label.bucketSize')">
      <n-radio-group v-model:value="formData.bucketSize" name="radiogroup">
        <n-space>
          <n-radio
            v-for="(size, key) in bucketSizes"
            :key="key"
            :value="size.value"
            :label="size.label"
          />
        </n-space>
      </n-radio-group>
    </n-form-item>

    <!--  Service submit -->
    <n-form-item>
      <input type="submit" class="hidden" :value="$t('form.createBucketAndContinue')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.createBucketAndContinue') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const message = useMessage();
const $i18n = useI18n();
const dataStore = useDataStore();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormNewBucket>({
  bucketName: null,
  bucketSize: null,
});

const rules: NFormRules = {
  bucketName: [
    {
      required: true,
      message: $i18n.t('validation.bucketNameRequired'),
      trigger: 'input',
    },
  ],
  bucketSize: [],
};

const bucketSizes = [
  {
    value: 5,
    label: $i18n.t('form.bucketSizes.5gb'),
  },
  {
    value: 100,
    label: $i18n.t('form.bucketSizes.100gb'),
  },
];

// Submit
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      await createService();
    }
  });
}
async function createService() {
  loading.value = true;

  const bodyData = {
    project_uuid: dataStore.currentProject.project_uuid,
    bucketType: BucketType.STORAGE,
    name: formData.value.bucketName,
    size: formData.value.bucketSize,
  };

  try {
    const { data, error } = await $api.post<NewBucketResponse>(endpoints.bucket, bodyData);

    if (error) {
      message.error(userFriendlyMsg($i18n, error));
      loading.value = false;
      return;
    }

    // TODO
    if (data.data) {
      console.log(data);
    }
    loading.value = false;
  } catch (error) {
    message.error(userFriendlyMsg($i18n, error));
    loading.value = false;
  }
}
</script>
