<template>
  <Spinner v-if="webpageId > 0 && !webpage" />
  <div v-else>
    <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
      <!--  Webpage domain -->
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
      <n-form-item :show-label="false">
        <input type="submit" class="hidden" :value="$t('hosting.domain.add')" />
        <Btn
          type="primary"
          class="w-full mt-2"
          :loading="loading"
          :disabled="!domain && formData.domain?.length === 0"
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
import { useMessage } from 'naive-ui';

const props = defineProps({
  webpageId: { type: Number, default: 0 },
  domain: { type: String, default: '' },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const webpage = ref<WebpageInterface | null>(null);

onMounted(async () => {
  if (props.webpageId) {
    webpage.value = await dataStore.getWebpage(props.webpageId);
    formData.value.domain = webpage.value.domain;
  }
});

const formData = ref<FormWebpageDomain>({
  domain: props.domain || null,
});

const rules: NFormRules = {
  domain: [
    {
      type: 'url',
      validator: validateDomain,
      message: $i18n.t('validation.webpageDomainUrl'),
    },
  ],
};

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
      await updateWebpageDomain();
    } else {
      await createWebpageDomain();
    }
  });
}

async function createWebpageDomain() {
  loading.value = true;

  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  try {
    const res = await $api.patch<WebpageResponse>(
      endpoints.webpages(props.webpageId),
      formData.value
    );

    message.success($i18n.t('form.success.created.domain'));

    updateWebpageDomainValue(res.data.domain);

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

async function updateWebpageDomain() {
  loading.value = true;

  try {
    const res = await $api.patch<WebpageResponse>(
      endpoints.webpages(props.webpageId),
      formData.value
    );

    updateWebpageDomainValue(res.data.domain);

    message.success($i18n.t('form.success.updated.domain'));

    /** Emit events */
    emit('submitSuccess');
    emit('updateSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

function updateWebpageDomainValue(domain) {
  /** On webpage updated refresh webpage data */
  dataStore.webpage.items.forEach((item: WebpageInterface) => {
    if (item.id === props.webpageId) {
      item.domain = domain;
    }
  });
  if (dataStore.webpage.active.id === props.webpageId) {
    dataStore.webpage.active.domain = domain;
  }
}
</script>