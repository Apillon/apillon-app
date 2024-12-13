<template>
  <div class="max-w-2xl">
    <div v-if="step === EncryptDeployTab.PREVIEW">
      <h3 class="mb-8 mt-4">{{ t('dashboard.solution.encryption.deploy.preview') }}</h3>
      <n-table class="plain mb-6 table-fixed" :bordered="false" :single-line="true">
        <thead>
          <tr>
            <th>{{ t('dashboard.solution.encryption.deploy.previewData') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in data" :key="key" :class="{ hidden: !item.value }">
            <td>{{ item.label }}:</td>
            <td>
              <span class="text-white">{{ item.value }}</span>
            </td>
          </tr>
        </tbody>
      </n-table>
      <Btn type="primary" class="mt-2 w-full" @click="createContract">
        {{ t('computing.contract.create') }}
      </Btn>
    </div>
    <div v-else-if="step === EncryptDeployTab.DEPLOYING" class="mt-10 text-center">
      <AnimationLoader />
      <h2>{{ t('dashboard.solution.encryption.deploy.loading') }}</h2>
      <p class="mb-8 whitespace-pre-line text-body">
        {{ t('dashboard.solution.encryption.deploy.loadingInfo') }}
      </p>
    </div>
    <div v-else class="mt-20 text-center">
      <NuxtIcon name="icon/success" class="mr-2 inline-block text-7xl text-green" />
      <h2>{{ t('dashboard.solution.encryption.deploy.finish') }}</h2>
      <p class="mb-8 whitespace-pre-line text-body">
        {{ t('dashboard.solution.encryption.deploy.finishInfo') }}
      </p>

      <div class="mx-auto flex max-w-sm flex-col gap-4">
        <Btn type="secondary" size="large" @click="router.push({ name: 'dashboard-service-computing' })">
          {{ t('dashboard.solution.encryption.deploy.goBack') }}
        </Btn>
        <Btn
          v-if="contract"
          type="primary"
          size="large"
          @click="
            router.push({
              name: 'dashboard-service-computing-id',
              params: { id: contract?.contract_uuid },
            })
          "
        >
          {{ t('dashboard.solution.encryption.deploy.goToContract') }}
        </Btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['submitSuccess', 'createSuccess']);

const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const contractStore = useContractStore();
const collectionStore = useCollectionStore();

const step = ref(EncryptDeployTab.PREVIEW);
const contract = ref<ContractInterface | undefined>();

const collection = computed(() => {
  return collectionStore.items.find(
    item => item.contractAddress === contractStore.form.contractData.nftContractAddress
  );
});

const chainName = computed(() => {
  const chainId = contractStore.form.contractData.nftChain;
  return (enumValues(Chains) as number[]).includes(chainId) ? Chains[chainId] : '';
});

const data = [
  {
    label: t('form.label.contract.name'),
    value: contractStore.form.name,
  },
  {
    label: t('form.label.contract.description'),
    value: contractStore.form.description,
  },
  {
    label: t('form.label.contract.contractType'),
    value: t(`computing.contract.type.${contractStore.form.contractType}`),
  },
  {
    label: t('dashboard.solution.encryption.deploy.previewNftCollection'),
    value: collection.value?.name,
  },
  {
    label: t('form.label.contract.nftContractAddress'),
    value: contractStore.form.contractData.nftContractAddress,
  },
  {
    label: t('form.label.collection.chain'),
    value: chainName.value,
  },
  {
    label: t('form.label.contract.nftChainRpcUrl'),
    value: contractStore.form.contractData.nftChainRpcUrl,
  },
  {
    label: t('form.label.contract.restrictToOwner'),
    value: contractStore.form.contractData.restrictToOwner
      ? t('form.booleanSelect.true')
      : t('form.booleanSelect.false'),
  },
];

async function createContract() {
  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();

    if (!dataStore.projectUuid) return;
  }

  step.value = EncryptDeployTab.DEPLOYING;

  try {
    const bodyData = {
      ...contractStore.form,
      project_uuid: dataStore.projectUuid,
    };
    const res = await $api.post<ContractResponse>(endpoints.contracts(), bodyData);
    contract.value = res.data;

    step.value = EncryptDeployTab.DEPLOYED;
    message.success(t('form.success.contract.deploy'));

    /** On new contract created add new contract to list */
    contractStore.items.unshift(res.data as ContractInterface);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', res.data);
  } catch (error) {
    step.value = EncryptDeployTab.PREVIEW;
    message.error(userFriendlyMsg(error));
  }
}
</script>
