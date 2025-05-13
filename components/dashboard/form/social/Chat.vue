<template>
  <n-form ref="formRef" :model="formData" :rules="rules" :disabled="isFormDisabled" @submit.prevent="handleSubmit">
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
    <n-form-item path="about" :label="$t('form.label.chatAbout')" :label-props="{ for: 'chatAbout' }">
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

    <!--  Form submit -->
    <n-form-item :show-label="false" :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('social.chat.create')" />
      <Btn type="primary" class="mt-2 w-full" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
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
const { t } = useI18n();
const dataStore = useDataStore();
const chatStore = useChatStore();
const warningStore = useWarningStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormSpace>({
  name: '',
  about: '',
  image: '',
  tags: '',
});

const rules: NFormRules = {
  name: [ruleRequired(t('validation.chatNameRequired'))],
  about: [ruleDescription(t('validation.descriptionTooLong'))],
};

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      warningStore.showSpendingWarning(PriceServiceName.SOCIAL_SPACE, () => createSpace());
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

    message.success(t('form.success.created.chatSpace'));

    /** On new space created add new item to list */
    chatStore.items.unshift(res.data);

    /** Clear timestamp to SS */
    sessionStorage.removeItem(LsCacheKeys.CHAT);
    sessionStorage.removeItem(LsCacheKeys.CHATS);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
