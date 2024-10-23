<template>
  <n-form
    ref="formRef"
    :model="form"
    :rules="rules"
    class="max-w-lg mx-auto my-10"
    @submit.prevent="handleSubmit"
  >
    <!-- general fields -->
    <!-- chainId -->
    <n-form-item :span="6" :label-props="{ for: 'chainId' }" label="Select Chain" path="chain">
      <select-options
        v-model:value="form.chain"
        :options="chains"
        :input-props="{ id: 'chainId' }"
        placeholder="please select"
        required
        clearable
      />
    </n-form-item>

    <!-- Name -->
    <n-form-item label="Smart Contract Name" path="Name">
      <n-input v-model:value="form.Name" :maxlength="256" required />
    </n-form-item>

    <!-- Description -->
    <n-form-item label="Smart Contract Description" path="Description">
      <n-input v-model:value="form.Description" :maxlength="256" required />
    </n-form-item>

    <!-- dynamic fields -->
    <div v-for="input in constructorInputs" :key="input.name">
      <template v-if="input.type === 'tuple'">
        <div v-for="i in input.components" :key="i">
          <!-- string -->
          <n-form-item :label="labelInfoText(i.name, i.description)" :path="i.name">
            <n-input
              v-if="i.type === 'string' || i.type === 'address'"
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
      <n-form-item v-else :label="labelInfoText(input.name, input?.description)" :path="input.name">
        <template v-if="!isSpecialField(input)">
          <!-- string -->
          <n-input
            v-if="input.type === 'string' || input.type === 'address'"
            v-model:value="form[input.name]"
            :maxlength="256"
            required
          />
          <!-- boolean options array -->
          <template v-else-if="input.type === 'bool[]'">
            <div>
              <n-grid class="mb-4" :cols="3" :x-gap="16">
                <n-form-item-gi
                  v-for="(value, index) in settings"
                  :key="index"
                  :span="1"
                  :show-label="false"
                  :show-feedback="false"
                >
                  <n-checkbox
                    v-model:checked="settings[index]"
                    size="medium"
                    :label="`option ${index + 1}`"
                  />
                </n-form-item-gi>
              </n-grid>
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

    <!--  Submit -->
    <n-form-item :show-label="false" :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('form.deploy')" />
      <Btn class="mt-2" size="large" type="primary" :loading="loading" @click="handleSubmit">
        {{ $t('form.deploy') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormRules, FormItemRule } from 'naive-ui';

type SmartContractForm = {
  Name: string | null;
  Description: string | null;
  chain: number | null;
};

const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const warningStore = useWarningStore();
const smartContractStore = useSmartContractStore();
const deployedContractStore = useDeployedContractStore();

const { labelInfoText } = useComputing();
const { isSpecialField } = useSmartContracts();
const { chains, disablePastDate, disablePastTime } = useCollection();

const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const settings = ref([false, false, false, false]);
const form = ref<SmartContractForm>({
  Name: '',
  Description: '',
  chain: null,
});

const initialRules: FormRules = {
  Name: ruleRequired('Name is required'),
  Description: ruleRequired('Description is required'),
  chain: ruleRequired('Chain selection is required'),
};

const constructorInputs = computed(() => {
  if (!smartContractStore.active) return [];

  const abi = smartContractStore.active.contractVersion?.abi || [];
  const constructor = abi.find((item: any) => item.type === 'constructor');
  return constructor ? constructor.inputs : [];
});

const rules = computed<FormRules>(() => {
  return constructorInputs.value.reduce((acc: FormRules, input: any) => {
    if (input.type === 'tuple') {
      input.components.forEach((i: any) => {
        acc[i.name] = createValidation(i);
      });
    } else {
      acc[input.name] = createValidation(input);
    }
    return acc;
  }, initialRules);
});

onMounted(() => {
  initForm();
});

function initForm() {
  // Initialize form fields from abi constructor
  if (smartContractStore.active) {
    constructorInputs.value.forEach((input: any) => {
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

function createValidation(input: any): FormItemRule[] {
  // Address
  if (input.type === 'address') {
    return [
      ruleRequired(`${input.name} is required`),
      {
        validator: validateEvmAddress,
        message: 'Address must be a valid 0x-prefixed hexadecimal string with 40 characters.',
      },
    ];
  }
  // uint logic
  else if (input.type.includes('uint')) {
    if (input.name === '_reserve' || input.name === '_maxSupply') {
      return [
        ruleRequired(`${input.name} is required`),
        { validator: validateInteger, message: 'The value must be an integer' },
      ];
    } else if (input.name === '_royaltiesFees') {
      return [
        ruleRequired(`${input.name} is required`),
        { validator: validatePercent, message: 'The value must be between 0 and 100.' },
      ];
    } else {
      return [ruleRequired(`${input.name} is required`)];
    }
  } else if (input.type === 'bool[]') {
    // return [{ validator: validateBoolean, message: `${input.name} is required` }];
    return [];
  } else {
    return [ruleRequired(`${input.name} is required`)];
  }
}

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();

  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      warningStore.showSpendingWarning(PriceServiceName.HOSTING_WEBSITE, () => deployContract());
    }
  });
}

async function deployContract() {
  loading.value = true;
  const constructorArguments: Array<any> = [];

  // THIS IS HARDCODED TO HANDLE NESTABLE ERC-721 TUPLE
  const accumulatedKeys = ['royaltyRecipient', 'royaltyPercentageBps', 'maxSupply', 'pricePerMint'];
  const accumulatedArray: Array<any> = [];

  for (const key in form.value) {
    if (form.value.hasOwnProperty(key)) {
      if (key !== 'Name' && key !== 'Description' && key !== 'chain') {
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
    const res = await $api.post<DeployedContractResponse>(
      endpoints.smartContractsNew(smartContractStore.active.contract_uuid),
      {
        project_uuid: dataStore.projectUuid,
        contract_uuid: smartContractStore.active.contract_uuid,
        name: form.value.Name,
        description: form.value.Description,
        chain: form.value.chain,
        constructorArguments,
      }
    );

    if (res.data) {
      message.success(t('form.success.smartContract'));
      router.push(`/dashboard/service/smart-contracts`);

      setTimeout(() => deployedContractStore.items.unshift(res.data), 500);
    }
  } catch (e) {
    message.error(userFriendlyMsg(e));
  } finally {
    loading.value = false;
  }
}
</script>
