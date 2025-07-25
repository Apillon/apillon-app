<template>
  <n-form v-bind="$attrs" ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-form-item path="address" :label="$t('form.label.assetHub.address')" :label-props="{ for: 'address' }">
      <n-input
        v-model:value="formData.address"
        :input-props="{ id: 'address' }"
        :placeholder="$t('form.placeholder.assetHub.address')"
        clearable
      />
    </n-form-item>

    <n-form-item :show-label="false" :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('form.continue')" />
      <Btn type="primary" class="mt-2 w-full" :loading="loading" @click="handleSubmit">
        {{ $t('form.continue') }}
      </Btn>
    </n-form-item>
    <Btn type="secondary" class="mt-2 w-full" @click="$emit('close')">
      {{ $t('form.cancel') }}
    </Btn>
  </n-form>

  <ModalTransaction v-if="txHash" :transaction-hash="txHash" @close="$emit('close')" />
  <AssetHubLoader v-if="loading && assetHubClient?.txApproved" class="z-3000" />
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
const assetHubStore = useAssetHubStore();
const { assetHubClient } = useAssetHub();

const loading = ref(false);
const txHash = ref<string | undefined>();
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
    if (!errors) {
      changeIssuer();
    }
  });
}

async function changeIssuer() {
  if (!assetHubStore.account) {
    message.warning(t('assetHub.connect'));
    return;
  }
  loading.value = true;

  assetHubClient.value = await assetHubStore.initClient();
  if (!assetHubClient.value) return;

  try {
    txHash.value = await assetHubClient.value.updateTeam(
      props.assetId,
      formData.value.address,
      assetHubStore.account.address,
      assetHubStore.active.freezer
    );
    if (txHash.value) {
      assetHubStore.active.issuer = formData.value.address;

      message.success(t('form.success.updated.assetIssuer'));

      /** Emit events */
      emit('submitSuccess');
    } else {
      message.warning(t('error.general'));
      emit('close');
    }
  } catch (error: any) {
    if (error?.message) {
      message.error(error?.message);
    } else {
      message.error(userFriendlyMsg(error));
    }
  } finally {
    assetHubClient.value.destroyInstance();
  }
  loading.value = false;
}
</script>
