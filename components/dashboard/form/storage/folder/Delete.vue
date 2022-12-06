<template>
  <n-form ref="formRef" :model="formData" :rules="rules">
    <!--  Folder submit -->
    <n-form-item>
      <input type="hidden" name="folderId" :value="formData.folderId" readonly />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('storage.folderDelete') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  folderId: { type: Number, required: true },
});

const $i18n = useI18n();
const dataStore = useDataStore();
const emit = defineEmits(['submitSuccess']);

/** Form folder */
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const formData = ref<{ folderId: number }>({
  folderId: props.folderId,
});

const rules: NFormRules = {
  folderId: [
    {
      required: true,
      message: $i18n.t('validation.folderIdRequired'),
    },
  ],
};

// Submit
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else {
      await folderDestroy();
    }
  });
}
async function folderDestroy() {
  loading.value = true;

  try {
    const res = await $api.delete(`${endpoints.directory}${props.folderId}`);

    message.success($i18n.t('form.success.folderDestroyed'));
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loading.value = false;
}
</script>
