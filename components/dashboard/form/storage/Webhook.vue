<template>
  <n-form
    v-if="!loadingPage"
    ref="formRef"
    :model="formData"
    :rules="rules"
    :disabled="authStore.isAdmin()"
    @submit.prevent="handleSubmit"
  >
    <!--  Webhook Url -->
    <n-form-item path="url" :label="$t('form.label.webhookUrl')" :label-props="{ for: 'url' }">
      <n-input
        v-model:value="formData.url"
        :input-props="{ id: 'url' }"
        :placeholder="$t('form.placeholder.webhookUrl')"
        clearable
      />
    </n-form-item>

    <!--  Auth type -->
    <n-form-item path="authType" :label="$t('form.label.authType')">
      <n-radio-group v-model:value="formData.authType" name="radiogroup">
        <n-space>
          <n-radio v-for="(type, key) in authTypes" :key="key" :value="type.value" :label="`${type.label}`" />
        </n-space>
      </n-radio-group>
    </n-form-item>

    <!-- Basic auth: user and pass -->
    <n-grid v-if="formData.authType === BucketWebhookAuthMethod.BASIC" :cols="2" :x-gap="32">
      <n-form-item-gi
        :span="1"
        path="param1"
        :label="$t('form.label.webhookUsername')"
        :label-props="{ for: 'param1' }"
      >
        <n-input
          v-model:value="formData.param1"
          :input-props="{ id: 'param1' }"
          :placeholder="$t('form.placeholder.webhookUsername')"
          clearable
        />
      </n-form-item-gi>

      <n-form-item-gi
        :span="1"
        path="param2"
        :label="$t('form.label.webhookPassword')"
        :label-props="{ for: 'param2' }"
      >
        <n-input
          v-model:value="formData.param2"
          :input-props="{ id: 'param2' }"
          :placeholder="$t('form.placeholder.webhookPassword')"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <!-- Token auth: bearer token -->
    <n-grid v-else-if="formData.authType === BucketWebhookAuthMethod.TOKEN" :cols="1" :x-gap="32">
      <n-form-item-gi :span="1" path="param1" :label="$t('form.label.bearerToken')" :label-props="{ for: 'param1' }">
        <n-input
          v-model:value="formData.param1"
          type="textarea"
          :input-props="{ id: 'param1' }"
          :placeholder="$t('form.placeholder.bearerToken')"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <!--  Form submit -->
    <n-grid :cols="3" :x-gap="32">
      <n-form-item-gi :span="webhook ? 2 : 3">
        <input type="submit" class="hidden" :value="$t('form.save')" />
        <Btn
          type="primary"
          class="mt-2 w-full"
          :loading="loadingForm"
          :disabled="authStore.isAdmin()"
          @click="handleSubmit"
        >
          <template v-if="webhook">{{ $t('form.update') }}</template>
          <template v-else>{{ $t('form.save') }}</template>
        </Btn>
      </n-form-item-gi>

      <!--  Reset webhook -->
      <n-form-item-gi v-if="webhook" :span="1">
        <Btn
          type="secondary"
          class="mt-2 w-full"
          :loading="loadingReset"
          :disabled="authStore.isAdmin()"
          @click="resetWebhook"
        >
          {{ $t('form.reset') }}
        </Btn>
      </n-form-item-gi>
    </n-grid>
  </n-form>
  <Spinner v-else />
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

type FormWebhook = {
  url: string;
  authType: string;
  param1: string;
  param2?: string;
};

const props = defineProps({
  bucketUuid: { type: String, required: true },
});

const { t } = useI18n();
const message = useMessage();
const authStore = useAuthStore();

const loadingForm = ref<boolean>(false);
const loadingPage = ref<boolean>(false);
const loadingReset = ref<boolean>(false);
const disabledParamReset = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const webhook = ref<WebhookInterface | null>(null);

const formData = ref<FormWebhook>({
  url: '',
  authType: '',
  param1: '',
  param2: undefined,
});

const rules = computed<NFormRules>(() => {
  return {
    url: [
      {
        required: true,
        message: t('validation.webhookRequired'),
        trigger: 'input',
      },
    ],
    authType: [
      {
        required: true,
        message: t('validation.webhookAuthTypeRequired'),
        trigger: 'input',
      },
    ],
    param1: [
      {
        required:
          formData.value.authType === BucketWebhookAuthMethod.BASIC ||
          formData.value.authType === BucketWebhookAuthMethod.TOKEN,
        message:
          formData.value.authType === BucketWebhookAuthMethod.BASIC
            ? t('validation.webhookUsernameRequired')
            : t('validation.webhookTokenRequired'),
        trigger: 'input',
      },
    ],
    param2: [
      {
        required: formData.value.authType === BucketWebhookAuthMethod.BASIC,
        message: t('validation.webhookPasswordRequired'),
        trigger: 'input',
      },
    ],
  };
});

const authTypes = ref<Array<SelectOption>>([
  {
    value: BucketWebhookAuthMethod.NONE,
    label: t(`form.authTypes.${BucketWebhookAuthMethod.NONE}`),
  },
  {
    value: BucketWebhookAuthMethod.BASIC,
    label: t(`form.authTypes.${BucketWebhookAuthMethod.BASIC}`),
  },
  {
    value: BucketWebhookAuthMethod.TOKEN,
    label: t(`form.authTypes.${BucketWebhookAuthMethod.TOKEN}`),
  },
]);

onMounted(async () => {
  await getWebhook();
});

/** Watch Auth type and reset params */
watch(
  () => formData.value.authType,
  _ => {
    if (!disabledParamReset.value) {
      formData.value.param1 = '';
      formData.value.param2 = '';
    }
  }
);

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (webhook.value) {
      await updateWebhook();
    } else {
      await createWebhook();
    }
  });
}

/** CRUD operations */
async function getWebhook() {
  loadingPage.value = true;
  try {
    const res = await $api.get<WebhookResponse>(endpoints.bucketWebhook(props.bucketUuid));

    webhook.value = res.data;
    updateFormData(res.data);
  } catch (e: ApiError | unknown) {
    console.error(e);
    webhook.value = null;
  }
  loadingPage.value = false;
}
async function createWebhook() {
  loadingForm.value = true;

  try {
    const res = await $api.post<WebhookResponse>(endpoints.bucketWebhook(props.bucketUuid), formData.value);

    webhook.value = res.data;
    updateFormData(res.data);

    message.success(t('form.success.created.webhook'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loadingForm.value = false;
}
async function updateWebhook() {
  loadingForm.value = true;

  try {
    const res = await $api.patch<WebhookResponse>(
      endpoints.bucketWebhook(props.bucketUuid, webhook.value?.id),
      formData.value
    );
    webhook.value = res.data;
    updateFormData(res.data);

    message.success(t('form.success.updated.webhook'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loadingForm.value = false;
}
async function resetWebhook() {
  loadingReset.value = true;
  try {
    await $api.delete<DeleteResponse>(endpoints.bucketWebhook(props.bucketUuid, webhook.value?.id));

    /** Reset form data */
    webhook.value = null;
    updateFormData({} as WebhookInterface);

    message.success(t('form.success.deleted.webhook'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loadingReset.value = false;
}

function updateFormData(webhook: WebhookInterface) {
  disabledParamReset.value = true;

  formData.value.url = webhook.url;
  formData.value.param1 = webhook.param1;
  formData.value.param2 = webhook.param2;

  formData.value.authType =
    webhook.authMethod ||
    (webhook.param2
      ? BucketWebhookAuthMethod.BASIC
      : webhook.param1
        ? BucketWebhookAuthMethod.TOKEN
        : BucketWebhookAuthMethod.NONE);

  setTimeout(() => (disabledParamReset.value = false), 1);
}
</script>
