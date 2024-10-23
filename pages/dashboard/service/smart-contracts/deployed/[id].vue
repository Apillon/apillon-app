<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContract :title="deployedContractStore.active.name">
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
        <FormSmartContractAction
          v-if="isConnected && !isContractTransferred && fnTransferOwnership"
          class="max-w-sm"
          :fn="fnTransferOwnership"
          :args="[address as string]"
          :btn-text="$t('dashboard.service.smartContracts.infoSection.takeOwnershipBtn')"
          owner
        />
      </div>

      <div class="flex gap-x-4 border-t border-bg-lighter mt-8 pt-8 mb-4">
        <div
          class="p-2 rounded-lg h-full"
          :class="hasDappMethods ? 'w-2/3 max-w-[840px]' : 'w-1/3 max-w-[420px]'"
        >
          <h2>
            {{ $t('dashboard.service.smartContracts.functions.write') }}
          </h2>
        </div>
        <div class="w-1/3 max-w-[420px]">
          <h2>
            {{ $t('dashboard.service.smartContracts.functions.read') }}
          </h2>
        </div>
      </div>

      <div class="flex gap-x-4 mb-6">
        <!-- write functions -->
        <div
          class="bg-black p-2 rounded-lg h-full"
          :class="hasDappMethods ? 'w-2/3 max-w-[840px]' : 'w-1/3 max-w-[420px]'"
        >
          <div class="flex px-2 gap-3">
            <div v-if="hasDappMethods" class="flex-1">
              <h4 class="my-3">
                {{ $t('dashboard.service.smartContracts.functions.writeFromDapp') }}
              </h4>
              <n-card
                v-for="fn in writeFunctions"
                :key="fn.name"
                :id="fn.name"
                size="small"
                class="my-1 max-w-lg mb-3"
              >
                <n-collapse accordion arrow-placement="right">
                  <n-collapse-item :title="labelInfoText(fn.name, fn?.description)">
                    <!-- Assign a form ref according to function ref - we have multiple form on same site -->
                    <FormSmartContractAction :fn="fn" />
                  </n-collapse-item>
                </n-collapse>
              </n-card>
            </div>
            <div class="flex-1">
              <h4 class="my-3">
                {{ $t('dashboard.service.smartContracts.functions.writeOverApillon') }}
              </h4>
              <n-card
                v-for="(fn, key) in ownerFunctions"
                :key="key"
                :id="fn.name"
                size="small"
                class="my-1 max-w-lg mb-3"
              >
                <n-collapse accordion arrow-placement="right">
                  <n-collapse-item :title="labelInfoText(fn.name, fn?.description)">
                    <!-- Assign a form ref according to function ref - we have multiple form on same site -->
                    <FormSmartContractAction :fn="fn" owner />
                  </n-collapse-item>
                </n-collapse>
              </n-card>
            </div>
          </div>
        </div>
        <!-- read functions -->
        <div class="w-1/3 max-w-[420px]">
          <div class="px-3 py-2 rounded-lg bg-bg-lighter">
            <h4 class="my-3">
              {{ $t('dashboard.service.smartContracts.functions.readFromDapp') }}
            </h4>
            <n-card v-for="fn in readFunctions" :key="fn" size="small" class="my-1 max-w-lg mb-3">
              <n-collapse accordion arrow-placement="right">
                <n-collapse-item :title="labelInfoText(fn.name, fn?.description)">
                  <!-- Assign a form ref according to function ref - we have multiple form on same site -->
                  <FormSmartContractAction :fn="fn" read />
                </n-collapse-item>
              </n-collapse>
            </n-card>
          </div>
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

const { address } = useAccount();
const { disconnect } = useDisconnect();
const { isConnected } = useAccount({ onConnect: onWalletConnected });
const { labelInfoText } = useComputing();

useHead({
  title: t('dashboard.nav.smartContracts'),
});

const pageLoading = ref<boolean>(true);
const btnLoading = ref<boolean>(false);
const contractUuid = ref<string>(`${params?.id}` || '');
const contractStatus = computed(() => deployedContractStore.active.contractStatus);
const isContractTransferred = computed(
  () => contractStatus.value === SmartContractStatus.TRANSFERRED
);

// Data
const ownerFunctions = ref<SmartContractABI[]>([]);
const readFunctions = ref<SmartContractABI[]>([]);
const writeFunctions = ref<SmartContractABI[]>([]);
const hasDappMethods = ref(false); // serves as UI signal to hide or display dapp methods

const fnTransferOwnership = computed(() =>
  ownerFunctions.value.find(method => method.name === 'transferOwnership')
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
            hasDappMethods.value = true;
          }
        } else {
          readFunctions.value.push(fn);
        }
      });

      pageLoading.value = false;
    }
  });
});
</script>

<style lang="postcss" scoped>
:deep(.n-collapse .n-collapse-item .n-collapse-item__header .n-collapse-item__header-main) {
  justify-content: space-between;
}
:deep(.n-card > .n-card__content, .n-card > .n-card__footer) {
  padding: 0;
  padding: 16px 16px 16px 24px;
}
:deep(.n-card.n-card--bordered) {
  border: 0px solid transparent !important;
}
.n-card.n-card--bordered {
  border: 1px solid #313442;
}
</style>
