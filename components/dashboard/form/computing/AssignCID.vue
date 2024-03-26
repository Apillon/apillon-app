<template>
  <n-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    :disabled="!enabled"
    @submit.prevent="handleSubmit"
  >
    <Notification v-if="!enabled" class="-mt-4 mb-4" type="info">
      {{ $t('computing.contract.assignDisabled') }}
    </Notification>
    <!--  CID -->
    <n-form-item
      class="hidden"
      path="cid"
      :label="$t('form.label.contract.cid')"
      :label-props="{ for: 'cid' }"
    >
      <n-input
        v-model:value="formData.cid"
        :input-props="{ id: 'cid' }"
        :placeholder="$t('form.placeholder.typeHere')"
        clearable
      />
    </n-form-item>

    <!--  NFT ID -->
    <n-form-item
      path="nftId"
      :label="$t('form.label.contract.nftId')"
      :label-props="{ for: 'nftId' }"
    >
      <n-input-number
        v-model:value="formData.nftId"
        :input-props="{ id: 'nftId' }"
        :placeholder="$t('form.placeholder.typeHere')"
        min="1"
        step="1"
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-feedback="false" :show-label="false">
      <input type="submit" class="hidden" :value="$t('computing.contract.assignCid')" />
      <Btn
        type="primary"
        class="w-full mt-2"
        :loading="loading"
        :disabled="!enabled"
        @click="handleSubmit"
      >
        {{ $t('computing.contract.assignCid') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormContractAssignCid = {
  cid: string;
  nftId: number;
};

const props = defineProps({
  contractUuid: { type: String, required: true },
  cid: { type: String, required: true },
  enabled: { type: Boolean, default: true },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const warningStore = useWarningStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormContractAssignCid>({
  cid: props.cid,
  nftId: 1,
});

const rules: NFormRules = {
  cid: [ruleRequired($i18n.t('validation.contract.cidRequired'))],
  nftId: [ruleRequired($i18n.t('validation.contract.nftIdRequired'))],
};

watch(
  () => props.cid,
  cid => {
    if (cid) {
      formData.value.cid = cid;
    }
  }
);

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      warningStore.showSpendingWarning(
        PriceServiceName.COMPUTING_SCHRODINGER_ASSIGN_CID_TO_NFT,
        () => assignCid()
      );
    }
  });
}

async function assignCid() {
  loading.value = true;

  try {
    const res = await $api.post<SuccessResponse>(
      endpoints.contractAssignCid(props.contractUuid),
      formData.value
    );

    if (res.data.success) {
      message.success($i18n.t('form.success.contract.cidAssign'));

      /** Emit events */
      emit('submitSuccess');
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
