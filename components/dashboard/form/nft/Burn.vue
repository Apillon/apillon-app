<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <p class="mb-8">{{ $t('nft.collection.burn.info') }}</p>

    <!--  NFT Burn token -->
    <n-form-item path="tokenId" :label="$t('form.label.nft.burnTokenId')">
      <n-select
        v-if="mintedTokens.length"
        v-model:value="formData.tokenId"
        :options="mintedTokens"
        :placeholder="$t('form.placeholder.nftBurnTokenId')"
        filterable
      />
      <n-input-number
        v-else
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
      <Btn type="error" class="mt-2 w-full" :loading="loading" @click="handleSubmit">
        {{ $t('nft.collection.revoke') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

type FormNftBurn = {
  collectionUuid: string;
  tokenId: number | null;
};

const props = defineProps({
  collection: { type: Object as PropType<CollectionInterface>, required: true },
});
const emit = defineEmits(['submitSuccess']);

const { t } = useI18n();
const message = useMessage();
const warningStore = useWarningStore();
const { getAllTokens } = useNftContract();

const loading = ref(false);
const mintedTokens = ref<SelectOption[]>([]);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormNftBurn>({
  collectionUuid: props.collection.collection_uuid,
  tokenId: null,
});

const rules: NFormRules = {
  tokenId: [
    {
      required: true,
      message: t('validation.nft.burnTokenIdRequired'),
    },
  ],
};

onMounted(async () => {
  if (props.collection.contractAddress) {
    const minted = await getAllTokens(props.collection.contractAddress, props.collection.chain);
    mintedTokens.value = minted.map(i => ({ label: String(i), value: i }) as SelectOption);
  }
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (!errors) {
      const priceServiceName = generatePriceServiceName(
        ServiceTypeName.NFT,
        props.collection.chain,
        PriceServiceAction.BURN
      );
      warningStore.showSpendingWarning(priceServiceName, () => burn());
    }
  });
}

async function burn() {
  loading.value = true;

  try {
    await $api.post(endpoints.collectionBurn(props.collection.collection_uuid), formData.value);

    message.success(t('form.success.nftBurned'));

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
