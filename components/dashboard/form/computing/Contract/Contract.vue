<template>
  <div>
    <Notification v-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <template v-else>
      <!-- Info text -->
      <p v-if="$te('computing.contract.infoNew')" class="text-body mb-8">
        {{ $t('computing.contract.infoNew') }}
      </p>
      <p v-else-if="$te('computing.contract.infoEdit')" class="text-body mb-8">
        {{ $t('computing.contract.infoEdit') }}
      </p>
    </template>

    <n-form
      ref="formRef"
      :model="contractStore.form"
      :rules="rules"
      :disabled="isFormDisabled"
      autocomplete="off"
      @submit.prevent="handleSubmit"
    >
      <!--  Contract name -->
      <n-form-item
        path="name"
        :label="$t('form.label.contract.name')"
        :label-props="{ for: 'name' }"
      >
        <n-input
          v-model:value="contractStore.form.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.contract.name')"
          clearable
        />
      </n-form-item>

      <!--  Contract description -->
      <n-form-item
        path="description"
        :label="$t('form.label.contract.description')"
        :label-props="{ for: 'description' }"
      >
        <n-input
          v-model:value="contractStore.form.description"
          type="textarea"
          :input-props="{ id: 'description' }"
          :placeholder="$t('form.placeholder.contract.description')"
          clearable
        />
      </n-form-item>

      <!-- Contract Contract Type -->
      <n-form-item
        path="contractType"
        :span="6"
        :label="$t('form.label.contract.contractType')"
        :label-props="{ for: 'contractType' }"
      >
        <select-options
          v-model:value="contractStore.form.contractType"
          :options="contractTypes"
          :input-props="{ id: 'contractType' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
        />
      </n-form-item>

      <!--  Bucket Uuid -->
      <n-form-item
        path="bucket_uuid"
        :label="$t('form.label.bucketName')"
        :label-props="{ for: 'bucket_uuid' }"
      >
        <select-options
          v-model:value="contractStore.form.bucket_uuid"
          :options="buckets"
          :placeholder="$t('general.pleaseSelect')"
          filterable
          clearable
        />
      </n-form-item>

      <!-- Use Apillon Collection -->
      <n-form-item
        class="cursor-default mb-4"
        :label="labelInfo('useApillonCollection')"
        :show-feedback="false"
      >
        <n-switch v-model:value="useApillonCollection" />
      </n-form-item>

      <!--  Contract NFT Collection Address -->
      <n-form-item
        path="contractData.nftContractAddress"
        :label="labelInfo('nftContractAddress')"
        :label-props="{ for: 'nftContractAddress' }"
      >
        <select-options
          v-if="useApillonCollection"
          v-model:value="contractStore.form.contractData.nftContractAddress"
          :options="contractAddresses"
          :input-props="{ id: 'nftContractAddress' }"
          :placeholder="$t('form.placeholder.contract.nftContractAddress')"
          autocomplete="off"
          filterable
          clearable
          @update:value="onContractChange"
        />
        <n-input
          v-else
          v-model:value="contractStore.form.contractData.nftContractAddress"
          :input-props="{ id: 'nftContractAddress' }"
          :placeholder="$t('form.placeholder.contract.nftContractAddress')"
          clearable
        />
      </n-form-item>

      <!--  Contract NFT Chain Rpc Url -->
      <n-form-item
        v-show="!useApillonCollection"
        path="contractData.nftChainRpcUrl"
        :label="labelInfo('nftChainRpcUrl')"
        :label-props="{ for: 'nftChainRpcUrl' }"
      >
        <n-input
          v-if="rpcLocked"
          v-model:value="contractStore.form.contractData.nftChainRpcUrl"
          :input-props="{ id: 'nftChainRpcUrl' }"
          :placeholder="$t('form.placeholder.contract.nftChainRpcUrl')"
          readonly
        />
        <select-options
          v-else
          v-model:value="contractStore.form.contractData.nftChainRpcUrl"
          :options="nftChainRpcUrls"
          :input-props="{ id: 'nftChainRpcUrl' }"
          :placeholder="$t('form.placeholder.contract.nftChainRpcUrl')"
          autocomplete="off"
          :readonly="rpcLocked"
          filterable
          clearable
          tag
        />
      </n-form-item>

      <!-- Contract Restrict To Owner -->
      <n-form-item
        path="contractData.restrictToOwner"
        :span="6"
        :label="labelInfo('restrictToOwner')"
        :label-props="{ for: 'restrictToOwner' }"
      >
        <select-options
          v-model:value="contractStore.form.contractData.restrictToOwner"
          :options="booleanSelect"
          :input-props="{ id: 'restrictToOwner' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
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
  </div>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

type FormContract = {
  name: string;
  description?: string;
  bucket_uuid: string | null;
  contractType: number | null;
  contractData: {
    nftContractAddress: string | null;
    nftChainRpcUrl: string | null;
    restrictToOwner: boolean;
  };
};

const emit = defineEmits(['submitSuccess', 'createSuccess']);

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const contractStore = useContractStore();
const collectionStore = useCollectionStore();
const warningStore = useWarningStore();
const { booleanSelect } = useCollection();
const { labelInfo } = useComputing();

const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const rpcLocked = ref<boolean>(false);
const useApillonCollection = ref<boolean>(true);

const contractTypes = ref<SelectOption[]>(
  enumValues(ComputingContractType).map(value => {
    return {
      value,
      label: t(`computing.contract.type.${value}`),
    };
  })
);

const buckets = computed<Array<SelectOption>>(() => {
  return bucketStore.items.map(item => {
    return { label: item.name, value: item.bucket_uuid };
  });
});

const contractAddresses = computed(() => {
  return collectionStore.items
    .filter(item => !!item.contractAddress && item.chainType === ChainType.EVM)
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

const nftChainRpcUrls = ref<SelectOption[]>(
  Object.entries(rpc).map(([key, value]) => {
    return { value, label: Chains[key] };
  })
);

const rules: NFormRules = {
  name: [ruleRequired(t('validation.contract.nameRequired'))],
  description: [
    ruleRequired(t('validation.descriptionRequired')),
    ruleDescription(t('validation.descriptionTooLong')),
  ],
  'contractData.nftContractAddress': [ruleRequired(t('validation.contract.addressRequired'))],
};

onMounted(async () => {
  /** Get list of NFT collections and buckets */
  collectionStore.getCollections();
  bucketStore.getBuckets();
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
      warningStore.showSpendingWarning(PriceServiceName.COMPUTING_SCHRODINGER_CREATE, () =>
        createContract()
      );
    }
  });
}

async function createContract() {
  loading.value = true;

  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();

    if (!dataStore.projectUuid) return;
  }

  try {
    const bodyData = {
      ...contractStore.form,
      project_uuid: dataStore.projectUuid,
    };
    const res = await $api.post<ContractResponse>(endpoints.contracts(), bodyData);

    message.success(t('form.success.contract.deploy'));

    /** On new contract created add new contract to list */
    contractStore.items.unshift(res.data as ContractInterface);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

function onContractChange(contractAddress: string) {
  const collection = collectionStore.items.find(item => item.contractAddress === contractAddress);

  if (contractAddress && collection && rpc[collection.chain]) {
    contractStore.form.contractData.nftChainRpcUrl = rpc[collection.chain];
    rpcLocked.value = true;
  } else if (!contractAddress) {
    contractStore.form.contractData.nftChainRpcUrl = '';
    rpcLocked.value = false;
  }
}
</script>
