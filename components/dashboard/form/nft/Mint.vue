<template>
  <Notification v-if="isTransferred" type="error" class="w-full mb-8">
    {{ $t('error.NFT_CONTRACT_OWNER_ERROR') }}
  </Notification>
  <n-form
    v-bind="$attrs"
    ref="formRef"
    :model="formData"
    :rules="rules"
    :disabled="isFormDisabled"
    @submit.prevent="handleSubmit"
  >
    <!--  NFT Mint Address -->
    <n-form-item path="receivingAddress" :label="addressLabel">
      <n-input
        v-model:value="formData.receivingAddress"
        :input-props="{ id: 'receivingAddress' }"
        :placeholder="$t('form.placeholder.nftMintAddress')"
        clearable
      />
    </n-form-item>

    <!--  NFT Mint Quantity -->
    <n-form-item path="quantity" :label="$t('form.label.nft.mintQuantity')">
      <n-input-number
        v-model:value="formData.quantity"
        :min="1"
        :placeholder="$t('form.placeholder.nftMintQuantity')"
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('nft.collection.mint')" />
      <Btn
        type="primary"
        class="w-full mt-2"
        :loading="loading"
        :disabled="isFormDisabled"
        @click="handleSubmit"
      >
        {{ $t('nft.collection.mint') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormItemRule } from 'naive-ui';

type FormNftMint = {
  receivingAddress: string;
  quantity: number | null;
};

const props = defineProps({
  collectionUuid: { type: String, required: true },
  chainId: { type: Number, required: true },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();
const { addressLabel } = useCollection();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormNftMint>({
  receivingAddress: '',
  quantity: null,
});

const rules: NFormRules = {
  receivingAddress: [
    {
      required: true,
      message: $i18n.t('validation.nftMintAddressRequired'),
    },
  ],
  quantity: [
    {
      required: true,
      message: $i18n.t('validation.nftMintQuantityRequired'),
    },
    {
      validator: validateQuantity,
      message: $i18n.t('validation.nftMintQuantity'),
    },
  ],
};

const isSubstrate = computed(
  () =>
    collectionStore.active.chainType === ChainType.SUBSTRATE ||
    collectionStore.active.chain === SubstrateChain.UNIQUE
);

function validateQuantity(_: FormItemRule, value: number): boolean {
  return (
    !collectionStore.active.drop ||
    collectionStore.active.chainType === ChainType.SUBSTRATE ||
    (value > 0 && value <= collectionStore.active?.dropReserve)
  );
}

const isTransferred = computed<boolean>(() => {
  return collectionStore.active.collectionStatus === CollectionStatus.TRANSFERRED;
});
const isFormDisabled = computed<boolean>(() => {
  return isTransferred.value;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      const priceServiceName = generatePriceServiceName(
        ServiceTypeName.NFT,
        props.chainId,
        PriceServiceAction.MINT
      );
      warningStore.showSpendingWarning(priceServiceName, () => mint());
    }
  });
}

async function mint() {
  loading.value = true;

  try {
    const bodyData = {
      ...formData.value,
      collection_uuid: props.collectionUuid,
    };
    await $api.post<any>(endpoints.collectionMint(props.collectionUuid), bodyData);

    message.success($i18n.t('form.success.nftMint'));

    /** Invalidate local cache */
    sessionStorage.removeItem(LsCacheKeys.COLLECTIONS);

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
