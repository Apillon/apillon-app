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
                      <n-button type="primary" native-type="submit" @click="handleSubmit(fn.name)">
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
                      <n-button type="primary" native-type="submit" @click="handleSubmit(fn.name)">
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
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const router = useRouter();
const { params } = useRoute();
const { t } = useI18n();

useHead({
  title: t('dashboard.nav.smartContracts'),
});

const dataStore = useDataStore();
const smartContractsStore = useSmartContractsStore();

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
async function handleSubmit(methodName) {
  errors.value = {};
  formErrors.value = {};
  console.log(form[methodName]);

  if (!validate(form[methodName])) {
    formErrors.value[methodName] = true;
    return false;
  }

  try {
    const res = await $api.post(endpoints.querySmartContract(contractUuid.value), {
      methodName,
      methodArguments: Object.values(form[methodName]),
    });

    if (res.ok) {
      errors.value[methodName] = '';
      formRefs.value[methodName].reset();
    }
    console.log('pass');
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
</script>

<style lang="postcss" scoped>
.n-card.n-card--bordered {
  border: 1px solid #313442;
}
.error-input {
  border: 1px solid #ff6188;
}
</style>
