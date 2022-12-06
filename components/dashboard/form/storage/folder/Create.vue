<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Folder name -->
    <n-form-item
      path="name"
      :label="$t('form.label.folderName')"
      :label-props="{ for: 'folderName' }"
    >
      <n-input
        v-model:value="formData.name"
        :input-props="{ id: 'folderName' }"
        :placeholder="$t('form.placeholder.folderName')"
        @keydown.enter.prevent
      />
    </n-form-item>

    <!--  Folder description -->
    <n-form-item
      path="description"
      :label="$t('form.label.folderDescription')"
      :label-props="{ for: 'folderDescription' }"
    >
      <n-input
        v-model:value="formData.description"
        type="textarea"
        :input-props="{ id: 'folderDescription' }"
        :placeholder="$t('form.placeholder.folderDescription')"
      />
    </n-form-item>

    <!--  Folder submit -->
    <n-form-item>
      <input type="submit" class="hidden" :value="$t('form.login')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('storage.createNewFolder') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  bucketId: { type: Number },
  parentFolderId: { type: Number },
});

const $i18n = useI18n();
const dataStore = useDataStore();
const emit = defineEmits(['submitSuccess']);

/** Form folder */
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const formData = ref<FormFolder>({
  name: '',
  description: null,
});

const rules: NFormRules = {
  name: [
    {
      required: true,
      message: $i18n.t('validation.folderNameRequired'),
      trigger: 'input',
    },
  ],
  description: [],
};

/** Computed values - bucketId and parentFolderID (use fallback data from dataStore) */
const bucketId = computed(() => {
  return props.bucketId || dataStore.selected.bucketId;
});
const parentFoldertId = computed(() => {
  return props.parentFolderId || dataStore.selected.folderId;
});

// Submit
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else {
      await createFolder();
    }
  });
}
async function createFolder() {
  loading.value = true;

  try {
    const params =
      parentFoldertId.value > 0
        ? {
            ...formData.value,
            bucket_id: bucketId.value,
            parentDirectory_id: parentFoldertId.value,
          }
        : {
            ...formData.value,
            bucket_id: bucketId.value,
          };
    const res = await $api.post<CreateFolderResponse>(endpoints.directory, params);

    if (res.data) {
      message.success($i18n.t('form.success.folderCreated'));
      emit('submitSuccess');
    }
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loading.value = false;
}
</script>
