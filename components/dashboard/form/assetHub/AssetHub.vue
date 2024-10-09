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
          :options="networks"
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
          :placeholder="$t('form.placeholder.assetHub.minBalance')"
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
const assetHubStore = useAssetHubStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formErrors = ref<boolean>(false);

const rules: NFormRules = {
  network: ruleRequired('Network is required'),
  name: ruleRequired('Name is required'),
  symbol: ruleRequired('Symbol is required'),
  assetId: ruleRequired('Asset Id is required'),
  decimals: ruleRequired('Decimals is required'),
  initialSupply: ruleRequired('Initial Supply is required'),
  minBalance: ruleRequired('Min balance is required'),
  issuerAddress: ruleRequired('Issuer Address is required'),
  freezerAddress: ruleRequired('Freezer Address is required'),
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

const networks = computed(() =>
  Object.values(assetHubNetworks).map(network => ({ label: network.name, value: network.rpc }))
);

onMounted(() => {
  if (!assetHubStore.account) {
    router.push({ name: 'dashboard-service-asset-hub' });
  }
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
      createAsset();
    }
  });
}

async function createAsset() {
  if (!assetHubStore.account) {
    message.warning(t('dashboard.service.assetHub.connect'));
    return;
  }
  if (
    !formData.value.network ||
    !formData.value.assetId ||
    !formData.value.name ||
    !formData.value.symbol ||
    !formData.value.decimals ||
    !formData.value.minBalance ||
    !formData.value.issuerAddress ||
    !formData.value.freezerAddress
  ) {
    message.warning('Missing data');
    return;
  }
  loading.value = true;

  const assetHubClient = await AssetHubClient.getInstance(
    formData.value.network,
    assetHubStore.account
  );
  try {
    const team = {
      issuer: formData.value.issuerAddress,
      admin: assetHubStore.account.address,
      freezer: formData.value.freezerAddress,
    };
    const hash = await assetHubClient.createAsset(
      assetHubStore.account.address,
      formData.value.assetId,
      formData.value.name,
      formData.value.symbol,
      formData.value.decimals,
      formData.value.minBalance,
      team
    );

    message.success(t('form.success.created.asset'));

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', hash);
  } catch (error: any) {
    if (error?.message) {
      message.error(error?.message);
    } else {
      message.error(userFriendlyMsg(error));
    }
  } finally {
    assetHubClient.destroyInstance();
  }
  loading.value = false;
}
</script>
