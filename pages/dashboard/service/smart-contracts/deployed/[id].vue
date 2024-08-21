<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderSmartContractsSecondary />
      </div>
    </template>

    <slot>
      <div class="flex">
        <!-- wrtie functions -->
        <div class="p-2 w-full max-w-lg">
          <template v-for="fn in writeFunctions" :key="fn">
            <!-- If function has any availablbe inouts create a form -->
            <template v-if="fn.inputs.length">
              <n-card size="small" class="my-1 max-w-lg">
                <n-collapse accordion>
                  <n-collapse-item :title="fn.name">
                    <!-- Assign a fromref according to function ref - we have multiple form on same site -->
                    <template #header-extra>
                      <n-tag size="small" type="warning" round>
                        <span class="text-orange"> {{ fn.onlyOwner }}</span>
                      </n-tag>
                    </template>

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
            <template v-else>
              <!-- If function doesnt have inputs avialble, just output function data -->
              <n-card size="small" class="my-1 max-w-lg">
                <n-collapse accordion>
                  <n-collapse-item :title="fn.name">
                    {{ fn.outputs[0]?.internalType }}
                  </n-collapse-item>
                </n-collapse>
              </n-card>
            </template>
          </template>
        </div>
        <!-- read functions -->
        <div class="bg-black p-2 w-full max-w-lg rounded-lg">
          <template v-for="fn in readFunctions" :key="fn">
            <!-- If function has any availablbe inouts create a form -->
            <template v-if="fn.inputs.length">
              <n-card size="small" class="my-1 max-w-lg">
                <n-collapse accordion>
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
              <n-card size="small" class="my-1 max-w-lg">
                <n-collapse accordion>
                  <n-collapse-item :title="fn.name">
                    {{ fn.outputs[0]?.internalType }}
                  </n-collapse-item>
                </n-collapse>
              </n-card>
            </template>
          </template>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { createPublicClient, http, formatUnits } from 'viem';
import { moonbaseAlpha, moonbeam, astar } from 'viem/chains';

const router = useRouter();
const { params } = useRoute();
const { t } = useI18n();

useHead({
  title: t('dashboard.nav.smartContracts'),
});

const dataStore = useDataStore();
const smartContractsStore = useSmartContractsStore();
const { astarShibuya } = useSmartContracts();

const pageLoading = ref<boolean>(true);
const contractUuid = ref<string>(`${params?.id}` || '');

// Data
const functionObjects = ref([]);
const writeFunctions = ref([]);
const readFunctions = ref([]);

const form = reactive({});
const formRefs = ref({});
const errors = ref({});
const formErrors = ref({});
const msgs = ref({});

const chains = {};

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
  errors.value = {};
  msgs.value = {};
  formErrors.value = {};

  if (!validate(form[methodName])) {
    formErrors.value[methodName] = true;
    return false;
  }
  if (method === 'write') {
    if (onlyOwner) {
      execOwnerWrite(methodName);
    } else {
      execWrite(methodName);
    }
  } else {
    execRead(methodName);
  }
}

async function execOwnerWrite(methodName) {}

// read functions handler
async function execRead(methodName) {
  const contractAddress = smartContractsStore.active.contractAddress;
  const chainId = smartContractsStore.active.chain;
  const abi = smartContractsStore.active.contractVersion.abi;
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
  }
}

// write functions handler
async function execWrite(methodName) {
  try {
    const res = await $api.post(endpoints.querySmartContract(contractUuid.value), {
      methodName,
      methodArguments: Object.values(form[methodName]),
    });

    if (res.ok) {
      errors.value[methodName] = '';
      formRefs.value[methodName].reset();
    }
  } catch (e) {
    console.log(e);
    errors.value[methodName] = 'Something went wrong. Please try again.';
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
.n-card.n-card--bordered {
  border: 1px solid #313442;
}
.error-input {
  border: 1px solid #ff6188;
}
</style>
