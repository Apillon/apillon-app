<template>
  <Spinner v-if="contractUuid && !contract" />
  <div v-else>
    <Notification v-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <template v-else>
      <!-- Info text -->
      <p v-if="!!contractUuid && $i18n.te('computing.contract.infoNew')" class="text-body mb-8">
        {{ $t('computing.contract.infoNew') }}
      </p>
      <p
        v-else-if="!!contractUuid && $i18n.te('computing.contract.infoEdit')"
        class="text-body mb-8"
      >
        {{ $t('computing.contract.infoEdit') }}
      </p>
    </template>

    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <!--  Contract name -->
      <n-form-item
        path="name"
        :label="$t('form.label.contract.name')"
        :label-props="{ for: 'name' }"
      >
        <n-input
          v-model:value="formData.name"
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
          v-model:value="formData.description"
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
          v-model:value="formData.contractType"
          :options="contractTypes"
          :input-props="{ id: 'contractType' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
        />
      </n-form-item>

      <!--  Contract NFT Contract Address -->
      <n-form-item
        path="nftContractAddress"
        :label="$t('form.label.contract.nftContractAddress')"
        :label-props="{ for: 'nftContractAddress' }"
      >
        <n-input
          v-model:value="formData.nftContractAddress"
          :input-props="{ id: 'nftContractAddress' }"
          :placeholder="$t('form.placeholder.contract.nftContractAddress')"
          clearable
        />
      </n-form-item>

      <!--  Contract NFT Chain Rpc Url -->
      <n-form-item
        path="nftChainRpcUrl"
        :label="$t('form.label.contract.nftChainRpcUrl')"
        :label-props="{ for: 'nftChainRpcUrl' }"
      >
        <n-input
          v-model:value="formData.nftChainRpcUrl"
          :input-props="{ id: 'nftChainRpcUrl' }"
          :placeholder="$t('form.placeholder.contract.nftChainRpcUrl')"
          clearable
        />
      </n-form-item>

      <!-- Contract Restrict To Owner -->
      <n-form-item
        path="restrictToOwner"
        :span="6"
        :label="$t('form.label.contract.restrictToOwner')"
        :label-props="{ for: 'restrictToOwner' }"
      >
        <select-options
          v-model:value="formData.restrictToOwner"
          :options="booleanSelect"
          :input-props="{ id: 'restrictToOwner' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
        />
      </n-form-item>

      <!--  Form submit -->
      <n-form-item :show-feedback="false">
        <input type="submit" class="hidden" :value="$t('computing.contract.create')" />
        <Btn
          type="primary"
          class="w-full mt-2"
          :loading="loading"
          :disabled="isFormDisabled"
          @click="handleSubmit"
        >
          <template v-if="contract">
            {{ $t('computing.contract.update') }}
          </template>
          <template v-else>
            {{ $t('computing.contract.create') }}
          </template>
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  contractUuid: { type: String, default: null },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const contractStore = useContractStore();
const { booleanSelect } = useCollection();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const contract = ref<ContractInterface | null>(null);

onMounted(async () => {
  if (props.contractUuid) {
    contract.value = await contractStore.getContract(props.contractUuid);
    formData.value.name = contract.value.name;
    formData.value.description = contract.value.description || '';
  }
});

const contractTypes = ref<Array<NSelectOption>>(
  enumValues(ComputingContractType).map(value => {
    return {
      value,
      label: $i18n.t(`computing.contract.type.${value}`),
    };
  })
);

const formData = ref<FormContract>({
  name: contract.value?.name || '',
  description: contract.value?.description || '',
});

const rules: NFormRules = {
  name: [
    {
      required: true,
      message: $i18n.t('validation.contract.nameRequired'),
      trigger: 'input',
    },
  ],
  description: [
    {
      max: 255,
      message: $i18n.t('validation.contract.descriptionTooLong'),
      trigger: 'input',
    },
  ],
};

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
    } else if (props.contractUuid) {
      await updateContract();
    } else {
      createContract();
    }
  });
}

async function createContract() {
  loading.value = true;

  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  try {
    const bodyData = {
      ...formData.value,
      project_uuid: dataStore.projectUuid,
    };
    const res = await $api.post<ContractResponse>(endpoints.contracts(), bodyData);

    message.success($i18n.t('form.success.created.contract'));

    /** On new contract created add new contract to list */
    contractStore.items.push(res.data as ContractInterface);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');

    /** Redirect to new contract */
    router.push(`/dashboard/service/computing/${res.data.contract_uuid}`);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateContract() {
  loading.value = true;

  try {
    const res = await $api.patch<ContractResponse>(
      endpoints.contracts(props.contractUuid),
      formData.value
    );

    message.success($i18n.t('form.success.updated.contract'));

    /** On contract updated refresh contract data */
    contractStore.items.forEach((item: ContractInterface) => {
      if (item.contract_uuid === props.contractUuid) {
        item = res.data;
      }
    });
    if (contractStore.active.contract_uuid === props.contractUuid) {
      contractStore.active = res.data;
    }

    /** Emit events */
    emit('submitSuccess');
    emit('updateSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
