<template>
  <n-form
    v-if="!loadingPage"
    ref="formRef"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <!--  Webhook Url -->
    <n-form-item path="url" :label="$t('form.label.webhookUrl')" :label-props="{ for: 'url' }">
      <n-input
        v-model:value="formData.url"
        :input-props="{ id: 'url' }"
        :placeholder="$t('form.placeholder.webhookUrl')"
      />
    </n-form-item>

    <!--  Auth type -->
    <n-form-item path="authType" :label="$t('form.label.authType')">
      <n-radio-group v-model:value="formData.authType" name="radiogroup">
        <n-space>
          <n-radio
            v-for="(type, key) in authTypes"
            :key="key"
            :value="type.value"
            :label="`${type.label}`"
          />
        </n-space>
      </n-radio-group>
    </n-form-item>

    <!-- Basic auth: user and pass -->
    <n-grid v-if="formData.authType === BucketWebhookAuthMethod.BASIC" :cols="2" :x-gap="8">
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
        />
      </n-form-item-gi>
    </n-grid>

    <!-- Token auth: bearer token -->
    <n-grid v-else-if="formData.authType === BucketWebhookAuthMethod.TOKEN" :cols="1" :x-gap="8">
      <n-form-item-gi
        :span="1"
        path="param1"
        :label="$t('form.label.bearerToken')"
        :label-props="{ for: 'param1' }"
      >
        <n-input
          v-model:value="formData.param1"
          type="textarea"
          :input-props="{ id: 'param1' }"
          :placeholder="$t('form.placeholder.bearerToken')"
        />
      </n-form-item-gi>
    </n-grid>

    <!--  Form submit -->
    <n-grid :cols="3" :x-gap="8">
      <n-form-item-gi :span="webhook ? 2 : 3">
        <input type="submit" class="hidden" :value="$t('form.save')" />
        <Btn type="primary" class="w-full mt-2" :loading="loadingForm" @click="handleSubmit">
          <template v-if="webhook">{{ $t('form.update') }}</template>
          <template v-else>{{ $t('form.save') }}</template>
        </Btn>
      </n-form-item-gi>

      <!--  Reset webhook -->
      <n-form-item-gi v-if="webhook" :span="1">
        <Btn type="secondary" class="w-full mt-2" :loading="loadingReset" @click="resetWebhook">
          {{ $t('form.reset') }}
        </Btn>
      </n-form-item-gi>
    </n-grid>
  </n-form>
  <Spinner v-else />
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const props = defineProps({
  bucketId: { type: Number, required: true },
});

const message = useMessage();
const $i18n = useI18n();
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
        message: $i18n.t('validation.webhookRequired'),
        trigger: 'input',
      },
    ],
    authType: [
      {
        required: true,
        message: $i18n.t('validation.webhookAuthTypeRequired'),
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
            ? $i18n.t('validation.webhookUsernameRequired')
            : $i18n.t('validation.webhookTokenRequired'),
        trigger: 'input',
      },
    ],
    param2: [
      {
        required: formData.value.authType === BucketWebhookAuthMethod.BASIC,
        message: $i18n.t('validation.webhookPasswordRequired'),
        trigger: 'input',
      },
    ],
  };
});

const authTypes = ref<Array<NSelectOption>>([
  {
    value: BucketWebhookAuthMethod.NONE,
    label: $i18n.t(`form.authTypes.${BucketWebhookAuthMethod.NONE}`),
  },
  {
    value: BucketWebhookAuthMethod.BASIC,
    label: $i18n.t(`form.authTypes.${BucketWebhookAuthMethod.BASIC}`),
  },
  {
    value: BucketWebhookAuthMethod.TOKEN,
    label: $i18n.t(`form.authTypes.${BucketWebhookAuthMethod.TOKEN}`),
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
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
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
    const res = await $api.get<WebhookResponse>(endpoints.bucketWebhook(props.bucketId));

    webhook.value = res.data;
    updateFormData(res.data);
  } catch (error) {
    webhook.value = null;
  }
  loadingPage.value = false;
}
async function createWebhook() {
  loadingForm.value = true;

  try {
    const res = await $api.post<WebhookResponse>(
      endpoints.bucketWebhook(props.bucketId),
      formData.value
    );

    webhook.value = res.data;
    updateFormData(res.data);

    message.success($i18n.t('form.success.created.webhook'));
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loadingForm.value = false;
}
async function updateWebhook() {
  loadingForm.value = true;

  try {
    const res = await $api.patch<WebhookResponse>(
      endpoints.bucketWebhook(props.bucketId, webhook.value?.id),
      formData.value
    );
    webhook.value = res.data;
    updateFormData(res.data);

    message.success($i18n.t('form.success.updated.webhook'));
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loadingForm.value = false;
}
async function resetWebhook() {
  loadingReset.value = true;
  try {
    await $api.delete<DeleteResponse>(endpoints.bucketWebhook(props.bucketId, webhook.value?.id));

    /** Reset form data */
    webhook.value = null;
    updateFormData({} as WebhookInterface);

    message.success($i18n.t('form.success.deleted.webhook'));
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
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
