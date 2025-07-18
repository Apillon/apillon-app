<template>
  <n-form v-bind="$attrs" ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-form-item path="address" :label="$t('form.label.assetHub.address')" :label-props="{ for: 'address' }">
      <n-input
        v-model:value="formData.address"
        :input-props="{ id: 'address' }"
        :precision="assetHubStore.active.decimals"
        :placeholder="$t('form.placeholder.assetHub.address')"
        clearable
      />
    </n-form-item>

    <n-form-item
      class="relative"
      path="amount"
      :label="$t('form.label.assetHub.amount')"
      :label-props="{ for: 'amount' }"
    >
      <n-input
        v-model:value="formData.amount"
        :input-props="{ id: 'amount' }"
        :placeholder="$t('form.placeholder.assetHub.amount')"
        clearable
      />
    </n-form-item>

    <n-form-item :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('form.sign')" />
      <Btn type="primary" class="mt-2 w-full" :loading="loading" @click="handleSubmit">
        {{ $t('form.sign') }}
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
import { nToBigInt } from '@polkadot/util';

type FormAssetTransfer = {
  address: string | null;
  amount: number | null;
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
  address: null,
  amount: null,
});

const rules: NFormRules = {
  amount: ruleRequired(t('validation.assetHub.amountRequired')),
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (!errors) {
      mintTokens();
    }
  });
}

async function mintTokens() {
  if (!assetHubStore.account) {
    message.warning(t('assetHub.connect'));
    return;
  }
  if (!formData.value.address || !formData.value.amount) {
    message.warning('Missing data');
    return;
  }
  loading.value = true;

  assetHubClient.value = await assetHubStore.initClient();
  if (!assetHubClient.value) return;

  try {
    txHash.value = await assetHubClient.value.mint(
      props.assetId,
      formData.value.address,
      nToBigInt(Number(formData.value.amount) * Math.pow(10, Number(assetHubStore.active.decimals)))
    );
    if (txHash.value) {
      message.success(t('form.success.assetMinted'));

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
