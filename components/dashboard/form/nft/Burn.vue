<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <p class="mb-8">{{ $t('nft.collection.burn.info') }}</p>

    <!--  NFT Mint Quantity -->
    <n-form-item path="tokenId" :label="$t('form.label.nftBurnTokenId')">
      <n-input-number
        v-model:value="formData.tokenId"
        :min="1"
        :step="1"
        :placeholder="$t('form.placeholder.nftBurnTokenId')"
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('nft.collection.burn.title')" />
      <Btn type="error" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('nft.collection.revoke') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormNftBurn = {
  collectionUuid: string;
  tokenId: number | null;
};

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
const formData = ref<FormNftBurn>({
  collectionUuid: props.collectionUuid,
  tokenId: null,
});

const rules: NFormRules = {
  tokenId: [
    {
      required: true,
      message: $i18n.t('validation.nftBurnTokenIdRequired'),
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
        PriceServiceAction.BURN
      );
      warningStore.showSpendingWarning(priceServiceName, () => burn());
    }
  });
}

async function burn() {
  loading.value = true;

  try {
    await $api.post(endpoints.collectionBurn(props.collectionUuid), formData.value);

    message.success($i18n.t('form.success.nftBurned'));

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
