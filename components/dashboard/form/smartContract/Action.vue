<template>
  <n-form
    ref="formRef"
    class="max-w-lg"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <!-- Create inputs -->
    <n-form-item v-for="(field, key) in formData" :key="key" :path="key" :label="key">
      <n-input v-model:value="formData[key]" :maxlength="256" required />
    </n-form-item>

    <!-- Submit -->
    <SmartContractsBtnSubmit :fn="fn" :owner="owner" :loading="loading" @submit="handleSubmit" />

    <!-- Result -->
    <Notification v-if="result !== undefined" type="success" class="mt-6" hide-icon>
      {{ result }}
    </Notification>
  </n-form>
</template>

<script lang="ts" setup>
import { useAccount } from 'use-wagmi';
import { createPublicClient, createWalletClient, custom, http } from 'viem';

const emit = defineEmits(['submitSuccess']);
const props = defineProps({
  fn: { type: Object as PropType<SmartContractABI>, required: true },
  owner: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
});

const message = useMessage();
const { t } = useI18n();
const { address } = useAccount();
const deployedContractStore = useDeployedContractStore();
const { getChainConfig } = useSmartContracts();

const loading = ref<boolean>(false);
const result = ref<string>();
const formRef = ref<NFormInst | null>(null);

const formData = reactive<Record<string, string | null>>(
  props.fn.inputs.reduce((acc, item) => Object.assign(acc, { [item.name]: null }), {})
);

const rules: NFormRules = props.fn.inputs.reduce(
  (acc, item) =>
    Object.assign(acc, { [item.name]: ruleRequired(t('validation.smartContracts.fieldRequired')) }),
  {}
);

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e?.preventDefault();

  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (props.read) {
      execRead(props.fn.name);
    } else if (props.owner) {
      execOwnerWrite(props.fn.name);
    } else {
      execWalletWrite(props.fn.name);
    }
  });
}
// read functions handler
async function execRead(methodName: string) {
  loading.value = true;

  const contractAddress = deployedContractStore.active.contractAddress as `0x${string}`;
  const abi = deployedContractStore.active.contractVersion.abi;
  const chainId = deployedContractStore.active.chain;
  let response;

  const chainConfig = getChainConfig(chainId);

  const client = createPublicClient({
    chain: chainConfig,
    transport: http(),
  });

  try {
    response = await client.readContract({
      address: contractAddress,
      abi,
      functionName: methodName,
      args: Object.values(formData),
    });
    result.value = `${response}`;
  } catch (e) {
    message.error(userFriendlyMsg(e));
  } finally {
    loading.value = false;
  }
}

async function execWalletWrite(methodName: string) {
  if (!address.value) return;
  loading.value = true;

  const contractAddress = deployedContractStore.active.contractAddress as `0x${string}`;
  const abi = deployedContractStore.active.contractVersion.abi;
  const chainId = deployedContractStore.active.chain;

  const chainConfig = getChainConfig(chainId);

  const client = createWalletClient({
    chain: chainConfig,
    transport: custom(window.ethereum), // Connect to the wallet via MetaMask or similar
  });

  try {
    const res = await client.writeContract({
      address: contractAddress,
      abi,
      functionName: methodName,
      args: Object.values(formData),
      account: address.value,
    });
    result.value = `${res}`;
  } catch (e) {
    message.error(userFriendlyMsg(e));
  } finally {
    loading.value = false;
  }
}

// write functions handler
async function execOwnerWrite(methodName: string) {
  loading.value = true;
  try {
    await $api.post<SmartContractCallResponse>(
      endpoints.smartContractsCall(deployedContractStore.active.contract_uuid),
      {
        methodName,
        methodArguments: Object.keys(formData).length ? Object.values(formData) : ['true'],
      }
    );
  } catch (e) {
    message.error(userFriendlyMsg(e));
  } finally {
    loading.value = false;
  }
}
</script>
