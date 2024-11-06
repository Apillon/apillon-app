<template>
  <n-form
    ref="formRef"
    :model="contractStore.form"
    :rules="rules"
    :disabled="isFormDisabled"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <div class="flex gap-4 whitespace-pre-line my-8 justify-center">
      <div
        v-for="chain in nftChains"
        :key="chain.value"
        class="border-2 p-4 rounded-md border-bg-lightest hover:cursor-pointer w-full flex justify-center"
        :class="contractStore.form.contractData.nftChain === chain.value ? '!border-yellow' : ''"
        @click="onChainChange(chain.value)"
      >
        <div>
          <div
            v-if="chain.value === CUSTOM_EVM"
            class="flex-cc h-[74px] w-[74px] p-4 bg-orange rounded-full"
          >
            <span class="text-black text-xs text-center">{{ chain.label }}</span>
          </div>
          <NuxtIcon
            v-else
            :name="`logo/${chain.name}`"
            class="flex justify-center mx-auto text-7xl"
            filled
          />
          <p class="mt-4 text-center">{{ chain.label }}</p>
        </div>
      </div>
    </div>

    <template v-if="contractStore.form.contractData.nftChain === CUSTOM_EVM">
      <!--  Contract NFT Collection Address -->
      <n-form-item
        path="contractData.nftContractAddress"
        :label="labelInfo('nftContractAddress')"
        :label-props="{ for: 'nftContractAddress' }"
      >
        <n-input
          v-model:value="contractStore.form.contractData.nftContractAddress"
          :input-props="{ id: 'nftContractAddress' }"
          :placeholder="$t('form.placeholder.typeHere')"
          clearable
        />
      </n-form-item>

      <!--  Contract NFT Chain Rpc Url -->
      <n-form-item
        path="contractData.nftChainRpcUrl"
        :label="labelInfo('nftChainRpcUrl')"
        :label-props="{ for: 'nftChainRpcUrl' }"
      >
        <n-input
          v-model:value="contractStore.form.contractData.nftChainRpcUrl"
          :input-props="{ id: 'nftChainRpcUrl' }"
          :placeholder="$t('form.placeholder.contract.nftChainRpcUrl')"
        />
      </n-form-item>
    </template>

    <!--  Contract NFT Collection Address -->
    <n-form-item
      v-else-if="!!contractStore.form.contractData.nftChain"
      path="contractData.nftContractAddress"
      :label="labelInfo('nftContractAddress')"
      :label-props="{ for: 'nftContractAddress' }"
    >
      <select-options
        v-model:value="contractStore.form.contractData.nftContractAddress"
        :options="collectionAddresses"
        :input-props="{ id: 'nftContractAddress' }"
        :placeholder="$t('form.placeholder.contract.nftContractAddress')"
        autocomplete="off"
        filterable
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-feedback="false" :show-label="false">
      <input type="submit" class="hidden" :value="$t('computing.contract.create')" />
      <Btn
        type="primary"
        class="w-full mt-2"
        :loading="loading"
        :disabled="isFormDisabled"
        @click="handleSubmit"
      >
        {{ $t('computing.contract.create') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
const emit = defineEmits(['submitSuccess']);

const { t, te } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const contractStore = useContractStore();
const collectionStore = useCollectionStore();
const { labelInfo } = useComputing();
const { chains } = useCollection();

const CUSTOM_EVM = 1;
const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);

const nftChains = [
  ...chains,
  {
    name: 'custom',
    label: t('dashboard.solution.encryption.configure.customEvm'),
    value: CUSTOM_EVM,
  },
];

const collectionAddresses = computed(() => {
  return collectionStore.items
    .filter(
      item => !!item.contractAddress && item.chain === contractStore.form.contractData.nftChain
    )
    .map(item => {
      return {
        value: item.contractAddress,
        label: `${item.contractAddress} (${item.name})`,
      };
    });
});

const rpc: Record<number, string> = {
  [Chains.ASTAR]: 'https://evm.astar.network',
  [Chains.MOONBASE]: 'https://rpc.api.moonbase.moonbeam.network',
  [Chains.MOONBEAM]: 'https://rpc.api.moonbeam.network',
};

const rules: NFormRules = {
  'contractData.nftContractAddress': [ruleRequired(t('validation.contract.addressRequired'))],
  'contractData.nftChainRpcUrl': [ruleRequired(t('validation.contract.chainRpcUrlRequired'))],
};

onMounted(() => {
  collectionStore.getCollections();
});

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      emit('submitSuccess');
    }
  });
}
function onChainChange(chainId: number) {
  contractStore.form.contractData.nftChain = chainId;

  if (chainId === CUSTOM_EVM) {
    contractStore.form.contractData.nftChainRpcUrl = '';
  } else if (chainId) {
    contractStore.form.contractData.nftChainRpcUrl = rpc[chainId];
  }
}
</script>
