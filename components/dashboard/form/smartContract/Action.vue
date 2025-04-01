<template>
  <n-form ref="formRef" class="max-w-lg" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!-- Create inputs -->
    <template v-if="!args">
      <n-form-item
        v-for="(input, key) in fn.inputs"
        :key="key"
        :path="input.name"
        :label="labelInfoText(input.name, input?.description)"
      >
        <n-input v-if="input.name === 'data'" v-model:value="formData[input.name]" :maxlength="256" required>
          <template v-if="!formData[input.name]?.startsWith('0x')" #prefix>
            <span class="text-bodyDark">0x</span>
          </template>
        </n-input>
        <n-input v-else v-model:value="formData[input.name]" :maxlength="256" required />
      </n-form-item>
    </template>

    <!-- Submit -->
    <div v-if="!read || fn.inputs.length > 0" class="mb-6">
      <Btn v-if="owner" type="primary" class="w-full" :loading="loading" @click="handleSubmit">
        {{ btnText ? btnText : read ? 'Query' : 'Execute' }}
      </Btn>
      <SmartContractsBtnSubmit
        v-else
        :owner="owner"
        :loading="loading"
        :btn-text="btnText ? btnText : read ? 'Query' : 'Execute'"
        @submit="handleSubmit"
      />
    </div>
    <div v-else-if="loading" class="relative h-4">
      <Spinner :size="24" />
    </div>

    <!-- Result -->
    <Notification v-if="result !== undefined" type="success" hide-icon>
      {{ result }}
    </Notification>
  </n-form>
</template>

<script lang="ts" setup>
import { useAccount } from '@wagmi/vue';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { SmartContractStatus } from '~/lib/types/smartContracts';

const emit = defineEmits(['submitSuccess', 'transferred']);
const props = defineProps({
  args: { type: Array<string | null>, default: null },
  btnText: { type: String, default: null },
  fn: { type: Object as PropType<SmartContractABI>, required: true },
  owner: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
});

const { t } = useI18n();
const message = useMessage();
const { address } = useAccount();
const { labelInfoText } = useComputing();
const { getChainConfig } = useSmartContracts();
const deployedContractStore = useDeployedContractStore();

const loading = ref<boolean>(false);
const result = ref<string>();
const formRef = ref<NFormInst | null>(null);

const formData = reactive<Record<string, string | null>>(
  props.fn.inputs.reduce((acc, item) => Object.assign(acc, { [item.name]: null }), {})
);

const rules: NFormRules = props.args
  ? {}
  : props.fn.inputs.reduce(
      (acc, item) =>
        item.name !== 'data'
          ? Object.assign(acc, {
              [item.name]: ruleRequired(t('validation.smartContracts.fieldRequired')),
            })
          : acc,
      {}
    );

const prepareData = () => {
  if (props.args && props.args.length) return props.args;
  if (Object.keys(formData).length === 0) return [];

  const parsedData: Record<string, any> = Object.assign({}, formData);
  if ('data' in parsedData) {
    parsedData.data = formData.data?.startsWith('0x') ? formData.data : `0x${formData?.data || ''}`;
  }

  props.fn.inputs.forEach(input => {
    if (input.type === 'uint256[]' && parsedData[input.name] && formData[input.name]) {
      parsedData[input.name] = (formData[input.name] || '').split(',').map(i => Number(i));
    }
  });
  return Object.values(parsedData);
};

onMounted(() => {
  if (props.read && props.fn.inputs.length === 0) {
    execRead(props.fn.name);
  }
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e?.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
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

  const chainConfig = getChainConfig(chainId);

  const client = createPublicClient({
    chain: chainConfig,
    transport: http(),
  });

  try {
    const res = await client.readContract({
      address: contractAddress,
      abi: abi.filter(a => a.inputs.length === props.fn.inputs.length),
      functionName: methodName,
      args: prepareData(),
    });
    result.value = `${res}`;
    message.success(t('smartContracts.functions.executed'));
  } catch (e: any) {
    console.error(e);
    message.error(contractError(e));
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
      args: prepareData(),
      account: address.value,
    });
    result.value = `${res}`;
    message.success(t('smartContracts.functions.executed'));
  } catch (e: any) {
    console.error(e);
    message.error(contractError(e));
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
        methodArguments: prepareData(),
      }
    );
    message.success(t('smartContracts.functions.executed'));

    if (methodName === 'transferOwnership') {
      deployedContractStore.active.contractStatus = SmartContractStatus.TRANSFERRING;
      deployedContractStore.items.forEach(item => {
        if (item.contract_uuid === deployedContractStore.active.contract_uuid) {
          item.contractStatus = SmartContractStatus.TRANSFERRING;
        }
      });
    }
  } catch (e: any) {
    console.error(e);
    message.error(userFriendlyMsg(e));
  } finally {
    loading.value = false;
  }
}
</script>
