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
        :options="limitedValues"
        :virtual-scroll="false"
        :render-option="renderOption"
        filterable
        multiple
      />
      <n-select
        v-else
        v-model:value="formData.idsToMint"
        :options="unlimitedValues"
        :reset-menu-on-options-change="false"
        :virtual-scroll="false"
        :render-option="renderOption"
        filterable
        multiple
        tag
        @scroll="handleScroll"
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
import type { PropType } from 'vue';
import { NTooltip, type FormItemRule } from 'naive-ui';
import type { SelectBaseOption } from 'naive-ui/es/select/src/interface';

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
const { getAllTokens } = useNftContract();

const loading = ref<boolean>(false);
const mintedTokens = ref<Number[]>([]);
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

const unlimitedPage = ref(1);
const limitedValues = ref<SelectBaseOption[]>([]);
const unlimitedValues = ref<SelectBaseOption[]>([]);
const loadMoreOptions = async (limit = 100) => {
  const newOptions = repeat(limit, unlimitedPage.value * limit).map((_, i) =>
    createOption((unlimitedPage.value - 1) * limit + i + 1)
  );
  unlimitedValues.value.push(...newOptions);
  unlimitedPage.value += 1;
};

const handleScroll = (e: Event) => {
  const currentTarget = e.currentTarget as HTMLElement;
  if (currentTarget.scrollTop + currentTarget.offsetHeight >= currentTarget.scrollHeight) {
    loadMoreOptions();
  }
};

onMounted(async () => {
  if (!props.collection.isAutoIncrement) {
    if (props.collection.contractAddress) {
      mintedTokens.value = await getAllTokens(props.collection.contractAddress, props.chainId);
    }

    if (props.collection.maxSupply) {
      limitedValues.value = repeat(props.collection.maxSupply, 1).map((_, i) => createOption(i + 1));
    } else {
      loadMoreOptions();
    }
  }
});
const createOption = (v: number) => ({
  label: String(v),
  value: v,
  disabled: mintedTokens.value.includes(v),
});
const renderOption = ({ node, option }) =>
  option.disabled
    ? h(NTooltip, null, {
        trigger: () => node,
        default: () => t('nft.collection.minted'),
      })
    : node;

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
    const { data } = await $api.post<MintResponse>(
      endpoints.collectionMint(props.collection.collection_uuid),
      bodyData
    );

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
