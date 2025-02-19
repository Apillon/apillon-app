<template>
  <Notification v-if="isTransferred" type="error" class="mb-8 w-full">
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
    <n-form-item v-if="collection.isAutoIncrement" path="quantity" :label="$t('form.label.nft.mintQuantity')">
      <n-input-number
        v-model:value="formData.quantity"
        :min="1"
        :max="20"
        :placeholder="$t('form.placeholder.nftMintQuantity')"
        clearable
      />
    </n-form-item>
    <n-form-item v-else path="idsToMint" :label="$t('form.label.nft.idsToMint')">
      <n-select
        v-if="collection.maxSupply"
        v-model:value="formData.idsToMint"
        :options="repeat(collection.maxSupply, 1).map((_, i) => ({ label: String(i + 1), value: i + 1 }))"
        filterable
        multiple
      />
      <n-select
        v-else
        v-model:value="formData.idsToMint"
        :placeholder="$t('form.placeholder.nft.idsToMint')"
        :show-arrow="false"
        :show="false"
        filterable
        multiple
        tag
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('nft.collection.mint')" />
      <Btn type="primary" class="mt-2 w-full" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
        {{ $t('nft.collection.mint') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { repeat } from 'seemly';
import type { FormItemRule } from 'naive-ui';
import type { PropType } from 'vue';

type FormNftMint = {
  receivingAddress: string;
  quantity: number | null;
  idsToMint: number[];
};

const props = defineProps({
  collection: { type: Object as PropType<CollectionInterface>, required: true },
  chainId: { type: Number, required: true },
});
const emit = defineEmits(['submitSuccess']);

const { t } = useI18n();
const message = useMessage();
const warningStore = useWarningStore();
const { addressLabel } = useCollection();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormNftMint>({
  receivingAddress: '',
  quantity: null,
  idsToMint: [],
});

const rules: NFormRules = {
  receivingAddress: ruleRequired(t('validation.nft.mintAddressRequired')),
  quantity: [
    { required: props.collection.isAutoIncrement, message: t('validation.nft.mintQuantityRequired') },
    { validator: validateQuantity, message: t('validation.nft.mintQuantity') },
    { validator: (_, v) => v <= 20, message: t('validation.nft.mintQuantityMax') },
  ],
  idsToMint: [
    { required: !props.collection.isAutoIncrement, message: t('validation.nft.idsToMintRequired') },
    { validator: validateIds, message: t('validation.nft.idsToMint') },
    { validator: validateIdsLength, message: t('validation.nft.idsToMintMax') },
  ],
};

const isSubstrate = computed(
  () => props.collection.chainType === ChainType.SUBSTRATE || props.collection.chain === SubstrateChain.UNIQUE
);

function validateQuantity(_: FormItemRule, value: number): boolean {
  return (
    props.collection.isAutoIncrement ||
    !props.collection.drop ||
    props.collection.chainType === ChainType.SUBSTRATE ||
    (value > 0 && value <= props.collection?.dropReserve)
  );
}

function validateIds(_: FormItemRule, value: number[]): boolean {
  return (
    !props.collection.drop ||
    props.collection.chainType === ChainType.SUBSTRATE ||
    value.every(v => v > 0 && (props.collection.maxSupply === 0 || v <= props.collection.maxSupply))
  );
}

function validateIdsLength(_: FormItemRule, values: number[]): boolean {
  return values.length <= 20;
}

const isTransferred = computed<boolean>(() => {
  return props.collection.collectionStatus === CollectionStatus.TRANSFERRED;
});
const isFormDisabled = computed<boolean>(() => {
  return isTransferred.value;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      const priceServiceName = generatePriceServiceName(ServiceTypeName.NFT, props.chainId, PriceServiceAction.MINT);
      warningStore.showSpendingWarning(priceServiceName, () => mint());
    }
  });
}

async function mint() {
  loading.value = true;

  try {
    if (!props.collection.isAutoIncrement) {
      formData.value.quantity = formData.value.idsToMint.length;
    }
    const bodyData = {
      ...formData.value,
      collection_uuid: props.collection.collection_uuid,
    };
    await $api.post<any>(endpoints.collectionMint(props.collection.collection_uuid), bodyData);

    message.success(t('form.success.nftMint'));

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
