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
    <n-form-item
      v-for="input in constructorInputs"
      :key="input.name"
      :label="input.name"
      :path="input.name"
    >
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
              <n-form-item v-for="(s, index) in settings" :span="1" :show-label="false">
                <n-checkbox
                  v-model:value="form[input.name]"
                  size="medium"
                  :label="`option ${index + 1}`"
                />
              </n-form-item>
            </div>
            <!-- add a bool option -->
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
    <n-button type="primary" native-type="submit" @click="handleSubmit">Submit</n-button>
  </n-form>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { NForm, NFormItem, NInput, NButton, NDatePicker } from 'naive-ui';

const smartContractsStore = useSmartContractsStore();
const dataStore = useDataStore();

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
const chainOptions = [{ label: '1287', value: 1287 }];

const rules = reactive({
  //   name: [{ required: true, message: 'Name is required' }],
  //   description: [{ required: true, message: 'Description is required' }],
  //   chain: [{ required: true, message: 'Chain selection is required' }],
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
      form.value[input.name] = null;
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
  constructorInputs.value.forEach((input: any) => addDynamicValidation(input));
}
// Add dynamic validation rules
function addDynamicValidation(input: any) {
  // String
  //   if (input.type === 'string') {
  //     rules[input.name] = [{ required: true, message: `${input.name} is required` }];
  //   }
  //   // Address
  //   else if (input.type === 'address') {
  //     rules[input.name] = [
  //       { required: true, message: `${input.name} is required` },
  //       { validator: addressValidator, trigger: 'blur' },
  //     ];
  //   }
  //   // uint logic
  //   else if (input.type.includes('uint')) {
  //     if (input.name === '_reserve' || input.name === '_maxSupply') {
  //       rules[input.name] = [
  //         { required: true, message: `${input.name} is required` },
  //         { validator: integerValidator },
  //       ];
  //     } else if (input.name === '_royaltiesFees') {
  //       rules[input.name] = [
  //         { required: true, message: `${input.name} is required` },
  //         { validator: maxValidator(100), trigger: 'blur' },
  //       ];
  //     } else {
  //       rules[input.name] = [{ required: true, message: `${input.name} is required` }];
  //     }
  //   } else if (input.name === '_dropStart') {
  //     rules[input.name] = [{ required: true, message: 'Start date is required' }];
  //   }
  //   else if (input.type === 'bool[]') {
  //     rules[input.name] = [{ required: true, message: `${input.name} is required` }];
  //   }
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
// watch(
//   constructorInputs,
//   newInputs => {
//     newInputs.forEach((input: any) => addDynamicValidation(input));
//   },
//   { deep: true, immediate: true }
// );

// submit&deploy

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<any> | undefined) => {
    formErrors.value = !!errors;
    if (errors) return;

    await deployContract();
  });
}

async function deployContract() {
  //   console.log('deploy');
  //   console.log(form.value);
  //   const res = await $api.post(endpoints.newSmartContract, {});
  const _projectUuid = dataStore.currentProject?.project_uuid;
  const _contractUuid = smartContractsStore.getContractDetails.contract_uuid;
  console.log(form.value._settings);
  console.log(form.value._dropStart);
  console.log(form.value._maxSupply);
  console.log(form.value._reserve);
  console.log(form.value._royaltiesFees);
  console.log(form.value._pricePerMint);
  //   const body = JSON.stringify({
  //     project_uuid: _projectUuid,
  //     name: form.value.name,
  //     description: form.value.description,
  //     chain: form.value.chain,
  //     contract_uuid: _contractUuid,
  //     constructorArguments: [
  //       form.value._name,
  //       form.value._symbol,
  //       form.value._initBaseURI,
  //       form.value._baseExtension,
  //       [true, true],
  //       form.value._dropStart,
  //       form.value._pricePerMint,
  //       form.value._maxSupply,
  //       form.value._reserve,
  //       form.value._royaltiesAddress,
  //       form.value._royaltiesFees,
  //     ],
  //   });
  //   0x97a6f35fA40BC4eb73247965F43cB99A13fF05D0

  try {
    console.log(form.value._dropStart);
    // const res = await $api.post(endpoints.newSmartContract(_contractUuid), {
    //   project_uuid: _projectUuid,
    //   name: form.value.name,
    //   description: form.value.description,
    //   chain: form.value.chain,
    //   contract_uuid: _contractUuid,
    //   constructorArguments: [
    //     form.value._name,
    //     form.value._symbol,
    //     form.value._initBaseURI,
    //     form.value._baseExtension,
    //     [true, true, true, true],
    //     0,
    //     form.value._pricePerMint,
    //     form.value._maxSupply,
    //     form.value._reserve,
    //     form.value._royaltiesAddress,
    //     form.value._royaltiesFees,
    //   ],
    // });
  } catch (e) {
    console.log(e);
  }
}
</script>

<!-- const raw = JSON.stringify({
    "project_uuid": "c094c483-857f-4b12-bdd4-e3a316719882",
    "name": "Tadej Contract 1234",
    "description": "descriptipon",
    "chain": 1287,
    "contract_uuid": "ac30d481-7e6f-43c2-ad2b-72b6832ae5a6",
    "constructorArguments": [
      "Name",
      "NME",
      "baseUri",
      "baseExtension",
      [
        true,
        true,
        true,
        true
      ],
      0,
      0,
      1000,
      10,
      "0x4C2A866EB59511a6aD78db5cd4970464666b745a",
      10
    ]
  }); -->
