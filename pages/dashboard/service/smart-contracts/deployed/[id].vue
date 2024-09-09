<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContractsSecondary />
    </template>

    <slot>
      <div class="wallet-props">
        <span v-if="address" class="mr-4">Connected wallet: {{ shortHash(address) }}</span>
        <Btn
          v-if="isConnected"
          type="primary"
          class="min-w-[12rem]"
          :loading="btnLoading"
          @click="disconnectWallet()"
        >
          Disconnect
        </Btn>
      </div>
      <div v-if="contractStatus !== 6" class="my-8">
        <div class="flex flex-col md:flex-row gap-x-8 mb-8">
          <div class="flex-1 max-w-[550px]">
            <h4>
              {{ $t('dashboard.service.smartContracts.infoSection.title') }}
            </h4>
            <p class="">{{ $t('dashboard.service.smartContracts.infoSection.p') }}</p>
            <div class="flex border border-bg-lighter p-4 mt-4">
              <span class="icon-info mr-2"></span>
              <p>{{ $t('dashboard.service.smartContracts.infoSection.infoBox') }}</p>
            </div>
          </div>
          <div class="flex-1">
            <img src="~/assets/images/solution/smart-contracts.png" alt="" />
          </div>
        </div>

        <Btn href="#transferOwnership">Take smart contract ownership</Btn>
      </div>

      <h4 class="mb-6">
        {{ $t('dashboard.service.smartContracts.functions.write') }}
      </h4>
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
                :key="fn"
                :id="fn.name"
                size="small"
                class="my-1 max-w-lg mb-3"
              >
                <n-collapse accordion arrow-placement="right">
                  <n-collapse-item :title="fn.name">
                    <!-- Assign a form ref according to function ref - we have multiple form on same site -->
                    <FormSmartContractAction :fn="fn" />
                  </n-collapse-item>
                </n-collapse>
              </n-card>
            </div>
            <div class="flex-1">
              <h4 v-if="contractStatus !== 6" class="my-3">
                {{ $t('dashboard.service.smartContracts.functions.writeOverApillon') }}
              </h4>
              <h4 v-else class="my-3">
                <br />
              </h4>
              <n-card
                v-for="fn in ownerFunctions"
                :key="fn"
                :id="fn.name"
                size="small"
                class="my-1 max-w-lg mb-3"
              >
                <n-collapse accordion arrow-placement="right">
                  <n-collapse-item :title="fn.name">
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
                <n-collapse-item :title="fn.name">
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

const { disconnect } = useDisconnect();
const { isConnected } = useAccount({ onConnect: onWalletConnected });
const { address } = useAccount();

const { t } = useI18n();
const router = useRouter();
const { params } = useRoute();
const dataStore = useDataStore();
const deployedContractStore = useDeployedContractStore();

useHead({
  title: t('dashboard.nav.smartContracts'),
});

const pageLoading = ref<boolean>(true);
const btnLoading = ref<boolean>(false);
const contractUuid = ref<string>(`${params?.id}` || '');
const contractStatus = computed(() => deployedContractStore.active.contractStatus);

// Data
const ownerFunctions = ref<SmartContractABI[]>([]);
const readFunctions = ref<SmartContractABI[]>([]);
const writeFunctions = ref<SmartContractABI[]>([]);
const hasDappMethods = ref(false); // serves as UI signal to hide or display dapp methods

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

          if (method?.onlyOwner) {
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
