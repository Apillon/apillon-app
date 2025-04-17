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

    <n-form-item
      class="relative"
      path="amount"
      :label="$t('form.label.assetHub.amount')"
      :label-props="{ for: 'address' }"
    >
      <n-input
        v-model:value="formData.amount"
        :input-props="{ id: 'amount' }"
        :placeholder="$t('form.placeholder.assetHub.amount')"
        clearable
      />
      <div class="absolute right-0 top-full mt-1 text-sm">
        {{ $t('general.available') }}:
        <span class="text-body"> {{ supply }} {{ assetHubStore.active.symbol }}</span>
      </div>
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

  <ModalTransaction v-if="txHash" :transactionHash="txHash" @close="$emit('close')" />
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
const { assetHubClient, supply } = useAssetHub();

const loading = ref(false);
const txHash = ref<string | undefined>();
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormAssetTransfer>({
  address: null,
  amount: null,
});

const rules: NFormRules = {
  address: ruleRequired(t('validation.assetHub.addressRequired')),
  amount: ruleRequired(t('validation.assetHub.amountRequired')),
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      sendTokens();
    }
  });
}

async function sendTokens() {
  if (!assetHubStore.account) {
    message.warning(t('dashboard.service.assetHub.connect'));
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
    txHash.value = await assetHubClient.value.transfer(
      props.assetId,
      formData.value.address,
      nToBigInt(Number(formData.value.amount) * Math.pow(10, Number(assetHubStore.active.decimals)))
    );
    if (txHash.value) {
      message.success(t('form.success.assetSend'));

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
