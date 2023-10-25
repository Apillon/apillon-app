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

    <!--  Amount -->
    <n-form-item
      path="amount"
      :label="$t('form.label.contract.amount')"
      :label-props="{ for: 'amount' }"
    >
      <n-input-number
        v-model:value="formData.amount"
        :min="0"
        :input-props="{ id: 'amount' }"
        placeholder="1"
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('computing.contract.deposit')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('computing.contract.deposit') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormContractDeposit = {
  accountAddress: string;
  amount: number;
};

const props = defineProps({
  contractUuid: { type: String, required: true },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormContractDeposit>({
  accountAddress: '',
  amount: 0,
});

const rules: NFormRules = {
  accountAddress: [
    {
      required: true,
      message: $i18n.t('validation.contract.addressRequired'),
    },
  ],
  amount: [
    {
      required: true,
      message: $i18n.t('validation.contract.depositAmountRequired'),
    },
    {
      validator: (_: NFormItemRule, value: number) => value >= 0.01,
      message: $i18n.t('validation.contract.depositAmountTooLow'),
    },
  ],
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
      deposit();
    }
  });
}

async function deposit() {
  loading.value = true;

  try {
    const bodyData = {
      ...formData.value,
      project_uuid: dataStore.projectUuid,
    };
    await $api.post<any>(endpoints.contractDeposit(props.contractUuid), bodyData);

    message.success($i18n.t('form.success.contractDeposit'));

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
