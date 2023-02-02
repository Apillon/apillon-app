<template>
  <Spinner v-if="webpageId > 0 && !webpage" />
  <div v-else>
    <!-- Notification - show if qouta has been reached -->
    <Notification v-if="isQuotaReached" type="warning" class="w-full mb-8">
      {{ $t('hosting.webpage.quotaReached') }}
    </Notification>
    <Notification v-else-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <template v-else>
      <!-- Info text -->
      <p v-if="webpageId === 0 && $i18n.te('hosting.webpage.infoNew')" class="text-body mb-8">
        {{ $t('hosting.webpage.infoNew') }}
      </p>
      <p v-else-if="webpageId > 0 && $i18n.te('hosting.webpage.infoEdit')" class="text-body mb-8">
        {{ $t('hosting.webpage.infoEdit') }}
      </p>
    </template>

    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <!--  Webpage name -->
      <n-form-item path="name" :label="$t('form.label.webpageName')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.webpageName')"
          clearable
        />
      </n-form-item>

      <!--  Webpage description -->
      <n-form-item
        path="description"
        :label="$t('form.label.webpageDescription')"
        :label-props="{ for: 'description' }"
      >
        <n-input
          v-model:value="formData.description"
          type="textarea"
          :input-props="{ id: 'description' }"
          :placeholder="$t('form.placeholder.webpageDescription')"
          clearable
        />
      </n-form-item>

      <!--  Webpage domain -->
      <n-form-item path="domain" :label="$t('form.label.domain')" :label-props="{ for: 'domain' }">
        <n-input
          v-model:value="formData.domain"
          :input-props="{ id: 'domain', type: 'url' }"
          :placeholder="$t('form.placeholder.domain')"
          clearable
        />
      </n-form-item>

      <!--  Form submit -->
      <n-form-item>
        <input type="submit" class="hidden" :value="$t('hosting.webpage.create')" />
        <Btn
          type="primary"
          class="w-full mt-2"
          :loading="loading"
          :disabled="isFormDisabled"
          @click="handleSubmit"
        >
          <template v-if="webpage">
            {{ $t('hosting.webpage.update') }}
          </template>
          <template v-else>
            {{ $t('hosting.webpage.create') }}
          </template>
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const props = defineProps({
  webpageId: { type: Number, default: 0 },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const webpage = ref<WebpageInterface | null>(null);

onMounted(async () => {
  if (props.webpageId) {
    webpage.value = await dataStore.getWebpage(props.webpageId);
    formData.value.name = webpage.value.name;
    formData.value.description = webpage.value.description;
    formData.value.domain = webpage.value.domain;
  }
});

const formData = ref<FormWebpage>({
  name: webpage.value?.name || '',
  description: webpage.value?.description || '',
  domain: webpage.value?.domain || null,
});

const rules: NFormRules = {
  name: [
    {
      required: true,
      message: $i18n.t('validation.webpageNameRequired'),
      trigger: 'input',
    },
  ],
  description: [
    {
      max: 255,
      message: $i18n.t('validation.webpageDescriptionTooLong'),
      trigger: 'input',
    },
  ],
  domain: [
    {
      type: 'url',
      validator: validateDomain,
      message: $i18n.t('validation.webpageDomainUrl'),
    },
  ],
};

const isQuotaReached = computed<boolean>(() => {
  return props.webpageId === 0 && dataStore.webpage.quotaReached === true;
});
const isFormDisabled = computed<boolean>(() => {
  return isQuotaReached.value || settingsStore.isProjectUser();
});

// Custom validations
function validateDomain(_: NFormItemRule, value: string): boolean {
  const regex = /^[a-zA-Z0-9][a-zA-Z0-9-.]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

  return !value || regex.test(value);
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (props.webpageId > 0) {
      await updateWebpage();
    } else {
      await createWebpage();
    }
  });
}

async function createWebpage() {
  loading.value = true;

  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  try {
    const bodyData = {
      ...formData.value,
      project_uuid: dataStore.projectUuid,
    };
    const res = await $api.post<WebpageResponse>(endpoints.webpage, bodyData);

    message.success($i18n.t('form.success.created.webpage'));

    /** On new webpage created add new webpage to list */
    dataStore.webpage.items.push(res.data);

    /** Reset webpage qouta limit */
    dataStore.webpage.quotaReached = undefined;

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');

    /** Redirect to new web page */
    router.push(`/dashboard/service/hosting/${res.data.id}`);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateWebpage() {
  loading.value = true;

  try {
    const res = await $api.patch<WebpageResponse>(
      endpoints.webpages(props.webpageId),
      formData.value
    );

    message.success($i18n.t('form.success.updated.webpage'));

    /** On webpage updated refresh webpage data */
    dataStore.webpage.items.forEach((item: WebpageInterface) => {
      if (item.id === props.webpageId) {
        item.name = res.data.name;
        item.description = res.data.description;
        item.domain = res.data.domain;
      }
    });
    if (dataStore.webpage.active.id === props.webpageId) {
      dataStore.webpage.active.name = res.data.name;
      dataStore.webpage.active.description = res.data.description;
      dataStore.webpage.active.domain = res.data.domain;
    }

    /** Emit events */
    emit('submitSuccess');
    emit('updateSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
