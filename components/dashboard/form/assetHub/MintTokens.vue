<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
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
type FormAssetTransfer = {
  amount: number | null;
};

// const props = defineProps({});
const emit = defineEmits(['submitSuccess', 'close']);

const { t } = useI18n();
const message = useMessage();
const assetHubStore = useAssetHubStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormAssetTransfer>({
  amount: null,
});

const rules: NFormRules = {
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
      mintToWallet();
    }
  });
}

async function mintTokens() {
  loading.value = true;

  try {
    const res = await $api.post<any>('/mint', formData.value);

    message.success(t('form.success.assetTransferred'));

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

const mintToWallet = async () => {
  // const hash = await api.tx.assets
  //   .mint(791, assetHubStore.account.address, 100)
  //   .signAndSend(assetHubStore.account.address, {
  //     signer: assetHubStore.account.signer,
  //     nonce: -1,
  //   });
  // console.log('Transaction sent with hash', hash.toHex());
};
</script>
