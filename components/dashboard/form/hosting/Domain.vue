<template>
  <Spinner v-if="websiteUuid && !website" />
  <div v-else>
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="authStore.isAdmin()"
      @submit.prevent="handleSubmit"
    >
      <!--  Website domain -->
      <n-form-item path="domain" :label="$t('form.label.domain')" :label-props="{ for: 'domain' }">
        <n-input
          v-model:value="formData.domain"
          :input-props="{ id: 'domain', type: 'text' }"
          :placeholder="$t('form.placeholder.domain')"
          clearable
        />
      </n-form-item>

      <!-- Instructions to configure DNS -->
      <HostingDomainConfiguration v-if="!domain" :domain="formData.domain || ''" />

      <!--  Form submit -->
      <n-form-item :show-label="false" :show-feedback="false">
        <input type="submit" class="hidden" :value="$t('hosting.domain.add')" />
        <Btn
          type="primary"
          class="w-full mt-2"
          :loading="loading"
          :disabled="(!domain && formData.domain?.length === 0) || authStore.isAdmin()"
          @click="handleSubmit"
        >
          <template v-if="domain">
            {{ $t('hosting.domain.update') }}
          </template>
          <template v-else>
            {{ $t('hosting.domain.add') }}
          </template>
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
type FormWebsiteDomain = {
  domain?: string | null;
};

const props = defineProps({
  websiteUuid: { type: String, default: null },
  domain: { type: String, default: '' },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const $i18n = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const websiteStore = useWebsiteStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const website = ref<WebsiteInterface | null>(null);

const formData = ref<FormWebsiteDomain>({
  domain: props.domain || null,
});

const rules: NFormRules = {
  domain: [
    {
      type: 'url',
      validator: validateDomain,
      message: $i18n.t('validation.websiteDomainUrl'),
    },
  ],
};

onMounted(async () => {
  if (props.websiteUuid) {
    website.value = await websiteStore.getWebsite(props.websiteUuid);
    formData.value.domain = website.value.domain;
  }
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
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else if (props.domain) {
      await updateWebsiteDomain();
    } else {
      await createWebsiteDomain();
    }
  });
}

async function createWebsiteDomain() {
  loading.value = true;

  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  try {
    const res = await $api.patch<WebsiteResponse>(
      endpoints.websites(props.websiteUuid),
      formData.value
    );

    message.success($i18n.t('form.success.created.domain'));

    updateWebsiteDomainValue(res.data.domain);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateWebsiteDomain() {
  loading.value = true;

  try {
    const res = await $api.patch<WebsiteResponse>(
      endpoints.websites(props.websiteUuid),
      formData.value
    );

    updateWebsiteDomainValue(res.data.domain);

    message.success($i18n.t('form.success.updated.domain'));

    /** Emit events */
    emit('submitSuccess');
    emit('updateSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

function updateWebsiteDomainValue(domain) {
  /** On website updated refresh website data */
  websiteStore.items.forEach((item: WebsiteBaseInterface) => {
    if (item.website_uuid === props.websiteUuid) {
      item.domain = domain;
      item.domainChangeDate = new Date().toISOString();
    }
  });
  if (websiteStore.active.bucket_uuid === props.websiteUuid) {
    websiteStore.active.domain = domain;
  }
}
</script>
