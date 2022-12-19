<template>
  <n-form ref="formRef" :model="formData" :rules="rules">
    <!--  Folder submit -->
    <n-form-item>
      <input type="hidden" name="apiKeyId" :value="formData.apiKeyId" readonly />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('dashboard.apiKey.delete') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  apiKeyId: { type: Number, required: true },
});

const $i18n = useI18n();
const settingsStore = useSettingsStore();
const emit = defineEmits(['submitSuccess']);

/** Form folder */
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const formData = ref<{ apiKeyId: number }>({
  apiKeyId: props.apiKeyId,
});

const rules: NFormRules = {
  apiKeyId: [
    {
      required: true,
      message: $i18n.t('validation.apiKeyIdRequired'),
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
      await deleteApiKey();
    }
  });
}
async function deleteApiKey() {
  loading.value = true;

  try {
    const res = await $api.delete<DeleteResponse>(`${endpoints.apiKey}${props.apiKeyId}`);

    message.success($i18n.t('form.success.deleted.apiKey'));

    /** On deleted Api key refresh data */
    settingsStore.fetchApiKeys();
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loading.value = false;
}
</script>
