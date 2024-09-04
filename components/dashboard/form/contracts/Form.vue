<template>
  <n-form
    ref="formRef"
    :model="form"
    :class="{ 'form-errors': formErrors }"
    :rules="rules"
    class="max-w-lg mx-auto my-10"
    @submit.prevent="handleSubmit"
  >
    <!-- general fields -->
    <!-- name -->
    <n-form-item label="Name" path="name">
      <n-input v-model:value="form.name" :maxlength="256" required />
    </n-form-item>

    <!-- description -->
    <n-form-item label="Description" path="description">
      <n-input v-model:value="form.description" :maxlength="256" required />
    </n-form-item>
    <!-- chainId -->
    <n-form-item :span="6" :label-props="{ for: 'chainId' }" label="Select Chain" path="chain">
      <select-options
        v-model:value="form.chain"
        :options="chainOptions"
        :input-props="{ id: 'chainId' }"
        placeholder="please select"
        required
        clearable
      />
    </n-form-item>

    <!-- dynamic fields -->
    <div v-for="input in constructorInputs" :key="input.name">
      <template v-if="input.type === 'tuple'">
        <div v-for="i in input.components" :key="i">
          <!-- string -->
          <n-form-item :label="i.name" :path="i.name">
            <n-input
              v-if="i.type === 'string'"
              v-model:value="form[i.name]"
              :maxlength="256"
              required
            />
            <!-- 0x address -->
            <n-input
              v-if="i.type === 'address'"
              v-model:value="form[i.name]"
              :maxlength="256"
              required
            />
            <!-- number -->
            <n-input-number
              v-else-if="i.type.includes('uint')"
              v-model:value="form[i.name]"
              :min="0"
              required
            />
          </n-form-item>
        </div>
      </template>
      <n-form-item v-else :label="input.name" :path="input.name">
        <template v-if="!isSpecialField(input)">
          <!-- string -->
          <n-input
            v-if="input.type === 'string'"
            v-model:value="form[input.name]"
            :maxlength="256"
            required
          />
          <!-- 0x address -->
          <n-input
            v-if="input.type === 'address'"
            v-model:value="form[input.name]"
            :maxlength="256"
            required
          />
          <!-- boolean options array -->
          <template v-else-if="input.type === 'bool[]'">
            <div>
              <div>
                <n-form-item
                  v-for="(value, index) in settings"
                  :key="index"
                  :span="1"
                  :show-label="false"
                >
                  <n-checkbox
                    v-model:checked="settings[index]"
                    size="medium"
                    :label="`option ${index + 1}`"
                  />
                </n-form-item>
              </div>
              <div>
                <n-button v-if="settings.length < 4" type="secondary" @click="addSettingsOption">
                  Add a settings option
                </n-button>
              </div>
            </div>
          </template>

          <!-- number -->
          <n-input-number
            v-else-if="input.type.includes('uint')"
            v-model:value="form[input.name]"
            :min="0"
            required
          />
        </template>

        <n-date-picker
          v-else-if="input.name === '_dropStart'"
          v-model:value="form[input.name]"
          type="datetime"
          required
          clearable
          :is-date-disabled="disablePastDate"
          :is-time-disabled="disablePastTime"
        />
      </n-form-item>
    </div>
    <n-button type="primary" native-type="submit" @click="handleSubmit">Submit</n-button>
    <Notification v-if="submitError" type="error" class="mt-6">
      Something went wrong, please try again or try later.
    </Notification>
  </n-form>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { NForm, NFormItem, NInput, NButton, NDatePicker } from 'naive-ui';

const smartContractsStore = useSmartContractsStore();
const dataStore = useDataStore();
const message = useMessage();
const router = useRouter();
const $i18n = useI18n();

const {
  formRef,
  form,
  settings,
  addSettingsOption,
  disablePastDate,
  disablePastTime,
  isSpecialField,
} = useSmartContracts();
const smartContractDetails = ref<any | null>(null);

const formErrors = ref<boolean>(false);
const submitError = ref<boolean>(false);
const tupleInputs = ref([]);

const chainOptions = [
  { label: 'Moonbase', value: 1287 },
  { label: 'Moonbeam', value: 1284 },
  { label: 'Astar_Shibuya', value: 81 },
  { label: 'Astar', value: 592 },
];

const rules = reactive({
  name: [{ required: true, message: 'Name is required' }],
  description: [{ required: true, message: 'Description is required' }],
  chain: [{ required: true, message: 'Chain selection is required' }],
});

onMounted(() => {
  initForm();
  initializeDynamicValidation();
});

function initForm() {
  // Initialize form fields from abi constructor
  smartContractDetails.value = smartContractsStore.getContractDetails;
  if (smartContractDetails.value) {
    const constructorInputs = getConstructorInputs(smartContractDetails.value);
    constructorInputs.forEach((input: any) => {
      if (input.type === 'tuple') {
        input.components.forEach((i: any) => {
          form.value[i.name] = null;
        });
      } else {
        form.value[input.name] = null;
      }
    });
  }
}

// Dynamic fields from abi cosntructor
const getConstructorInputs = (contractDetails: any) => {
  const abi = contractDetails.contractVersion?.abi || [];
  const constructor = abi.find((item: any) => item.type === 'constructor');
  return constructor ? constructor.inputs : [];
};

const constructorInputs = computed(() => {
  if (!smartContractDetails.value) return [];
  return getConstructorInputs(smartContractDetails.value);
});

// Dynamic validation
// Initialize dynamic validation rules
function initializeDynamicValidation() {
  constructorInputs.value.forEach((input: any) => {
    if (input.type === 'tuple') {
      input.components.forEach((i: any) => {
        addDynamicValidation(i);
        tupleInputs.value.push(i.name);
      });
    } else {
      addDynamicValidation(input);
    }
  });
}
// Add dynamic validation rules
function addDynamicValidation(input: any) {
  // String
  if (input.type === 'string') {
    rules[input.name] = [{ required: true, message: `${input.name} is required` }];
  }
  // Address
  else if (input.type === 'address') {
    rules[input.name] = [
      { required: true, message: `${input.name} is required` },
      { validator: addressValidator, trigger: 'blur' },
    ];
  }
  // uint logic
  else if (input.type.includes('uint')) {
    if (input.name === '_reserve' || input.name === '_maxSupply') {
      rules[input.name] = [
        { required: true, message: `${input.name} is required` },
        { validator: integerValidator },
      ];
    } else if (input.name === '_royaltiesFees') {
      rules[input.name] = [
        { required: true, message: `${input.name} is required` },
        { validator: maxValidator(100), trigger: 'blur' },
      ];
    } else {
      rules[input.name] = [{ required: true, message: `${input.name} is required` }];
    }
  } else if (input.name === '_dropStart') {
    rules[input.name] = [{ required: true, message: 'Start date is required' }];
  }
  // else if (input.type === 'bool[]') {
  //   rules[input.name] = [{ required: true, message: `${input.name} is required` }];
  // }
}

// Custom validator to check for integer values
function integerValidator(rule: any, value: any, callback: (error?: Error) => void) {
  if (!Number.isInteger(value)) {
    callback(new Error('The value must be an integer'));
  } else {
    callback();
  }
}

const maxValidator = max => (rule, value, callback) => {
  if (value > max) {
    callback(new Error(`Value must not exceed ${max}`));
  } else {
    callback();
  }
};

const addressValidator = (rule, value, callback) => {
  // Regular expression to match 0x-prefixed address
  const addressPattern = /^0x[a-fA-F0-9]{40}$/;
  if (!addressPattern.test(value)) {
    callback(
      new Error('Address must be a valid 0x-prefixed hexadecimal string with 40 characters.')
    );
  } else {
    callback();
  }
};

// Watch for changes in constructorInputs to update validation rules
watch(
  constructorInputs,
  newInputs => {
    newInputs.forEach((input: any) => addDynamicValidation(input));
  },
  { deep: true, immediate: true }
);

// submit&deploy

function handleSubmit(e: Event | MouseEvent) {
  submitError.value = false;
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<any> | undefined) => {
    formErrors.value = !!errors;
    if (errors) return;

    await deployContract();
  });
}

async function deployContract() {
  const _projectUuid = dataStore.currentProject?.project_uuid;
  const _contractUuid = smartContractsStore.getContractDetails.contract_uuid;

  const constructorArguments = [];

  // THIS IS HARDCODED TO HANDLE NETSABLE ERC-721 TUPLE
  const accumulatedKeys = ['royaltyRecipient', 'royaltyPercentageBps', 'maxSupply', 'pricePerMint'];
  const accumulatedArray = [];

  for (const key in form.value) {
    if (form.value.hasOwnProperty(key)) {
      if (key !== 'Name' && key !== 'description' && key !== 'chain') {
        if (key === '_settings') {
          constructorArguments.push(settings.value);
        } else if (accumulatedKeys.includes(key)) {
          accumulatedArray.push(form.value[key]);
        } else {
          constructorArguments.push(form.value[key]);
        }
      }
    }
  }

  // After the loop, push the accumulated array if it has values
  if (accumulatedArray.length > 0) {
    constructorArguments.push(accumulatedArray);
  }

  try {
    const res = await $api.post(endpoints.newSmartContract(_contractUuid), {
      project_uuid: _projectUuid,
      name: form.value.name,
      description: form.value.description,
      chain: form.value.chain,
      contract_uuid: _contractUuid,
      constructorArguments,
    });

    if (res.data) {
      message.success($i18n.t('form.success.smartContract'));
      router.push(`/dashboard/service/smart-contracts`);
    }
  } catch (e) {
    console.log(e);
    message.error(userFriendlyMsg(error));
    submitError.value = true;
  }
}
</script>
