<template>
  <Notification v-if="isTransferred" type="error" class="w-full mb-8">
    {{ $t('error.NFT_CONTRACT_OWNER_ERROR') }}
  </Notification>
  <n-form
    v-bind="$attrs"
    ref="formRef"
    class="mt-8"
    :model="formData"
    :rules="rules"
    :disabled="isFormDisabled"
    @submit.prevent="handleSubmit"
  >
    <!--  NFT Nest Mint - Collection -->
    <n-form-item
      path="parentCollectionUuid"
      :label="$t('form.label.nftMintCollectionUuid')"
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
    <n-form-item path="parentNftId" :label="$t('form.label.nftMintParentNftId')">
      <n-input-number
        v-model:value="formData.parentNftId"
        :min="1"
        :placeholder="$t('form.placeholder.nftMintParentNftId')"
        clearable
      />
    </n-form-item>

    <!--  NFT Mint Quantity -->
    <n-form-item path="quantity" :label="$t('form.label.nftMintQuantity')">
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
const props = defineProps({
  collectionUuid: { type: String, required: true },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormNftNestMint>({
  parentCollectionUuid: null,
  parentNftId: null,
  quantity: null,
});

const rules: NFormRules = {
  parentCollectionUuid: [
    {
      required: true,
      message: $i18n.t('validation.nftMintCollectionUuidRequired'),
    },
  ],
  parentNftId: [
    {
      required: true,
      message: $i18n.t('validation.nftMintParentNftIdRequired'),
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

const collections = computed<Array<NSelectOption>>(() => {
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

function validateQuantity(_: NFormItemRule, value: number): boolean {
  return (
    !collectionStore.active.drop || (value > 0 && value <= collectionStore.active?.dropReserve)
  );
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      await mint();
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
    await $api.post<any>(endpoints.collectionNestMint(props.collectionUuid), bodyData);

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
