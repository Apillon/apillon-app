<template>
  <div>
    <p v-if="webpage && $i18n.te('hosting.webpage.infoNew')" class="text-body mb-8">
      {{ $t('hosting.webpage.infoNew') }}
    </p>
    <p v-else-if="!webpage && $i18n.te('hosting.webpage.infoEdit')" class="text-body mb-8">
      {{ $t('hosting.webpage.infoEdit') }}
    </p>

    <!-- Notification - show if qouta has been reached -->
    <Notification v-if="isQuotaReached" type="warning" class="w-full mb-8">
      {{ $t('hosting.webpage.quotaReached') }}
    </Notification>

    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <!--  Service name -->
      <n-form-item path="name" :label="$t('form.label.webpageName')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.webpageName')"
          clearable
        />
      </n-form-item>

      <!--  Bucket description -->
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

      <!--  Service submit -->
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

const message = useMessage();
const $i18n = useI18n();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const webpage: WebpageInterface | null =
  props.webpageId > 0 ? await dataStore.getWebpage(props.webpageId) : null;

const formData = ref<FormWebpage>({
  name: webpage?.name || '',
  description: webpage?.description || '',
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
};

const isQuotaReached = computed<boolean>(() => {
  return !webpage && dataStore.webpage.quotaReached === true;
});
const isFormDisabled = computed<boolean>(() => {
  return isQuotaReached.value || settingsStore.isProjectUser();
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else if (webpage) {
      await updateBucket();
    } else {
      await createBucket();
    }
  });
}

async function createBucket() {
  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  loading.value = true;

  try {
    const bodyData = {
      ...formData.value,
      project_uuid: dataStore.currentProject?.project_uuid,
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
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateBucket() {
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
      }
    });
    if (dataStore.webpage.active.id === props.webpageId) {
      dataStore.webpage.active.name = res.data.name;
      dataStore.webpage.active.description = res.data.description;
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
