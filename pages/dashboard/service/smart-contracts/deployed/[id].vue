<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContract>
        <template #title>
          <div>
            <h1>
              {{ deployedContractStore.active.name }}
              <small class="ml-2 text-sm text-body">
                {{
                  t(
                    `dashboard.service.smartContracts.type.${deployedContractStore.active.contractVersion.contract.contractType}`
                  )
                }}
              </small>
              <small class="ml-2 text-sm text-body">
                {{ t(`nft.chain.${deployedContractStore.active.chain}`) }}
              </small>
            </h1>
            <TableLink
              class="text-sm"
              :prefix="t('smartContracts.table.contractAddress')"
              :text="deployedContractStore.active.contractAddress"
              :link="contractLink(deployedContractStore.active.contractAddress, deployedContractStore.active.chain)"
            />
          </div>
        </template>
        <slot>
          <div v-if="isConnected" class="flex h-10 items-center gap-2 rounded-xl bg-bg-lighter px-3 text-sm">
            <p class="text-bodyDark">{{ truncateWallet(`${address}`) }}</p>
            <hr class="h-full w-[1px] border-bg bg-bg" />
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
        <div class="mb-8 flex flex-col gap-x-8 md:flex-row">
          <div class="max-w-[550px] flex-1">
            <h4>
              {{ $t('smartContracts.infoSection.title') }}
            </h4>
            <p class="">{{ $t('smartContracts.infoSection.p') }}</p>
            <div class="mt-4 flex border border-bg-lighter p-4">
              <span class="icon-info mr-2"></span>
              <p v-if="isContractTransferred">
                {{ $t('smartContracts.infoSection.infoTransferred') }}
              </p>
              <p v-else>
                {{ $t('smartContracts.infoSection.info') }}
              </p>
            </div>
          </div>
          <div class="flex-1">
            <img src="~/assets/images/solution/smart-contracts.png" alt="" />
          </div>
        </div>
        <Btn v-if="isContractTransferring" class="w-full max-w-xs" :disabled="true">
          <span class="flex items-center gap-2">
            <AnimationTyping />
            {{ SmartContractStatus[contractStatus] }}
          </span>
        </Btn>
        <FormSmartContractAction
          v-else-if="isConnected && !isContractTransferred && fnTransferOwnership"
          class="max-w-sm"
          :fn="fnTransferOwnership"
          :args="[address as string]"
          :btn-text="$t('smartContracts.infoSection.takeOwnershipBtn')"
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
          :btn-text="$t('smartContracts.infoSection.takeOwnershipBtn') + ' renounce'"
          owner
        />
        <SmartContractsBtnSubmit v-else-if="!isConnected" size="small" />
      </div>

      <div class="mb-4 mt-8 flex flex-wrap gap-4 border-t border-bg-lighter pt-8 sm:flex-nowrap">
        <div
          class="h-full"
          :class="
            ownerFunctions?.length && writeFunctions?.length
              ? 'w-full max-w-[840px] sm:w-1/2 lg:w-2/3'
              : 'w-full max-w-[420px] sm:w-1/2 lg:w-1/3'
          "
        >
          <h2 class="mb-6">
            {{ $t('smartContracts.functions.write') }}
          </h2>
          <div class="flex h-full flex-wrap gap-x-4 rounded-lg bg-black lg:flex-nowrap">
            <SmartContractsPanelFunctions
              v-if="ownerFunctions?.length"
              :functions="ownerFunctions"
              :title="$t('smartContracts.functions.writeOverApillon')"
              owner
            />
            <SmartContractsPanelFunctions
              v-if="writeFunctions?.length"
              :functions="writeFunctions"
              :title="$t('smartContracts.functions.writeFromDapp')"
            />
          </div>
        </div>
        <div class="w-full sm:w-1/2 lg:w-1/3">
          <h2 class="mb-6">
            {{ $t('smartContracts.functions.read') }}
          </h2>

          <SmartContractsPanelFunctions
            bg-class="bg-bg-lighter"
            :functions="readFunctions"
            :title="$t('smartContracts.functions.readFromDapp')"
            read
          />
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useAccount, useAccountEffect, useDisconnect } from '@wagmi/vue';
import { contractLink } from '~/lib/utils/helpers';
import { truncateWallet } from '~/lib/utils/strings';
import { SmartContractStatus } from '~/lib/types/smartContracts';

const { t } = useI18n();
const router = useRouter();
const { params } = useRoute();
const dataStore = useDataStore();
const deployedContractStore = useDeployedContractStore();
const { checkUnfinishedSmartContracts } = useSmartContracts();

const { address } = useAccount();
const { disconnect } = useDisconnect();
const { isConnected } = useAccount();
useAccountEffect({ onConnect: onWalletConnected });

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
const isContractTransferring = computed(() => contractStatus.value === SmartContractStatus.TRANSFERRING);
const isContractTransferred = computed(() => contractStatus.value === SmartContractStatus.TRANSFERRED);

const fnTransferOwnership = computed(() => ownerFunctions.value.find(method => method.name === 'transferOwnership'));
const fnRenounceRole = computed(() => ownerFunctions.value.find(method => method.name === 'renounceRole'));

async function onWalletConnected() {
  await sleep(200);
  if (btnLoading.value) {
    btnLoading.value = false;
  }
}

function disconnectWallet() {
  disconnect();
}

onMounted(async () => {
  await dataStore.waitOnPromises();

  const currentSmartContract = await deployedContractStore.getDeployedContract(contractUuid.value);
  if (!currentSmartContract?.contract_uuid) {
    router.push({ name: 'dashboard-service-smart-contracts' });
  } else {
    deployedContractStore.active = currentSmartContract;
    initFunctions();
    pageLoading.value = false;
  }
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

  const functionObjects = deployedContractStore.active?.contractVersion?.abi.filter(item => item.type === 'function');

  // Initialize form models dynamically based on functionObjects
  functionObjects.forEach(fn => {
    if (fn.stateMutability === 'nonpayable' || fn.stateMutability === 'payable') {
      // Find the corresponding method in state.contractVersion.methods
      const method = deployedContractStore.active.contractVersion.methods.find(method => method.name === fn.name);

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
