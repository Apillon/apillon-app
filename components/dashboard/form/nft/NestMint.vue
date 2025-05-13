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
    <!--  NFT Nest Mint - Collection -->
    <n-form-item
      path="parentCollectionUuid"
      class="hidden"
      :label="$t('form.label.nft.mintCollectionUuid')"
      :label-props="{ for: 'bucket' }"
    >
      <select-options
        v-model:value="formData.parentCollectionUuid"
        :options="collections"
        :loading="loading"
        :placeholder="$t('general.pleaseSelect')"
        filterable
        clearable
      />
    </n-form-item>

    <!--  NFT Nest Mint - NFT ID -->
    <n-form-item path="parentNftId" :label="$t('form.label.nft.mintParentNftId')">
      <n-select
        v-if="parentNfts.length"
        v-model:value="formData.parentNftId"
        :options="parentNfts"
        :placeholder="$t('form.placeholder.nftMintParentNftId')"
        filterable
      />
      <n-input-number
        v-else
        v-model:value="formData.parentNftId"
        :min="1"
        :placeholder="$t('form.placeholder.nftMintParentNftId')"
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
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('nft.collection.mint')" />
      <Btn type="primary" class="mt-2 w-full" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
        {{ $t('nft.collection.mint') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormItemRule, SelectOption } from 'naive-ui';

type FormNftNestMint = {
  parentCollectionUuid: string | null;
  parentNftId: number | null;
  quantity: number | null;
};

const props = defineProps({
  collectionUuid: { type: String, required: true },
  chainId: { type: Number, required: true },
});
const emit = defineEmits(['submitSuccess']);

const { t } = useI18n();
const message = useMessage();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();
const { getAllTokens } = useNftContract();

const loading = ref(false);
const mintedTokens = ref<number[]>([]);
const parentNfts = ref<SelectOption[]>([]);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormNftNestMint>({
  parentCollectionUuid: props.collectionUuid,
  parentNftId: null,
  quantity: null,
});

const rules: NFormRules = {
  parentCollectionUuid: [
    {
      required: true,
      message: t('validation.nft.mintCollectionUuidRequired'),
    },
  ],
  parentNftId: [
    {
      required: true,
      message: t('validation.nft.mintParentNftIdRequired'),
    },
  ],
  quantity: [
    {
      required: true,
      message: t('validation.nft.mintQuantityRequired'),
    },
    {
      validator: validateQuantity,
      message: t('validation.nft.mintQuantity'),
    },
  ],
};

const collections = computed<Array<SelectOption>>(() => {
  return collectionStore.items
    .filter(item => item.collectionType === NFTCollectionType.NESTABLE)
    .map(item => {
      return { label: item.name, value: item.collection_uuid };
    });
});

const isTransferred = computed<boolean>(() => {
  return collectionStore.active.collectionStatus === CollectionStatus.TRANSFERRED;
});
const isFormDisabled = computed<boolean>(() => {
  return isTransferred.value;
});

onMounted(async () => {
  const collection =
    collectionStore.active.collection_uuid === props.collectionUuid
      ? collectionStore.active
      : collectionStore.items.find(c => c.collection_uuid === props.collectionUuid);

  if (collection && collection?.contractAddress) {
    mintedTokens.value = await getAllTokens(collection.contractAddress, props.chainId);
    parentNfts.value = mintedTokens.value.map(i => ({ label: String(i), value: i }) as SelectOption);
  }
});

function validateQuantity(_: FormItemRule, value: number): boolean {
  return !collectionStore.active.drop || value <= collectionStore.active?.dropReserve;
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
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
    const bodyData = {
      ...formData.value,
      collection_uuid: props.collectionUuid,
    };
    const { data } = await $api.post<MintResponse>(endpoints.collectionNestMint(props.collectionUuid), bodyData);

    if (data.success) {
      message.success(t('form.success.nftMint'));

      /** Invalidate local cache */
      sessionStorage.removeItem(LsCacheKeys.COLLECTIONS);

      /** Emit events */
      emit('submitSuccess', data.transactionHash);
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
