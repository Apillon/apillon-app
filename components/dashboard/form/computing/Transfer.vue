<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Account Address -->
    <n-form-item
      path="accountAddress"
      :label="$t('form.label.contract.accountAddress')"
      :label-props="{ for: 'accountAddress' }"
    >
      <n-input
        v-model:value="formData.accountAddress"
        :input-props="{ id: 'accountAddress' }"
        :placeholder="$t('form.placeholder.contract.accountAddress')"
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('computing.contract.transfer')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('computing.contract.transfer') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormContractTransfer = {
  accountAddress: string;
};

const props = defineProps({
  contractUuid: { type: String, required: true },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormContractTransfer>({
  accountAddress: '',
});

const rules: NFormRules = {
  accountAddress: [ruleRequired($i18n.t('validation.contract.addressRequired'))],
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
      transfer();
    }
  });
}

async function transfer() {
  loading.value = true;

  try {
    await $api.post<any>(endpoints.contractTransferOwnership(props.contractUuid), formData.value);

    message.success($i18n.t('form.success.contract.transferred'));

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
