<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderSmartContractsSecondary />
      </div>
    </template>

    <slot>
      <div class="wallet-props">
        <span v-if="address" class="mr-4">{{ shortHash(address) }}</span>
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
      <div class="my-8">
        <div class="flex flex-col md:flex-row gap-x-8">
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
        <Btn type="primary" class="min-w-[12rem] mt-8" @click="disconnectWallet()">
          Take smart contract ownership
        </Btn>
      </div>

      <h4 class="mb-6">
        {{ $t('dashboard.service.smartContracts.functions.write') }}
      </h4>
      <div class="flex gap-x-4 max-w-[1200px]">
        <!-- wrtie functions -->
        <div class="bg-black p-2 w-2/3 rounded-lg">
          <div class="flex px-2 gap-3">
            <div class="flex-1">
              <h4 class="my-3">
                {{ $t('dashboard.service.smartContracts.functions.writeFromDapp') }}
              </h4>
              <template v-for="fn in writeFunctions" :key="fn">
                <!-- If function has any availablbe inouts create a form -->
                <template v-if="fn.inputs.length && !fn.onlyOwner">
                  <n-card size="small" class="my-1 max-w-lg mb-3">
                    <n-collapse accordion arrow-placement="right">
                      <n-collapse-item :title="fn.name">
                        <!-- Assign a fromref according to function ref - we have multiple form on same site -->
                        <n-form
                          :ref="el => (formRefs[fn.name] = el)"
                          :model="form[fn.name]"
                          class="max-w-lg"
                          @submit.prevent="handleSubmit"
                        >
                          <!-- Create inouts -->
                          <template v-for="i in fn.inputs" :key="i.name">
                            <n-form-item :label="i.name">
                              <n-input
                                v-model:value="form[fn.name][i.name]"
                                :maxlength="256"
                                required
                                :class="{
                                  'error-input': formErrors[fn.name],
                                }"
                              />
                            </n-form-item>
                          </template>
                          <!-- Submit -->
                          <n-button
                            v-if="needsWalletConnection(fn.onlyOwner)"
                            class="w-full text-yellow btn-connect bg-transparent"
                            type="secondary"
                            native-type="submit"
                            :loading="btnLoading"
                            @click="connectWallet"
                          >
                            Connect your wallet
                          </n-button>
                          <n-button
                            v-else
                            class="w-full"
                            type="primary"
                            native-type="submit"
                            :loading="btnLoading"
                            @click="handleSubmit(fn.name, 'write', fn.onlyOwner)"
                          >
                            Query
                          </n-button>
                          <!-- Error container for each form -->
                          <Notification v-if="errors[fn.name]" type="error" class="mt-6">
                            Something went wrong, please try again or try later.
                          </Notification>
                        </n-form>
                      </n-collapse-item>
                    </n-collapse>
                  </n-card>
                </template>
                <template v-else-if="!fn.onlyOwner">
                  <!-- If function doesnt have inputs avialble, just output function data -->
                  <n-card size="small" class="my-1 max-w-lg mb-3">
                    <n-collapse accordion arrow-placement="right">
                      <n-collapse-item :title="fn.name">
                        {{ fn.outputs[0]?.internalType }}
                      </n-collapse-item>
                    </n-collapse>
                  </n-card>
                </template>
              </template>
            </div>
            <div class="flex-1">
              <h4 class="my-3">
                {{ $t('dashboard.service.smartContracts.functions.writeOverApillon') }}
              </h4>
              <template v-for="fn in writeFunctions" :key="fn">
                <!-- If function has any availablbe inouts create a form -->
                <template v-if="fn.inputs.length && fn.onlyOwner">
                  <n-card size="small" class="my-1 max-w-lg mb-3">
                    <n-collapse accordion arrow-placement="right">
                      <n-collapse-item :title="fn.name">
                        <!-- Assign a fromref according to function ref - we have multiple form on same site -->
                        <n-form
                          :ref="el => (formRefs[fn.name] = el)"
                          :model="form[fn.name]"
                          class="max-w-lg"
                          @submit.prevent="handleSubmit"
                        >
                          <!-- Create inouts -->
                          <template v-for="i in fn.inputs" :key="i.name">
                            <n-form-item :label="i.name">
                              <n-input
                                v-model:value="form[fn.name][i.name]"
                                :maxlength="256"
                                required
                                :class="{
                                  'error-input': formErrors[fn.name],
                                }"
                              />
                            </n-form-item>
                          </template>
                          <!-- Submit -->
                          <n-button
                            v-if="needsWalletConnection(fn.onlyOwner)"
                            type="primary"
                            class="w-full"
                            native-type="submit"
                            :loading="btnLoading"
                            @click="connectWallet"
                          >
                            Connect your wallet
                          </n-button>
                          <n-button
                            v-else
                            type="primary"
                            class="w-full"
                            native-type="submit"
                            :loading="btnLoading"
                            @click="handleSubmit(fn.name, 'write', fn.onlyOwner)"
                          >
                            Query
                          </n-button>
                          <!-- Error container for each form -->
                          <Notification v-if="errors[fn.name]" type="error" class="mt-6">
                            Something went wrong, please try again or try later.
                          </Notification>
                        </n-form>
                      </n-collapse-item>
                    </n-collapse>
                  </n-card>
                </template>
                <template v-else-if="fn.onlyOwner">
                  <!-- If function doesnt have inputs avialble, just output function data -->
                  <n-card size="small" class="my-1 max-w-lg mb-3">
                    <n-collapse accordion arrow-placement="right">
                      <n-collapse-item :title="fn.name">
                        {{ fn.outputs[0]?.internalType }}
                      </n-collapse-item>
                    </n-collapse>
                  </n-card>
                </template>
              </template>
            </div>
          </div>
        </div>
        <!-- read functions -->
        <div class="w-1/3">
          <div class="px-3 py-2 rounded-lg bg-bg-lighter">
            <h4 class="my-3">
              {{ $t('dashboard.service.smartContracts.functions.readFromDapp') }}
            </h4>
            <template v-for="fn in readFunctions" :key="fn">
              <!-- If function has any availablbe inouts create a form -->
              <template v-if="fn.inputs.length">
                <n-card size="small" class="my-1 max-w-lg mb-3">
                  <n-collapse accordion arrow-placement="right">
                    <n-collapse-item :title="fn.name">
                      <!-- Assign a fromref according to function ref - we have multiple form on same site -->
                      <n-form
                        :ref="el => (formRefs[fn.name] = el)"
                        :model="form[fn.name]"
                        class="max-w-lg"
                        @submit.prevent="handleSubmit"
                      >
                        <!-- Create inouts -->
                        <template v-for="i in fn.inputs" :key="i.name">
                          <n-form-item :label="i.name">
                            <n-input
                              v-model:value="form[fn.name][i.name]"
                              :maxlength="256"
                              required
                              :class="{
                                'error-input': formErrors[fn.name],
                              }"
                            />
                          </n-form-item>
                        </template>
                        <!-- Submit -->
                        <n-button
                          type="primary"
                          native-type="submit"
                          class="w-full"
                          :loading="btnLoading"
                          @click="handleSubmit(fn.name, 'read', false)"
                        >
                          Query
                        </n-button>
                        <!-- Error container for each form -->
                        <Notification v-if="errors[fn.name]" type="error" class="mt-6">
                          Something went wrong, please try again or try later.
                        </Notification>
                        <Notification v-if="msgs[fn.name]" type="success" class="mt-6">
                          {{ msgs[fn.name] }}
                        </Notification>
                      </n-form>
                    </n-collapse-item>
                  </n-collapse>
                </n-card>
              </template>
              <template v-else>
                <!-- If function doesnt have inputs avialble, just output function data -->
                <n-card size="small" class="my-1 max-w-lg mb-3">
                  <n-collapse accordion arrow-placement="right">
                    <n-collapse-item :title="fn.name">
                      <div class="mb-4">{{ fn.outputs[0]?.internalType }}</div>
                      <n-button
                        type="primary"
                        native-type="submit"
                        class="w-full"
                        :loading="btnLoading"
                        @click="handleSubmit(fn.name, 'read', false)"
                      >
                        Query
                      </n-button>
                      <!-- Error container for each form -->
                      <Notification v-if="errors[fn.name]" type="error" class="mt-6">
                        Something went wrong, please try again or try later.
                      </Notification>
                      <Notification
                        v-if="msgs[fn.name]"
                        type="success"
                        class="mt-6"
                        v-html="msgs[fn.name]"
                      />
                    </n-collapse-item>
                  </n-collapse>
                </n-card>
              </template>
            </template>
          </div>
        </div>
      </div>
    </slot>

    <div
      v-if="activeTransactionsWindow"
      class="card-dark fixed right-0 bottom-0 w-[34rem] px-5 py-3 !border-yellow !rounded-none z-10 -mr-[1px] -mb-[1px]"
    >
      <n-space justify="space-between" align="center">
        <n-space justify="space-between" align="center">
          <button class="p-2" @click="transactionListExpanded = !transactionListExpanded">
            <span
              class="icon-down align-middle text-2xl"
              :class="[transactionListExpanded ? 'icon-down' : 'icon-up']"
            ></span>

            <strong>Transactions in progress</strong>
          </button>
        </n-space>
        <n-space align="center">
          <IconClose
            class="cursor-pointer"
            @click="activeTransactionsWindow = !activeTransactionsWindow"
          />
        </n-space>
      </n-space>
      <n-scrollbar v-if="transactionListExpanded" class="max-h-72 mt-4" y-scrollable>
        <div v-for="(response, methodName) in msgs" :key="methodName" class="method-container">
          <span>Method: {{ methodName }}</span>
          <div class="flex flex-row">
            <Notification type="success" class="mb-2">
              <span v-html="msgs[methodName]"></span>
            </Notification>
            <IconClose @click="removeMsg(methodName)" />
          </div>
        </div>
      </n-scrollbar>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { moonbaseAlpha, moonbeam, astar } from 'viem/chains';

import { useAccount, useConnect, useWalletClient, useDisconnect } from 'use-wagmi';
const { connect, connectors } = useConnect();
const { disconnect } = useDisconnect();
const { refetch: refetchWalletClient } = useWalletClient();
const { isConnected } = useAccount({ onConnect: onWalletConnected });
const { address } = useAccount();

const router = useRouter();
const { params } = useRoute();
const { t } = useI18n();

useHead({
  title: t('dashboard.nav.smartContracts'),
});

const dataStore = useDataStore();
const smartContractsStore = useSmartContractsStore();
const { astarShibuya } = useSmartContracts();

const activeTransactions = ref({});
const activeTransactionsWindow = ref<boolean>(true);
const transactionListExpanded = ref<boolean>(true);
const pageLoading = ref<boolean>(true);
const contractUuid = ref<string>(`${params?.id}` || '');
const contractStatus = computed(() => smartContractsStore.active.contractStatus);

// Data
const functionObjects = ref([]);
const writeFunctions = ref([]);
const readFunctions = ref([]);

const form = reactive({});
const formRefs = ref({});
const errors = ref({});
const formErrors = ref({});
const msgs = ref({});
const btnLoading = ref(false);

function removeMsg(methodName) {
  delete msgs.value[methodName];
}

function needsWalletConnection(onlyOwner) {
  if ((!onlyOwner && !isConnected.value) || (!isConnected.value && contractStatus.value === 6))
    return true;
  return false;
}

async function onWalletConnected() {
  await sleep(200);
  if (btnLoading.value) {
    btnLoading.value = false;
  }
}

async function connectWallet() {
  if (!isConnected.value) {
    await wagmiConnect(connectors.value[0]);
  }
}

function disconnectWallet() {
  disconnect();
}

function wagmiConnect(connector) {
  if (isConnected.value) {
    refetchWalletClient();
  } else if (connector.ready) {
    connect({ connector });
  }
}

function shortHash(val: string) {
  if (!val || val.length <= 10) {
    return val;
  }
  return `${val.slice(0, 6)}...${val.slice(-4)}`;
}

function validate(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === null || obj[key] === '') {
        return false; // Fail validation
      }
    }
  }
  return true;
}

// Submit
function handleSubmit(methodName, method, onlyOwner) {
  btnLoading.value = true;
  errors.value = {};
  formErrors.value = {};

  if (!validate(form[methodName])) {
    formErrors.value[methodName] = true;
    btnLoading.value = false;
    return false;
  }
  activeTransactionsWindow.value = true;
  msgs.value[methodName] = null;
  if (method === 'write') {
    if (!onlyOwner || contractStatus.value === 6) {
      execWalletWrite(methodName);
    } else {
      execOwnerWrite(methodName);
    }
  } else {
    execRead(methodName);
  }
}

async function execWalletWrite(methodName) {
  const contractAddress = smartContractsStore.active.contractAddress;
  const abi = smartContractsStore.active.contractVersion.abi;
  const chainId = smartContractsStore.active.chain;
  let response;

  const chainConfig = getChainConfig(chainId);

  const client = createWalletClient({
    chain: chainConfig,
    transport: custom(window.ethereum), // Connect to the wallet via MetaMask or similar
  });

  try {
    response = await client.writeContract({
      address: contractAddress,
      abi,
      functionName: methodName,
      args: Object.values(form[methodName]),
      account: address.value,
    });
    msgs.value[methodName] = response;
  } catch (e) {
    console.log(e);
    errors.value[methodName] = 'Something went wrong. Please try again.';
  } finally {
    btnLoading.value = false;
  }

  btnLoading.value = false;
}

// read functions handler
async function execRead(methodName) {
  const contractAddress = smartContractsStore.active.contractAddress;
  const abi = smartContractsStore.active.contractVersion.abi;
  const chainId = smartContractsStore.active.chain;
  let response;

  const chainConfig = getChainConfig(chainId);

  const client = createPublicClient({
    chain: chainConfig,
    transport: http(),
  });

  try {
    response = await client.readContract({
      address: contractAddress,
      abi,
      functionName: methodName,
      args: Object.values(form[methodName]),
    });

    msgs.value[methodName] = response;
  } catch (error) {
    console.log(e);
    errors.value[methodName] = 'Something went wrong. Please try again.';
  } finally {
    btnLoading.value = false;
  }
}

// write functions handler
async function execOwnerWrite(methodName) {
  try {
    const res = await $api.post(endpoints.querySmartContract(contractUuid.value), {
      methodName,
      methodArguments: Object.values(form[methodName]),
    });

    if (res.ok) {
      errors.value[methodName] = '';
      formRefs.value[methodName].reset();
    }
    msgs.value[methodName] = response;
  } catch (e) {
    console.log(e);
    errors.value[methodName] = 'Something went wrong. Please try again.';
  } finally {
    btnLoading.value = false;
  }
}

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    const currentSmartContract = await smartContractsStore.getDeployedSmartContract(
      contractUuid.value
    );

    if (!currentSmartContract?.contract_uuid) {
      router.push({ name: 'dashboard-service-smart-contracts' });
    } else {
      smartContractsStore.active = currentSmartContract;

      functionObjects.value = smartContractsStore.active.contractVersion.abi.filter(
        item => item.type === 'function'
      );

      // Initialize form models dynamically based on functionObjects
      functionObjects.value.forEach(fn => {
        form[fn.name] = {};

        fn.inputs.forEach(input => {
          form[fn.name][input.name] = null; // Initialize each input field
        });

        if (fn.stateMutability === 'nonpayable' || fn.stateMutability === 'payable') {
          // Find the corresponding method in state.contractVersion.methods
          const method = smartContractsStore.active.contractVersion.methods.find(
            method => method.name === fn.name
          );
          // Add the method to writeFunctions and tag it with onlyOwner if applicable
          writeFunctions.value.push({
            ...fn, // Spread the function properties
            onlyOwner: method ? method.onlyOwner : false, // Add onlyOwner property
          });
        } else {
          readFunctions.value.push(fn);
        }
      });

      pageLoading.value = false;
    }
  });
});

function getChainConfig(chainId) {
  switch (chainId) {
    case moonbaseAlpha.id:
      return moonbaseAlpha;
    case moonbeam.id:
      return moonbeam;
    case astar.id:
      return astar;
    case astarShibuya.id:
      return astarShibuya;
  }
}
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
.error-input {
  border: 1px solid #ff6188;
}
.btn-connect {
  border: 1px solid #1e212b;
}
</style>
