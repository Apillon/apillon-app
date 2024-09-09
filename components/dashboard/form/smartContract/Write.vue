<template>
  <n-form
    ref="formRef"
    class="max-w-lg"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <!-- Create inputs -->
    <template v-for="i in fn.inputs" :key="i.name">
      <n-form-item :label="i.name">
        <n-input
          v-model:value="form[fn.name][i.name]"
          :maxlength="256"
          required
          :class="{
            'error-input': formErrors[fn.name],
          }"
        />
      </n-form-item>
    </template>
    <!-- Submit -->
    <SmartContractsBtnSubmit />
    <!-- Error container for each form -->
    <Notification v-if="errors[fn.name]" type="error" class="mt-6">
      Something went wrong, please try again or try later.
    </Notification>
  </n-form>
</template>

<script lang="ts" setup>
type FormSpace = {
  name: string;
  about: string | null;
  image: string | null;
  tags: string | null;
};
const emit = defineEmits(['submitSuccess']);

const message = useMessage();
const $i18n = useI18n();
const dataStore = useDataStore();
const deployedContractStore = useDeployedContractStore();
const { getChainConfig } = useSmartContracts();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormSpace>({
  name: '',
  about: '',
  image: '',
  tags: '',
});

const rules: NFormRules = {
  name: [ruleRequired($i18n.t('validation.chatNameRequired'))],
  about: [ruleDescription($i18n.t('validation.descriptionTooLong'))],
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
    }
  });
}

async function execWalletWrite(methodName) {
  // activeTransactionsWindow.value = true;

  const contractAddress = deployedContractStore.active.contractAddress as `0x${string}`;
  const abi = deployedContractStore.active.contractVersion.abi;
  const chainId = deployedContractStore.active.chain;
  let response;

  const chainConfig = getChainConfig(chainId);

  const client = createWalletClient({
    chain: chainConfig,
    transport: custom(window.ethereum), // Connect to the wallet via MetaMask or similar
  });

  try {
    response = await client.writeContract({
      address: contractAddress,
      abi,
      functionName: methodName,
      args: Object.values(form[methodName]),
      account: address.value,
    });
    if (response) {
      console.log(response);
      msgs.value[methodName] = response;
    }
  } catch (error) {
    console.log(error);
    errors.value[methodName] = 'Something went wrong. Please try again.';
  } finally {
    btnLoading.value = false;
  }
  btnLoading.value = false;
}

// write functions handler
async function execOwnerWrite(methodName) {
  // activeTransactionsWindow.value = true;

  console.log('write write');

  try {
    const res = await $api.post<SmartContractCallResponse>(
      endpoints.smartContractsCall(contractUuid.value),
      {
        methodName,
        methodArguments: Object.keys(form[methodName]).length
          ? Object.values(form[methodName])
          : ['true'],
      }
    );

    if (res.ok) {
      errors.value[methodName] = '';
      formRefs.value[methodName].reset();
    }
    msgs.value[methodName] = res;
  } catch (error) {
    console.log(error);
    errors.value[methodName] = 'Something went wrong. Please try again.';
  } finally {
    btnLoading.value = false;
  }
}
</script>
