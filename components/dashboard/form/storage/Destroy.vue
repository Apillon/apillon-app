<template>
  <n-form ref="formRef" :model="formData" :rules="rules">
    <!--  Folder submit -->
    <n-form-item>
      <input type="hidden" name="bucketId" :value="formData.bucketId" readonly />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('storage.destroyBucket') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';

const props = defineProps({
  bucketId: { type: Number, required: true },
});

const $i18n = useI18n();
const dataStore = useDataStore();
const router = useRouter();

/** Form folder */
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const formData = ref<{ bucketId: number }>({
  bucketId: props.bucketId,
});

const rules: NFormRules = {
  bucketId: [
    {
      required: true,
      message: $i18n.t('validation.bucketIdRequired'),
    },
  ],
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else {
      await bucketDestroy();
    }
  });
}
async function bucketDestroy() {
  loading.value = true;

  try {
    const res = await $api.delete(endpoints.bucket(props.bucketId));

    message.success($i18n.t('form.success.bucketDestroyed'));

    /** On deleted bucket redirect to storage list in refresh data */
    dataStore.fetchBuckets();
    router.push({ name: 'dashboard-service-storage' });
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
