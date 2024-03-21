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

    <!--  Chat Uuid -->
    <n-form-item path="chat_uuid" :label="hubInfoLabel()" :label-props="{ for: 'chat_uuid' }">
      <select-options
        v-model:value="formData.space_uuid"
        :options="chats"
        :placeholder="$t('general.pleaseSelect')"
        filterable
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-feedback="false" :show-label="false">
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

  <!-- Modal - Create new space -->
  <modal v-model:show="modalNewHubVisible" :title="$t('social.chat.new')">
    <FormSocialChat @submit-success="modalNewHubVisible = false" @create-success="onHubCreated" />
  </modal>
</template>

<script lang="ts" setup>
type FormSpace = {
  title: string;
  body: string | null;
  image: string | null;
  tags: string | null;
  space_uuid: string | null;
  project_uuid: string;
};

const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const { t } = useI18n();
const message = useMessage();
const chatStore = useChatStore();
const dataStore = useDataStore();
const postStore = usePostStore();
const paymentStore = usePaymentStore();
const warningStore = useWarningStore();

const NEW_SPACE_KEY = 'new-space';
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const modalNewHubVisible = ref<boolean>(false);

const formData = ref<FormSpace>({
  title: '',
  body: '',
  image: '',
  tags: '',
  space_uuid: null,
  project_uuid: dataStore.projectUuid,
});

const rules: NFormRules = {
  title: [ruleRequired(t('validation.postTitleRequired'))],
  body: [
    ruleRequired(t('validation.postBodyRequired')),
    ruleDescription(t('validation.descriptionTooLong')),
  ],
};

const chats = computed(() => {
  const chats = chatStore.items.map(item => {
    return {
      label: item.name,
      value: item.space_uuid,
    };
  });
  return [
    ...chats,
    {
      key: NEW_SPACE_KEY,
      label: t('social.chat.create'),
      value: NEW_SPACE_KEY,
      props: {
        class: 'dropdown-new-project',
        onClick: () => {
          modalNewHubVisible.value = true;
        },
      },
      render: renderOption,
    },
  ];
});

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser || chatStore.active.status < SocialStatus.ACTIVE;
});

onMounted(() => {
  paymentStore.getPriceList();
  chatStore.getChats();
});

function hubInfoLabel() {
  const tooltipKey =
    chatStore.items.length === 0 ? 'form.label.chatInfoEmpty' : 'form.label.chatInfo';
  return [
    h('span', { class: 'mr-1' }, t('form.label.chat')),
    h('span', {}, '('),
    h(
      resolveComponent('NuxtLink'),
      {
        class: 'text-yellow hover:underline',
        to: { name: 'dashboard-service-social-hub' },
        target: '_blank',
      },
      t('social.post.manageHubs')
    ),
    h('span', {}, ')'),
    h(resolveComponent('IconInfo'), { size: 'sm', tooltip: t(tooltipKey) }, ''),
  ];
}

/**
 * Render functions
 */
function renderOption(info: RenderOptionInfo) {
  if (info.option.key === NEW_SPACE_KEY) {
    return h(
      resolveComponent('Btn'),
      {
        class: 'locked mt-2',
        type: 'info',
        size: 'large',
        onClick: () => {
          modalNewHubVisible.value = true;
        },
      },
      () => info.option.label as string
    );
  }
  return info.node;
}

function onHubCreated(space: ChatInterface) {
  formData.value.space_uuid = space.space_uuid;
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
      warningStore.showSpendingWarning(PriceServiceName.SOCIAL_POST, () => createPost());
    }
  });
}

async function createPost() {
  loading.value = true;

  try {
    const res = await $api.post<PostResponse>(endpoints.posts(), formData.value);

    message.success(t('form.success.created.chatPost'));

    /** On new space created add new item to list */
    postStore.items.unshift(res.data);

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
