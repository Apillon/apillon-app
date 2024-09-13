<template>
  <div>
    <Notification v-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>

    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="isFormDisabled"
      autocomplete="off"
      @submit.prevent="handleSubmit"
    >
      <!--  EmbeddedWallet name -->
      <n-form-item
        path="name"
        :label="$t('form.label.embeddedWallet.name')"
        :label-props="{ for: 'name' }"
      >
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.embeddedWallet.name')"
          clearable
        />
      </n-form-item>

      <!--  EmbeddedWallet description -->
      <n-form-item
        path="description"
        :label="$t('form.label.embeddedWallet.description')"
        :label-props="{ for: 'description' }"
      >
        <n-input
          v-model:value="formData.description"
          type="textarea"
          :input-props="{ id: 'description' }"
          :placeholder="$t('form.placeholder.embeddedWallet.description')"
          clearable
        />
      </n-form-item>

      <!--  Form submit -->
      <n-form-item :show-feedback="false" :show-label="false">
        <input type="submit" class="hidden" :value="$t('form.continue')" />
        <Btn
          type="primary"
          class="w-full mt-2"
          :loading="loading"
          :disabled="isFormDisabled"
          @click="handleSubmit"
        >
          {{ $t('form.continue') }}
        </Btn>
      </n-form-item>
    </n-form>

    <!-- Modal - API key details -->
    <n-modal
      v-model:show="showModalWalletDetails"
      :mask-closable="false"
      :close-on-esc="false"
      :closable="false"
      preset="dialog"
      :title="$t('dashboard.apiKey.details')"
      :positive-text="$t('dashboard.apiKey.secretSaved')"
      @positive-click="showModalWalletDetails = false"
    >
      <ApiKeyDetails v-bind="createdWallet" />
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
type FormEmbeddedWallet = {
  name: string | null;
  description?: string | null;
};
const emit = defineEmits(['submitSuccess', 'createSuccess']);

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const warningStore = useWarningStore();
const settingsStore = useSettingsStore();

const loading = ref<boolean>(false);
const showModalWalletDetails = ref<boolean>(false);
const createdWallet = ref<ApiKeyCreatedInterface>();

const formRef = ref<NFormInst | null>(null);
const formData = ref<FormEmbeddedWallet>({
  name: null,
  description: null,
});

const rules: NFormRules = {
  name: ruleRequired(t('validation.embeddedWallet.nameRequired')),
  description: ruleDescription(t('validation.descriptionTooLong')),
};

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

onMounted(async () => {
  await dataStore.getServicesByType(ServiceType.WALLET);
  if (!dataStore.hasServicesByType(ServiceType.WALLET)) {
    await createServiceWallet();
  }
});

async function createServiceWallet() {
  const bodyData = {
    project_uuid: dataStore.project.selected,
    serviceType_id: ServiceType.WALLET,
    name: 'Service Embedded Wallet',
    active: 1,
  };

  try {
    await $api.post<ServiceResponse>(endpoints.services(), bodyData);

    dataStore.services = await dataStore.fetchServices();
  } catch (error) {
    console.warn(error);
  }
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
      warningStore.showSpendingWarning(PriceServiceName.OASIS_SIGNATURE, () =>
        createEmbeddedWallet()
      );
    }
  });
}

async function createEmbeddedWallet() {
  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
    if (!dataStore.projectUuid) return;
  }

  const serviceWallet = await dataStore.getServiceByType(ServiceType.WALLET);
  if (!serviceWallet) return;

  loading.value = true;
  try {
    const project_uuid = dataStore.projectUuid;
    const service_uuid = serviceWallet?.service_uuid;

    const bodyData = {
      project_uuid: dataStore.projectUuid,
      name: formData.value.name,
      testNetwork: false,
      roles: [
        { project_uuid, service_uuid, role_id: ApiKeyRole.READ },
        { project_uuid, service_uuid, role_id: ApiKeyRole.WRITE },
        { project_uuid, service_uuid, role_id: ApiKeyRole.EXECUTE },
      ],
    };
    const res = await $api.post<ApiKeyCreatedResponse>(endpoints.apiKey(), bodyData);
    createdWallet.value = res.data;
    showModalWalletDetails.value = true;

    settingsStore.fetchEmbeddedWallets();

    message.success(t('form.success.created.embeddedWallet'));

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
