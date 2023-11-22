<template>
  <Spinner v-if="websiteUuid && !website" />
  <div v-else>
    <Notification v-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <template v-else>
      <!-- Info text -->
      <p v-if="!!websiteUuid && $i18n.te('hosting.website.infoNew')" class="text-body mb-8">
        {{ $t('hosting.website.infoNew') }}
      </p>
      <p v-else-if="!!websiteUuid && $i18n.te('hosting.website.infoEdit')" class="text-body mb-8">
        {{ $t('hosting.website.infoEdit') }}
      </p>
    </template>

    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <!--  Website name -->
      <n-form-item path="name" :label="$t('form.label.websiteName')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.websiteName')"
          clearable
        />
      </n-form-item>

      <!--  Website description -->
      <n-form-item
        path="description"
        :label="$t('form.label.websiteDescription')"
        :label-props="{ for: 'description' }"
      >
        <n-input
          v-model:value="formData.description"
          type="textarea"
          :input-props="{ id: 'description' }"
          :placeholder="$t('form.placeholder.websiteDescription')"
          clearable
        />
      </n-form-item>

      <!--  Form submit -->
      <n-form-item :show-feedback="false">
        <input type="submit" class="hidden" :value="$t('hosting.website.create')" />
        <Btn
          type="primary"
          class="w-full mt-2"
          :loading="loading"
          :disabled="isFormDisabled"
          @click="handleSubmit"
        >
          <template v-if="website">
            {{ $t('hosting.website.update') }}
          </template>
          <template v-else>
            {{ $t('hosting.website.create') }}
          </template>
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
type FormWebsite = {
  name: string;
  description: string;
};

const props = defineProps({
  websiteUuid: { type: String, default: null },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const websiteStore = useWebsiteStore();
const warningStore = useWarningStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const website = ref<WebsiteInterface | null>(null);

const formData = ref<FormWebsite>({
  name: website.value?.name || '',
  description: website.value?.description || '',
});

const rules: NFormRules = {
  name: [ruleRequired($i18n.t('validation.websiteNameRequired'))],
  description: [ruleDescription($i18n.t('validation.descriptionTooLong'))],
};

onMounted(async () => {
  if (props.websiteUuid) {
    website.value = await websiteStore.getWebsite(props.websiteUuid);
    formData.value.name = website.value.name;
    formData.value.description = website.value.description || '';
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
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (props.websiteUuid) {
      await updateWebsite();
    } else {
      warningStore.showSpendingWarning(PriceServiceName.HOSTING_WEBSITE, () => createWebsite());
    }
  });
}

async function createWebsite() {
  loading.value = true;

  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  try {
    const bodyData = {
      ...formData.value,
      project_uuid: dataStore.projectUuid,
    };
    const res = await $api.post<WebsiteResponse>(endpoints.website, bodyData);

    message.success($i18n.t('form.success.created.website'));

    /** On new website created add new website to list */
    websiteStore.items.push(res.data as WebsiteBaseInterface);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');

    /** Redirect to new web page */
    router.push(`/dashboard/service/hosting/${res.data.website_uuid}`);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateWebsite() {
  loading.value = true;

  try {
    const res = await $api.patch<WebsiteResponse>(
      endpoints.websites(props.websiteUuid),
      formData.value
    );

    message.success($i18n.t('form.success.updated.website'));

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
