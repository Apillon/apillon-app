<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Folder name -->
    <n-form-item path="name" :label="$t('form.label.folderName')" :label-props="{ for: 'folderName' }">
      <n-input
        v-model:value="formData.name"
        :input-props="{ id: 'folderName' }"
        :placeholder="$t('form.placeholder.folderName')"
        @input="handleFolderNameInput"
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
      <Btn type="primary" class="mt-2 w-full" :loading="loading" @click="handleSubmit">
        {{ $t('storage.directory.createNew') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormFolder = {
  name: string;
  description?: string | null;
};

const props = defineProps({
  bucketUuid: { type: String, default: null },
  parentFolderUuid: { type: String, default: null },
});
const emit = defineEmits(['submitSuccess']);

const { t } = useI18n();
const message = useMessage();
const bucketStore = useBucketStore();

/** Form folder */
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormFolder>({
  name: '',
  description: null,
});

const rules: NFormRules = {
  name: [
    {
      required: true,
      message: t('validation.folderNameRequired'),
      trigger: 'input',
    },
  ],
  description: [],
};

/** Computed values - bucketUuid and parentFolderID (use fallback data from dataStore) */
const bucketUuid = computed(() => {
  return props.bucketUuid || bucketStore.selected;
});
const folderUuid = computed(() => {
  return props.parentFolderUuid || bucketStore.folder.selected;
});

/** Format credit card */
function handleFolderNameInput(value: string | [string, string]) {
  formData.value.name = stripFolderName(value);
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (!errors) {
      await createFolder();
    }
  });
}
async function createFolder() {
  loading.value = true;

  try {
    const res = await $api.post<CreateFolderResponse>(endpoints.directory(), {
      ...formData.value,
      bucket_uuid: bucketUuid.value,
      parentDirectory_uuid: folderUuid.value,
    });

    if (res.data) {
      message.success(t('form.success.created.directory'));
      emit('submitSuccess');
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
