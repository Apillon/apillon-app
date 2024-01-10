<template>
  <n-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    :disabled="isFormDisabled"
    @submit.prevent="handleSubmit"
  >
    <!--  Chat name -->
    <n-form-item path="name" :label="$t('form.label.chatName')" :label-props="{ for: 'chatName' }">
      <n-input
        v-model:value="formData.name"
        :input-props="{ id: 'chatName' }"
        :placeholder="$t('form.placeholder.typeHere')"
        clearable
      />
    </n-form-item>

    <!-- Chat about -->
    <n-form-item
      path="about"
      :label="$t('form.label.chatAbout')"
      :label-props="{ for: 'chatAbout' }"
    >
      <n-input
        v-model:value="formData.about"
        type="textarea"
        :input-props="{ id: 'chatAbout' }"
        :placeholder="$t('form.placeholder.typeHere')"
        clearable
      />
    </n-form-item>

    <!-- Chat tags -->
    <n-form-item path="tags" :label="$t('form.label.chatTags')" :label-props="{ for: 'chatTags' }">
      <n-input
        v-model:value="formData.tags"
        :input-props="{ id: 'chatTags' }"
        :placeholder="$t('form.placeholder.chatTags')"
        clearable
      />
    </n-form-item>

    <!-- Chat image -->
    <n-form-item
      path="image"
      :label="$t('form.label.chatImage')"
      :label-props="{ for: 'chatImage' }"
    >
      <n-upload
        accept="image/png, image/jpeg"
        :show-file-list="false"
        :disabled="authStore.isAdmin()"
        :custom-request="uploadImageRequest"
      >
        <n-upload-dragger class="h-40">
          <div class="py-2 text-center">
            <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
              <span class="icon-upload text-violet text-2xl"></span>
            </div>

            <h4 class="mb-1">{{ $t('social.chat.uploadImage') }}</h4>
            <span class="text-body">{{ $t('social.chat.dragAndDrop') }}</span>
          </div>
        </n-upload-dragger>
      </n-upload>
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('social.chat.create')" />
      <Btn
        type="primary"
        class="w-full mt-2"
        :loading="loading"
        :disabled="isFormDisabled"
        @click="handleSubmit"
      >
        {{ $t('social.chat.create') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormSpace = {
  name: string;
  about: string | null;
  image: string | null;
  tags: string | null;
};
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const message = useMessage();
const $i18n = useI18n();
const authStore = useAuthStore();
const dataStore = useDataStore();
const chatStore = useChatStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormSpace>({
  name: '',
  about: '',
  image: '',
  tags: '',
});

const rules: NFormRules = {
  name: [ruleRequired($i18n.t('validation.chatNameRequired'))],
  about: [ruleDescription($i18n.t('validation.descriptionTooLong'))],
};

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

/** Upload image request */
async function uploadImageRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  try {
    const image = await convertBase64(file.file);

    if (image) {
      formData.value.image = image;
      onFinish();
    } else {
      onError();
    }
  } catch (error) {
    onError();
  }
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
      await createSpace();
    }
  });
}

async function createSpace() {
  const projectUuid = await dataStore.getProjectUuid();

  loading.value = true;

  try {
    const params = {
      project_uuid: projectUuid,
      ...formData.value,
    };
    const res = await $api.post<ChatResponse>(endpoints.spaces(), params);

    message.success($i18n.t('form.success.created.chatSpace'));

    /** On new space created add new item to list */
    chatStore.items.unshift(res.data);

    /** Clear timestamp to SS */
    sessionStorage.removeItem(LsCacheKeys.CHAT);
    sessionStorage.removeItem(LsCacheKeys.CHATS);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
