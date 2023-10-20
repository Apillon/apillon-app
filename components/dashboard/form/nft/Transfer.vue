<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  NFT Mint Address -->
    <n-form-item
      path="address"
      :label="$t('form.label.nftTransferAddress')"
      :label-props="{ for: 'address' }"
    >
      <n-input
        v-model:value="formData.address"
        :input-props="{ id: 'address' }"
        :placeholder="$t('form.placeholder.nftTransferAddress')"
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('nft.collection.transfer')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('nft.collection.transfer') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
const props = defineProps({
  collectionUuid: { type: String, required: true },
  chainId: { type: Number, required: true },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const warningStore = useWarningStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormNftTransfer>({
  address: '',
});

const rules: NFormRules = {
  address: [
    {
      required: true,
      message: $i18n.t('validation.nftTransferAddressRequired'),
    },
  ],
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
      const priceServiceName = generatePriceServiceName(
        ServiceTypeName.NFT,
        props.chainId,
        PriceServiceAction.TRANSFER_COLLECTION
      );
      warningStore.showSpendingWarning(priceServiceName, () => transfer());
    }
  });
}

async function transfer() {
  loading.value = true;

  try {
    const bodyData = {
      ...formData.value,
      collection_uuid: props.collectionUuid,
    };
    const res = await $api.post<any>(
      endpoints.collectionTransferOwnership(props.collectionUuid),
      bodyData
    );

    message.success($i18n.t('form.success.nftTransfer'));

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
