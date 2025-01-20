<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContract>
        <template #title>
          <div>
            <h1>
              {{ deployedContractStore.active.name }}
              <small class="text-body text-sm ml-2">
                {{
                  t(
                    `dashboard.service.smartContracts.type.${deployedContractStore.active.contractVersion.contract.contractType}`
                  )
                }}
              </small>
              <small class="text-body text-sm ml-2">
                {{ t(`nft.chain.${deployedContractStore.active.chain}`) }}
              </small>
            </h1>
            <TableLink
              class="text-sm"
              :prefix="t('dashboard.service.smartContracts.table.contractAddress')"
              :text="deployedContractStore.active.contractAddress"
              :link="
                contractLink(
                  deployedContractStore.active.contractAddress,
                  deployedContractStore.active.chain
                )
              "
            />
          </div>
        </template>
        <slot>
          <div
            v-if="isConnected"
            class="bg-bg-lighter rounded-xl text-sm px-3 flex gap-2 items-center h-10"
          >
            <p class="text-bodyDark">{{ truncateWallet(`${address}`) }}</p>
            <hr class="bg-bg h-full w-[1px] border-bg" />
            <p class="cursor-pointer text-white" @click="disconnectWallet()">
              {{ $t('auth.wallet.disconnect.wallet') }}
            </p>
          </div>
          <SmartContractsBtnSubmit v-else size="small" />
        </slot>
      </HeaderSmartContract>
    </template>

    <slot>
      <div class="mb-8">
        <div class="flex flex-col md:flex-row gap-x-8 mb-8">
          <div class="flex-1 max-w-[550px]">
            <h4>
              {{ $t('dashboard.service.smartContracts.infoSection.title') }}
            </h4>
            <p class="">{{ $t('dashboard.service.smartContracts.infoSection.p') }}</p>
            <div class="flex border border-bg-lighter p-4 mt-4">
              <span class="icon-info mr-2"></span>
              <p v-if="isContractTransferred">
                {{ $t('dashboard.service.smartContracts.infoSection.infoTransferred') }}
              </p>
              <p v-else>
                {{ $t('dashboard.service.smartContracts.infoSection.info') }}
              </p>
            </div>
          </div>
          <div class="flex-1">
            <img src="~/assets/images/solution/smart-contracts.png" alt="" />
          </div>
        </div>
        <Btn v-if="isContractTransferring" class="max-w-xs w-full" :disabled="true">
          <span class="flex gap-2 items-center">
            <AnimationTyping />
            {{ SmartContractStatus[contractStatus] }}
          </span>
        </Btn>
        <FormSmartContractAction
          v-else-if="isConnected && !isContractTransferred && fnTransferOwnership"
          class="max-w-sm"
          :fn="fnTransferOwnership"
          :args="[address as string]"
          :btn-text="$t('dashboard.service.smartContracts.infoSection.takeOwnershipBtn')"
          owner
        />
        <FormSmartContractAction
          v-else-if="isConnected && !isContractTransferred && fnRenounceRole"
          class="max-w-sm"
          :fn="fnRenounceRole"
          :args="[
            '0x7b765e0e932d348852a6f810bfa1ab891e259123f02db8cdcde614c570223357',
            deployedContractStore.active.deployerAddress,
          ]"
          :btn-text="
            $t('dashboard.service.smartContracts.infoSection.takeOwnershipBtn') + ' renounce'
          "
          owner
        />
        <SmartContractsBtnSubmit v-else-if="!isConnected" size="small" />
      </div>

      <div class="flex flex-wrap sm:flex-nowrap gap-4 border-t border-bg-lighter mt-8 pt-8 mb-4">
        <div
          class="h-full"
          :class="
            ownerFunctions?.length && writeFunctions?.length
              ? 'w-full sm:w-1/2 lg:w-2/3 max-w-[840px]'
              : 'w-full sm:w-1/2 lg:w-1/3 max-w-[420px]'
          "
        >
          <h2 class="mb-6">
            {{ $t('dashboard.service.smartContracts.functions.write') }}
          </h2>
          <div class="bg-black rounded-lg h-full flex gap-x-4 flex-wrap lg:flex-nowrap">
            <SmartContractsPanelFunctions
              v-if="ownerFunctions?.length"
              :functions="ownerFunctions"
              :title="$t('dashboard.service.smartContracts.functions.writeOverApillon')"
              owner
            />
            <SmartContractsPanelFunctions
              v-if="writeFunctions?.length"
              :functions="writeFunctions"
              :title="$t('dashboard.service.smartContracts.functions.writeFromDapp')"
            />
          </div>
        </div>
        <div class="w-full sm:w-1/2 lg:w-1/3">
          <h2 class="mb-6">
            {{ $t('dashboard.service.smartContracts.functions.read') }}
          </h2>

          <SmartContractsPanelFunctions
            bg-class="bg-bg-lighter"
            :functions="readFunctions"
            :title="$t('dashboard.service.smartContracts.functions.readFromDapp')"
            read
          />
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect } from 'use-wagmi';

const { t } = useI18n();
const router = useRouter();
const { params } = useRoute();
const dataStore = useDataStore();
const deployedContractStore = useDeployedContractStore();
const { checkUnfinishedSmartContracts } = useSmartContracts();

const { address } = useAccount();
const { disconnect } = useDisconnect();
const { isConnected } = useAccount({ onConnect: onWalletConnected });

useHead({
  title: t('dashboard.nav.smartContracts'),
});

const pageLoading = ref<boolean>(true);
const btnLoading = ref<boolean>(false);
const contractUuid = ref<string>(`${params?.id}` || '');

// Data
const ownerFunctions = ref<SmartContractABI[]>([]);
const readFunctions = ref<SmartContractABI[]>([]);
const writeFunctions = ref<SmartContractABI[]>([]);

const contractStatus = computed(() => deployedContractStore.active.contractStatus);
const isContractTransferring = computed(
  () => contractStatus.value === SmartContractStatus.TRANSFERRING
);
const isContractTransferred = computed(
  () => contractStatus.value === SmartContractStatus.TRANSFERRED
);

const fnTransferOwnership = computed(() =>
  ownerFunctions.value.find(method => method.name === 'transferOwnership')
);
const fnRenounceRole = computed(() =>
  ownerFunctions.value.find(method => method.name === 'renounceRole')
);

async function onWalletConnected() {
  await sleep(200);
  if (btnLoading.value) {
    btnLoading.value = false;
  }
}

function disconnectWallet() {
  disconnect();
}

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    const currentSmartContract = await deployedContractStore.getDeployedContract(
      contractUuid.value
    );

    if (!currentSmartContract?.contract_uuid) {
      router.push({ name: 'dashboard-service-smart-contracts' });
    } else {
      deployedContractStore.active = currentSmartContract;
      initFunctions();
      pageLoading.value = false;
    }
  });
});

watch(
  () => contractStatus.value,
  () => {
    if (isContractTransferring.value) {
      checkUnfinishedSmartContracts();
    } else if (isContractTransferred.value) {
      refreshPage();
    }
  }
);

async function refreshPage() {
  await deployedContractStore.fetchDeployedContract(deployedContractStore.active.contract_uuid);
  initFunctions();
}

function initFunctions() {
  ownerFunctions.value = [];
  readFunctions.value = [];
  writeFunctions.value = [];

  const functionObjects = deployedContractStore.active?.contractVersion?.abi.filter(
    item => item.type === 'function'
  );

  // Initialize form models dynamically based on functionObjects
  functionObjects.forEach(fn => {
    if (fn.stateMutability === 'nonpayable' || fn.stateMutability === 'payable') {
      // Find the corresponding method in state.contractVersion.methods
      const method = deployedContractStore.active.contractVersion.methods.find(
        method => method.name === fn.name
      );

      if (method?.onlyOwner && !isContractTransferred.value) {
        ownerFunctions.value.push(fn);
      } else {
        writeFunctions.value.push(fn);
      }
    } else {
      readFunctions.value.push(fn);
    }
  });
}
</script>

<style lang="postcss" scoped>
:deep(.n-collapse-item__header-main) {
  justify-content: space-between;
}
:deep(.n-card > .n-card__content) {
  @apply p-4 pl-6;
}
:deep(.n-card.n-card--bordered) {
  @apply border-none;
}
:deep(.n-card .n-collapse-item__content-wrapper) {
  @apply mt-4;

  &::before {
    content: '';
    @apply absolute top-12 left-0 right-0 border-t border-bg-lighter;
  }
}
</style>
