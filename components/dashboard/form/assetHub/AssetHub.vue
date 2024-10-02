<template>
  <n-form
    ref="formRef"
    :model="formData"
    :class="{ 'form-errors': formErrors }"
    class="w-full max-w-xl"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <div class="bg-bg-lighter rounded-lg p-8 pb-2 mb-4">
      <n-form-item
        :span="6"
        :label-props="{ for: 'chainId' }"
        :label="$t('form.label.assetHub.network')"
        path="network"
      >
        <select-options
          v-model:value="formData.network"
          :options="chains"
          :input-props="{ id: 'chainId' }"
          :placeholder="$t('form.placeholder.assetHub.network')"
          required
          clearable
        />
      </n-form-item>
    </div>

    <p class="text-white font-bold mb-4">{{ $t('dashboard.service.assetHub.characteristics') }}</p>
    <div class="bg-bg-lighter rounded-lg p-8">
      <n-form-item :label="$t('form.label.assetHub.name')" path="name">
        <n-input
          v-model:value="formData.name"
          :input-props="{ type: 'text' }"
          :placeholder="$t('form.placeholder.assetHub.name')"
          clearable
          class="bg-bg-light"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item :label="$t('form.label.assetHub.symbol')" path="symbol">
        <n-input
          v-model:value="formData.symbol"
          :input-props="{ type: 'text' }"
          :placeholder="$t('form.label.assetHub.symbol')"
          clearable
          class="bg-bg-light"
          @keydown.enter.prevent
        />
      </n-form-item>

      <n-form-item
        class="bg-bg-lighter rounded-lg"
        :label="$t('form.label.assetHub.assetId')"
        path="assetId"
      >
        <n-input-number
          v-model:value="formData.assetId"
          :placeholder="$t('form.placeholder.assetHub.assetId')"
          clearable
          class="bg-bg-light rounded-lg"
          :min="0"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        class="bg-bg-lighter rounded-lg"
        :label="$t('form.label.assetHub.decimals')"
        path="decimals"
      >
        <n-input-number
          v-model:value="formData.decimals"
          :placeholder="$t('form.label.assetHub.decimals')"
          clearable
          class="bg-bg-light rounded-lg"
          :min="0"
          @keydown.enter.prevent
        />
      </n-form-item>

      <n-form-item
        class="bg-bg-lighter rounded-lg"
        :label="$t('form.label.assetHub.initialSupply')"
        path="initialSupply"
      >
        <n-input-number
          v-model:value="formData.initialSupply"
          :placeholder="$t('form.placeholder.assetHub.initialSupply')"
          clearable
          class="bg-bg-light rounded-lg"
          :min="0"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        class="bg-bg-lighter rounded-lg"
        :label="$t('form.label.assetHub.minBalance')"
        path="minBalance"
      >
        <n-input-number
          v-model:value="formData.minBalance"
          :placeholder="$t('form.label.assetHub.minBalance')"
          clearable
          class="bg-bg-light rounded-lg"
          :min="0"
          @keydown.enter.prevent
        />
      </n-form-item>
    </div>

    <div class="bg-bg-lighter rounded-lg p-8 mt-4">
      <n-form-item :label="$t('form.label.assetHub.issuerAddress')" path="issuerAddress">
        <n-input
          v-model:value="formData.issuerAddress"
          :input-props="{ type: 'text' }"
          :placeholder="$t('form.placeholder.assetHub.issuerAddress')"
          clearable
          class="bg-bg-light"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item :label="$t('form.label.assetHub.freezerAddress')" path="freezerAddress">
        <n-input
          v-model:value="formData.freezerAddress"
          :input-props="{ type: 'text' }"
          :placeholder="$t('form.label.assetHub.freezerAddress')"
          clearable
          class="bg-bg-light"
          @keydown.enter.prevent
        />
      </n-form-item>
    </div>

    <n-form-item>
      <input type="submit" class="hidden" :value="$t('dashboard.service.assetHub.create')" />

      <Btn type="primary" size="large" :loading="loading" @click="handleSubmit">
        {{ $t('dashboard.service.assetHub.create') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormAsset = {
  network: string | null;
  name: string | null;
  symbol: string | null;
  assetId: number | null;
  decimals: number | null;
  initialSupply: number | null;
  minBalance: number | null;
  issuerAddress: string | null;
  freezerAddress: string | null;
};

const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);
const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const warningStore = useWarningStore();
const { chains } = useCollection();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formErrors = ref<boolean>(false);

const rules: NFormRules = {
  network: [{ required: true, message: 'Network is required' }],
  name: [{ required: true, message: 'Name is required' }],
  symbol: [{ required: true, message: 'Symbol is required' }],
  assetId: [{ required: true, message: 'Asset Id is required' }],
  decimals: [{ required: true, message: 'Decimals is required' }],
  initialSupply: [{ required: true, message: 'Initial Supply is required' }],
  minBalance: [{ required: true, message: 'Min balance is required' }],
  issuerAddress: [{ required: true, message: 'Issuer Address is required' }],
  freezerAddress: [{ required: true, message: 'Freezer Address is required' }],
};

const formData = ref<FormAsset>({
  network: null,
  name: null,
  symbol: null,
  assetId: null,
  decimals: null,
  initialSupply: null,
  minBalance: null,
  issuerAddress: null,
  freezerAddress: null,
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      warningStore.showSpendingWarning(PriceServiceName.SOCIAL_POST, () => createAsset());
    }
  });
}

async function createAsset() {
  loading.value = true;

  try {
    const res = await $api.post<any>(endpoints.posts(), formData.value);

    message.success(t('form.success.created.asset'));

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
