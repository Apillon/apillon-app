<template>
  <Dashboard :empty="!dataStore.project.selected || !deployedContractStore.hasDeployedContracts" :loading="pageLoading">
    <template #empty>
      <ServiceEmpty
        :name="toCamelCase(Feature.SMART_CONTRACTS)"
        :service="ServiceTypeName.SMART_CONTRACTS"
        :guides="serviceGuides"
        docs="https://wiki.apillon.io/web3-services/12-web3-smart-contracts.html"
      >
        <template #actions>
          <Btn size="large" :to="{ name: 'dashboard-service-smart-contracts-new' }">
            {{ $t('smartContracts.new') }}
          </Btn>
        </template>
      </ServiceEmpty>
    </template>
    <template #heading>
      <div ref="headingRef">
        <HeaderSmartContracts />
      </div>
    </template>

    <n-space class="pb-8" :size="32" vertical>
      <ActionsSmartContracts />
      <TableSmartContracts :contracts="deployedContractStore.items" />
    </n-space>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const deployedContractStore = useDeployedContractStore();
const { checkUnfinishedSmartContracts } = useSmartContracts();

useHead({
  title: t('dashboard.nav.smartContracts'),
});
const pageLoading = ref<boolean>(true);

const serviceGuides = [
  {
    title: 'Apillon integrates Moonbeam and brings the third fully-fledged service to the Apillon Web3',
    content:
      'With the newly-integrated smart contract connectivity, a new era of intuitive deployment of Web3 assets, NFTs included, is right ahead.',
    link: 'https://blog.apillon.io/apillon-integrates-moonbeam-and-brings-the-third-fully-fledged-service-to-the-apillon-web3-adff526633d7/',
  },
  {
    title: 'Apillon partners with Astar to deliver multi-chain smart contract connectivity',
    content:
      'Building future-proof projects that support free flow of digital assets between Polkadot, Ethereum, Cosmos, and other ecosystems just got…',
    link: 'https://blog.apillon.io/apillon-partners-with-astar-to-deliver-multi-chain-smart-contract-connectivity-63d1d5f1e288/',
  },
];

onMounted(async () => {
  await dataStore.waitOnPromises();
  await deployedContractStore.getDeployedContracts();
  pageLoading.value = false;

  checkUnfinishedSmartContracts();
});
</script>
