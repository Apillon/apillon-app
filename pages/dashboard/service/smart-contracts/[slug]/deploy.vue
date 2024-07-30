<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContractsSecondary />
    </template>

    <slot>
      <div>
        <h4 class="mb-6">Smart Contract Details</h4>

        <n-form
          ref="formRef"
          @submit.prevent="handleSubmit"
          :class="{ 'form-errors': formErrors }"
          :rules="rules"
          class="max-w-lg mx-auto my-10"
        >
          <!-- general data -->
          <n-form-item label="Name" path="base.name">
            <n-input v-model="generalForm.name" :maxlength="256" required />
          </n-form-item>
          <n-form-item label="Description">
            <n-input v-model="generalForm.description" :maxlength="256" required />
          </n-form-item>

          <n-form-item :span="6" :label-props="{ for: 'chainId' }" label="Select Chain">
            <select-options
              v-model:value="generalForm.chain"
              :options="chainOptions"
              :input-props="{ id: 'chainId' }"
              placeholder="please select"
              required
              clearable
            />
          </n-form-item>

          <!-- general data -->
          <n-form-item v-for="input in constructorInputs" :key="input.name" :label="input.name">
            <template v-if="!isSpecialField(input)">
              <n-input
                v-if="input.type === 'string'"
                v-model="form[input.name]"
                :maxlength="256"
                required
              />

              <n-input
                v-if="input.type === 'address'"
                v-model="form[input.name]"
                :maxlength="256"
                required
              />

              <template v-else-if="input.type === 'bool[]'">
                <div>
                  <div>
                    <n-form-item v-for="(s, index) in settings" :span="1" :show-label="false">
                      <n-checkbox
                        v-model="form[input.name]"
                        size="medium"
                        :label="`option ${index + 1}`"
                      />
                    </n-form-item>
                  </div>
                  <div>
                    <n-button v-if="settings.length < 4" type="secondary" @click="addSettingsOption"
                      >Add a settings option</n-button
                    >
                  </div>
                </div>
              </template>

              <n-input-number
                v-else-if="input.type.includes('uint')"
                v-model="form[input.name]"
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
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { NForm, NFormItem, NInput, NButton, NDatePicker } from 'naive-ui';

const message = useMessage();
const router = useRouter();
const { params } = useRoute();

const smartContractsStore = useSmartContractsStore();

const pageLoading = ref<boolean>(true);
const contractUuid = ref<string>(`${params?.slug}` || '');
const smartContractDetails = ref<SmartContractInterface | null>(null);

const formRef = ref<NFormInst | null>(null);
const formErrors = ref<boolean>(false);

const generalForm = ref<{ [key: string]: any }>({
  name: '',
  description: '',
  chain: null,
});
const chainOptions = [
  { label: '1284', value: 1284 },
  { label: '1285', value: 1285 },
  { label: '1286', value: 1286 },
];

const form = ref<{ [key: string]: any }>({});
const settings = ref([0]);

function addSettingsOption(e) {
  e.preventDefault();
  const lastOption = settings.value[settings.value.length - 1];
  settings.value.push(lastOption + 1);
}

const getConstructorInputs = (contractDetails: any) => {
  const abi = contractDetails.contractVersion?.abi || [];
  const constructor = abi.find((item: any) => item.type === 'constructor');
  return constructor ? constructor.inputs : [];
};

const constructorInputs = computed(() => {
  if (!smartContractDetails.value) return [];
  return getConstructorInputs(smartContractDetails.value);
});

const isSpecialField = (input: any) => input.name === '_dropStart';

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    formErrors.value = !!errors;
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      console.log('submit');
    }
  });
}

onMounted(async () => {
  if (!contractUuid.value) {
    router.push({ name: 'dashboard-service-smart-contracts' });
  } else {
    await smartContractsStore.getContractByUUID(contractUuid.value as string);
    smartContractDetails.value = smartContractsStore.getContractDetails;
    pageLoading.value = false;

    // Initialize form fields
    if (smartContractDetails.value) {
      const constructorInputs = getConstructorInputs(smartContractDetails.value);
      constructorInputs.forEach((input: any) => {
        form.value[input.name] = null;
      });
    }
  }
});

function disablePastDate(ts: number) {
  return ts < new Date().setHours(0, 0, 0, 0);
}

function disablePastTime(ts: number) {
  return ts < Date.now();
}

const { t, te } = useI18n();

const rules: NFormRules = {
  name: ruleRequired('field required'),
  'base.name': ruleRequired(t('validation.collectionSymbolRequired')),
};
</script>
