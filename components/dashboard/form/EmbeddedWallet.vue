<template>
  <Spinner v-if="integrationUuid && !embeddedWallet" />
  <div v-else>
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
      <!--  EmbeddedWallet title -->
      <n-form-item
        path="title"
        :label="$t('form.label.embeddedWallet.title')"
        :label-props="{ for: 'title' }"
      >
        <n-input
          v-model:value="formData.title"
          :input-props="{ id: 'title' }"
          :placeholder="$t('form.placeholder.embeddedWallet.title')"
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
          <span v-if="integrationUuid"> {{ $t('general.edit') }} </span>
          <span v-else>{{ $t('form.continue') }}</span>
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
type FormEmbeddedWallet = {
  title: string | null;
  description?: string | null;
};
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);
const props = defineProps({
  integrationUuid: { type: String, default: '' },
});

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const warningStore = useWarningStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const loading = ref<boolean>(false);
const embeddedWallet = ref<EmbeddedWalletInterface | null>(null);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormEmbeddedWallet>({
  title: null,
  description: null,
});

const rules: NFormRules = {
  title: ruleRequired(t('validation.embeddedWallet.titleRequired')),
  description: ruleDescription(t('validation.descriptionTooLong')),
};

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

onMounted(async () => {
  if (props.integrationUuid) {
    embeddedWallet.value = await embeddedWalletStore.getEmbeddedWallet(props.integrationUuid);

    if (embeddedWallet.value) {
      formData.value.title = embeddedWallet.value.title;
      formData.value.description = embeddedWallet.value.description;
    }
  }
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (props.integrationUuid) {
      updateEmbeddedWallet();
    } else {
      warningStore.showSpendingWarning(PriceServiceName.OASIS_SIGNATURE, () =>
        createEmbeddedWallet()
      );
    }
  });
}

async function createEmbeddedWallet() {
  const project_uuid = await dataStore.getProjectUuid();
  if (!project_uuid) return;

  loading.value = true;
  try {
    const bodyData = {
      ...formData.value,
      project_uuid,
    };
    const res = await $api.post<EmbeddedWalletResponse>(
      endpoints.embeddedWalletIntegration,
      bodyData
    );
    embeddedWalletStore.items.push(res.data);

    message.success(t('form.success.created.embeddedWallet'));

    sessionStorage.removeItem(LsCacheKeys.EMBEDDED_WALLET);
    sessionStorage.removeItem(LsCacheKeys.EMBEDDED_WALLETS);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateEmbeddedWallet() {
  loading.value = true;

  try {
    const res = await $api.patch<EmbeddedWalletResponse>(
      endpoints.embeddedWallets(props.integrationUuid),
      formData.value
    );
    embeddedWalletStore.items.forEach(item => {
      if (item.integration_uuid === res.data.integration_uuid) {
        Object.assign(item, res.data);
      }
    });

    message.success(t('form.success.updated.embeddedWallet'));

    sessionStorage.removeItem(LsCacheKeys.EMBEDDED_WALLET);
    sessionStorage.removeItem(LsCacheKeys.EMBEDDED_WALLETS);

    /** Emit events */
    emit('submitSuccess');
    emit('updateSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
