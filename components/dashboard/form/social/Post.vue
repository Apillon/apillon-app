<template>
  <n-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    :disabled="isFormDisabled"
    @submit.prevent="handleSubmit"
  >
    <!--  Chat title -->
    <n-form-item path="title" :label="$t('social.post.title')" :label-props="{ for: 'title' }">
      <n-input
        v-model:value="formData.title"
        :input-props="{ id: 'title' }"
        :placeholder="$t('form.placeholder.typeHere')"
        clearable
      />
    </n-form-item>

    <!-- Chat body -->
    <n-form-item path="body" :label="$t('social.post.body')" :label-props="{ for: 'body' }">
      <n-input
        v-model:value="formData.body"
        type="textarea"
        :input-props="{ id: 'body' }"
        :placeholder="$t('form.placeholder.typeHere')"
        clearable
      />
    </n-form-item>

    <!-- Chat tags -->
    <n-form-item path="description" :label="$t('social.post.tags')" :label-props="{ for: 'tags' }">
      <n-input
        v-model:value="formData.tags"
        :input-props="{ id: 'tags' }"
        :placeholder="$t('form.placeholder.typeHere')"
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('social.post.create')" />
      <Btn
        type="primary"
        class="w-full mt-2"
        :loading="loading"
        :disabled="isFormDisabled"
        @click="handleSubmit"
      >
        {{ $t('social.post.create') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormSpace = {
  title: string;
  body: string | null;
  image: string | null;
  tags: string | null;
};

const props = defineProps({
  spaceUuid: { type: String, required: true },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const message = useMessage();
const $i18n = useI18n();
const dataStore = useDataStore();
const postStore = usePostStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormSpace>({
  title: '',
  body: '',
  image: '',
  tags: '',
});

const rules: NFormRules = {
  title: [ruleRequired($i18n.t('validation.postTitleRequired'))],
  body: [
    ruleRequired($i18n.t('validation.postBodyRequired')),
    ruleDescription($i18n.t('validation.descriptionTooLong')),
  ],
};

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      await createPost();
    }
  });
}

async function createPost() {
  loading.value = true;

  try {
    const res = await $api.post<PostResponse>(endpoints.post(props.spaceUuid), formData.value);

    message.success($i18n.t('form.success.created.chatPost'));

    /** On new space created add new item to list */
    postStore.items.unshift(res.data);

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
