<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  NFT Mint Address -->
    <n-form-item
      path="receivingAddress"
      :label="$t('form.label.nftMintAddress')"
      :label-props="{ for: 'receivingAddress' }"
    >
      <n-input
        v-model:value="formData.receivingAddress"
        :input-props="{ id: 'receivingAddress' }"
        :placeholder="$t('form.placeholder.nftMintAddress')"
        clearable
      />
    </n-form-item>

    <!--  NFT Mint Quantity -->
    <n-form-item path="quantity" :label="$t('form.label.nftMintQuantity')">
      <n-input-number
        v-model:value="formData.quantity"
        :min="1"
        :max="20"
        :placeholder="$t('form.placeholder.nftMintQuantity')"
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item>
      <input type="submit" class="hidden" :value="$t('nft.collection.mint')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('nft.collection.mint') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const props = defineProps({
  collectionUuid: { type: String, required: true },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();

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
  ],
};

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
    const res = await $api.post<any>(endpoints.collectionMint(props.collectionUuid), bodyData);

    message.success($i18n.t('form.success.nftMint'));

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
