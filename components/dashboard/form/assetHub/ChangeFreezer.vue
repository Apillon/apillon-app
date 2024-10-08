<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-form-item
      path="address"
      :label="$t('form.label.assetHub.address')"
      :label-props="{ for: 'address' }"
    >
      <n-input
        v-model:value="formData.address"
        :input-props="{ id: 'address' }"
        :placeholder="$t('form.placeholder.assetHub.address')"
        clearable
      />
    </n-form-item>

    <n-form-item :show-label="false" :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('form.continue')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.continue') }}
      </Btn>
    </n-form-item>
    <Btn type="secondary" class="w-full mt-2" @click="$emit('close')">
      {{ $t('form.cancel') }}
    </Btn>
  </n-form>
</template>

<script lang="ts" setup>
type FormAssetTransfer = {
  address: string;
};

const emit = defineEmits(['submitSuccess', 'close']);
const props = defineProps({
  assetId: { type: Number, required: true },
});

const { t } = useI18n();
const message = useMessage();
const { connectedAccount } = useAssetHub();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormAssetTransfer>({
  address: '',
});

const rules: NFormRules = {
  address: ruleRequired(t('validation.assetHub.addressRequired')),
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      changeIssuer();
    }
  });
}

async function changeIssuer() {
  if (!connectedAccount.value) {
    message.warning(t('dashboard.service.assetHub.connect'));
    return;
  }
  if (!formData.value.address) {
    message.warning('Missing data');
    return;
  }
  loading.value = true;

  const assetHubClient = await AssetHubClient.getInstance(
    assetHubNetworks.westend.rpc,
    connectedAccount.value
  );
  try {
    const hash = await assetHubClient.updateTeam(
      props.assetId,
      formData.value.address,
      connectedAccount.value.address,
      formData.value.address
    );
    console.log(hash);

    message.success(t('form.success.created.asset'));

    /** Emit events */
    emit('submitSuccess');
  } catch (error: any) {
    if (error?.message) {
      message.error(error?.message);
    } else {
      message.error(userFriendlyMsg(error));
    }
  } finally {
    assetHubClient.destroyInstance();
  }
  loading.value = false;
}
</script>
