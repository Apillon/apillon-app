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
        Available:
        <span class="text-body">10020 NCTR</span>
      </div>
    </n-form-item>

    <n-form-item :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('form.sign')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.sign') }}
      </Btn>
    </n-form-item>
    <Btn type="secondary" class="w-full mt-2" @click="$emit('close')">
      {{ $t('form.cancel') }}
    </Btn>
  </n-form>
</template>

<script lang="ts" setup>
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { ApiPromise, WsProvider } from '@polkadot/api';

type FormAssetTransfer = {
  address: string | null;
  amount: number | null;
};

// const props = defineProps({});
const emit = defineEmits(['submitSuccess', 'close']);

const { t } = useI18n();
const message = useMessage();

const loading = ref(false);
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
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      mintTokens();
    }
  });
}

async function mintTokens() {
  loading.value = true;

  try {
    const res = await $api.post<any>('', formData.value);

    message.success(t('form.success.assetTransferred'));

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function enableExtension() {
  await web3Enable('My Polkadot App');
  return await web3Accounts();
}

const mintToWallet = async () => {
  await cryptoWaitReady();
  const accounts = await enableExtension();
  console.log('Accounts:', accounts);

  const account = accounts[0];
  const injector = await web3FromAddress(account.address);
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://asset-hub-westend-rpc.dwellir.com'),
    throwOnConnect: true,
    noInitWarn: true,
  });
  console.log('Minting to:', account.address);
  const hash = await api.tx.assets
    .mint(791, account.address, 100)
    .signAndSend(account.address, { signer: injector.signer, nonce: -1 });
  console.log('Transaction sent with hash', hash.toHex());
};
</script>
