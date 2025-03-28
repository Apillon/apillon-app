<template>
  <div>
    <!-- Spinner while loading -->
    <Spinner v-if="websiteUuid && !website" />

    <div v-else>
      <!-- Permissions Error Notification -->
      <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
        {{ $t('dashboard.permissions.insufficient') }}
      </Notification>

      <n-form
        ref="formRef"
        :model="websiteStore.form"
        :rules="rules"
        :disabled="isFormDisabled"
        @submit.prevent="handleSubmit"
      >
        <!-- Existing form items for basic website -->
        <n-form-item path="name" :label="$t('form.label.websiteName')" :label-props="{ for: 'name' }">
          <n-input
            v-model:value="websiteStore.form.name"
            :input-props="{ id: 'name' }"
            :placeholder="$t('form.placeholder.websiteName')"
            clearable
          />
        </n-form-item>

        <n-form-item
          path="description"
          :label="$t('form.label.websiteDescription')"
          :label-props="{ for: 'description' }"
        >
          <n-input
            v-model:value="websiteStore.form.description"
            type="textarea"
            :input-props="{ id: 'description' }"
            :placeholder="$t('form.placeholder.websiteDescription')"
            clearable
          />
        </n-form-item>

        <!-- Submit Button -->
        <n-form-item :show-feedback="false">
          <Btn type="primary" class="mt-2 w-full" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
            {{ website ? $t('hosting.website.update') : $t('hosting.website.create') }}
          </Btn>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const props = defineProps({
  websiteUuid: { type: String, default: null },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const websiteStore = useWebsiteStore();
const storageStore = useStorageStore();
const warningStore = useWarningStore();
const settingsStore = useSettingsStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const githubFormRef = ref<NFormInst | null>(null);
const website = ref<WebsiteInterface | null>(null);
const selectedWebsiteType = ref<WebsiteType>(null);
const apiKeyOptions = ref<SelectOption[]>([]);
const repoOptions = ref<SelectOption[]>([]);

const rules: NFormRules = {
  name: [ruleRequired(t('validation.websiteNameRequired'))],
  description: [ruleDescription(t('validation.descriptionTooLong'))],
};

onMounted(async () => {
  if (props.websiteUuid) {
    website.value = await websiteStore.getWebsite(props.websiteUuid);
    websiteStore.form.name = website.value.name;
    websiteStore.form.description = website.value.description || '';
  }
});

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      console.log(errors);
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (props.websiteUuid) {
      await updateWebsite();
    } else {
      warningStore.showSpendingWarning(PriceServiceName.HOSTING_WEBSITE, () => createWebsite());
    }
  });
}

async function createWebsite() {
  if (!dataStore.projectUuid) return;

  loading.value = true;
  try {
    const bodyData = {
      name: websiteStore.form.name,
      description: websiteStore.form.description,
      project_uuid: dataStore.projectUuid,
    };

    const res = await $api.post<WebsiteResponse>(endpoints.website, bodyData);

    message.success(t('form.success.created.website'));

    /** On new website created add new website to list */
    websiteStore.items.push(res.data as WebsiteBaseInterface);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateWebsite() {
  loading.value = true;

  try {
    const res = await $api.patch<WebsiteResponse>(endpoints.websites(props.websiteUuid), websiteStore.form);

    message.success(t('form.success.updated.website'));

    /** On website updated refresh website data */
    websiteStore.items.forEach((item: WebsiteBaseInterface) => {
      if (item.website_uuid === props.websiteUuid) {
        item.name = res.data.name;
        item.description = res.data.description;
      }
    });
    if (websiteStore.active.website_uuid === props.websiteUuid) {
      websiteStore.active.name = res.data.name;
      websiteStore.active.description = res.data.description;
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
