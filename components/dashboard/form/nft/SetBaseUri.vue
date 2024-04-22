<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  NFT Set base URI -->
    <n-form-item path="uri" :label="$t('form.label.nftSetBaseUri')" :label-props="{ for: 'uri' }">
      <n-input
        v-model:value="formData.uri"
        :input-props="{ id: 'uri' }"
        :placeholder="$t('form.placeholder.typeHere')"
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('nft.collection.setBaseUri')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('nft.collection.setBaseUri') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormNftTransfer = {
  uri: string;
};

const props = defineProps({
  collectionUuid: { type: String, required: true },
  chainId: { type: Number, required: true },
});
const emit = defineEmits(['submitSuccess']);

const { t } = useI18n();
const message = useMessage();
const warningStore = useWarningStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormNftTransfer>({
  uri: '',
});

const rules: NFormRules = {
  uri: ruleRequired(t('validation.nftSetBaseUriRequired')),
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
        PriceServiceAction.SET_BASE_URI
      );
      warningStore.showSpendingWarning(priceServiceName, () => setBaseUri());
    }
  });
}

async function setBaseUri() {
  loading.value = true;

  try {
    const bodyData = {
      ...formData.value,
      collection_uuid: props.collectionUuid,
    };

    const res = await $api.post<any>(
      endpoints.collectionSetBaseUri(props.collectionUuid),
      bodyData
    );

    message.success(t('form.success.nftSetBaseUri'));

    /** Emit events */
    emit('submitSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
