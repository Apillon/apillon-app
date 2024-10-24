<template>
  <n-form
    v-bind="$attrs"
    ref="formRef"
    :model="formData"
    class="w-full max-w-xl"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <div class="bg-bg-lighter rounded-lg p-8 pb-2 mb-4" :class="{ hidden: !!assetId }">
      <n-form-item
        :span="6"
        :label-props="{ for: 'chainId' }"
        :label="$t('form.label.assetHub.network')"
        path="network"
      >
        <div
          v-if="!assetId && formData.network === assetHubNetworks.westend.rpc"
          class="absolute bottom-full right-0 mb-2"
        >
          <Btn size="small" type="link" href="https://faucet.polkadot.io/westend?parachain=1000">
            <span class="text-xs">Faucet</span>
          </Btn>
        </div>
        <select-options
          v-model:value="formData.network"
          :options="networks"
          :input-props="{ id: 'chainId' }"
          :placeholder="$t('form.placeholder.assetHub.network')"
          :disabled="!!assetId"
          required
          clearable
        />
      </n-form-item>
    </div>

    <p class="text-white font-bold mb-4" :class="{ hidden: !!assetId }">
      {{ $t('dashboard.service.assetHub.characteristics') }}
    </p>
    <div class="bg-bg-lighter rounded-lg p-8 pb-2">
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
          :placeholder="$t('form.placeholder.assetHub.symbol')"
          clearable
          class="bg-bg-light"
          @keydown.enter.prevent
        />
      </n-form-item>

      <n-form-item
        class="bg-bg-lighter rounded-lg"
        :class="{ hidden: !!assetId }"
        :label="$t('form.label.assetHub.id')"
        path="assetId"
      >
        <n-input-number
          v-model:value="formData.assetId"
          :placeholder="$t('form.placeholder.assetHub.assetId')"
          clearable
          class="bg-bg-light rounded-lg"
          :min="0"
          :step="1"
          :disabled="!!assetId"
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
          :placeholder="$t('form.placeholder.assetHub.decimals')"
          clearable
          class="bg-bg-light rounded-lg"
          :min="0"
          :max="18"
          :step="1"
          @keydown.enter.prevent
        />
      </n-form-item>

      <n-form-item
        class="bg-bg-lighter rounded-lg"
        :class="{ hidden: !!assetId }"
        :label="$t('form.label.assetHub.supply')"
        path="initialSupply"
      >
        <n-input-number
          v-model:value="formData.initialSupply"
          :placeholder="$t('form.placeholder.assetHub.supply')"
          clearable
          class="bg-bg-light rounded-lg"
          :min="0"
          :step="1"
          :disabled="!!assetId"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        class="bg-bg-lighter rounded-lg"
        :class="{ hidden: !!assetId }"
        :label="$t('form.label.assetHub.minBalance')"
        path="minBalance"
      >
        <n-input-number
          v-model:value="formData.minBalance"
          :placeholder="$t('form.placeholder.assetHub.minBalance')"
          clearable
          class="bg-bg-light rounded-lg"
          :min="1"
          :step="1"
          :disabled="!!assetId"
          @keydown.enter.prevent
        />
      </n-form-item>
    </div>

    <div class="bg-bg-lighter rounded-lg p-8 pb-2 mt-4" :class="{ hidden: !!assetId }">
      <n-form-item :label="$t('form.label.assetHub.issuer')" path="issuerAddress">
        <n-input
          v-model:value="formData.issuerAddress"
          :input-props="{ type: 'text' }"
          :placeholder="$t('form.placeholder.assetHub.issuerAddress')"
          :disabled="!!assetId"
          clearable
          class="bg-bg-light"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item :label="$t('form.label.assetHub.freezer')" path="freezerAddress">
        <n-input
          v-model:value="formData.freezerAddress"
          :input-props="{ type: 'text' }"
          :placeholder="$t('form.placeholder.assetHub.freezerAddress')"
          :disabled="!!assetId"
          clearable
          class="bg-bg-light"
          @keydown.enter.prevent
        />
      </n-form-item>
    </div>

    <n-form-item :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('dashboard.service.assetHub.create')" />

      <Btn type="primary" size="large" :loading="loading" @click="handleSubmit">
        <span v-if="assetId">{{ $t('dashboard.service.assetHub.edit') }}</span>
        <span v-else>{{ $t('dashboard.service.assetHub.create') }}</span>
      </Btn>
    </n-form-item>
  </n-form>

  <AssetHubTransaction v-if="txHash" :transactionHash="txHash" @close="$emit('close')" />
  <AssetHubLoader v-if="loading && assetHubClient?.txApproved" class="z-3000" />
</template>

<script lang="ts" setup>
import type { FormItemRule } from 'naive-ui';

type FormAsset = {
  network: string | null;
  name: string;
  symbol: string;
  assetId: number | null;
  decimals: number | null;
  initialSupply: number | null;
  minBalance: number | null;
  issuerAddress: string;
  freezerAddress: string;
};

const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess', 'close']);
const props = defineProps({
  assetId: { type: Number, default: null },
});

const { t } = useI18n();
const message = useMessage();
const assetHubStore = useAssetHubStore();
const { assetHubClient } = useAssetHub();

const loading = ref(false);
const asset = ref<AssetInterface | undefined>();
const formRef = ref<NFormInst | null>(null);
const txHash = ref<string | undefined>();

const formData = ref<FormAsset>({
  network: null,
  name: '',
  symbol: '',
  assetId: null,
  decimals: 18,
  initialSupply: null,
  minBalance: 1,
  issuerAddress: assetHubStore.account?.address || '',
  freezerAddress: assetHubStore.account?.address || '',
});

const rules: NFormRules = {
  network: ruleRequired('Network is required'),
  name: [
    ruleRequired('Name is required'),
    { validator: validateName, message: t('validation.assetHub.nameNotUnique') },
  ],
  symbol: [
    ruleRequired('Symbol is required'),
    { validator: validateSymbol, message: t('validation.assetHub.symbolNotUnique') },
  ],
  assetId: [
    ruleRequired('Asset Id is required'),
    { validator: validateAssetId, message: t('validation.assetHub.idNotUnique') },
  ],
  decimals: ruleRequired('Decimals is required'),
  initialSupply: ruleRequired('Initial Supply is required'),
  minBalance: ruleRequired('Min balance is required'),
  issuerAddress: ruleRequired('Issuer Address is required'),
  freezerAddress: ruleRequired('Freezer Address is required'),
};

const networks = computed(() =>
  Object.values(assetHubNetworks).map(network => ({ label: network.name, value: network.rpc }))
);

const isMainnetSelected = computed(() => formData.value.network === assetHubNetworks.assetHub.rpc);
const assetIDsMainnet = computed(() => new Set(assetHubStore.itemsMainnet.map(i => i.id)));
const assetIDsTestnet = computed(() => new Set(assetHubStore.itemsTestnet.map(i => i.id)));
const assetIDs = computed(() =>
  isMainnetSelected.value ? assetIDsMainnet.value : assetIDsTestnet.value
);

onMounted(async () => {
  if (props.assetId) {
    asset.value = await assetHubStore.getAsset(props.assetId);
    if (asset.value) {
      formData.value.assetId = props.assetId;
      formData.value.decimals = toNum(asset.value.decimals);
      formData.value.freezerAddress = asset.value.freezer;
      formData.value.initialSupply = toNum(asset.value.supply);
      formData.value.issuerAddress = asset.value.issuer;
      formData.value.minBalance = toNum(asset.value.minBalance);
      formData.value.name = asset.value.name;
      formData.value.network = assetHubNetworks.westend.rpc;
      formData.value.symbol = asset.value.symbol;
    }
  }

  assetHubStore.getAssetsMainnet();
  assetHubStore.getAssetsTestnet();
});

watch(
  () => formData.value.network,
  async rpc => {
    if (assetHubClient.value) {
      await assetHubClient.value.destroyInstance();
      await sleep(200);
    }
    if (rpc && assetHubStore.account) {
      formData.value.assetId = findFirstAvailableNumber(assetIDs.value);
    }
  }
);
function findFirstAvailableNumber(set) {
  let i = 1;
  while (set.has(i)) {
    i++;
  }
  return i;
}

watch(
  () => formData.value.assetId,
  (newId, oldId) => {
    if (oldId && newId) {
      const delta = newId - oldId;

      if (Math.abs(delta) === 1 && assetIDs.value.has(newId)) {
        formData.value.assetId = newId + delta;
      }
    }
  }
);

// Custom validations
function validateAssetId(_: FormItemRule, value: string): boolean {
  return !!props.assetId || !assetHubStore.items.some(i => i.id === Number(value));
}
function validateName(_: FormItemRule, value: string): boolean {
  return (
    !!props.assetId || !assetHubStore.items.some(i => i.name.toLowerCase() === value.toLowerCase())
  );
}
function validateSymbol(_: FormItemRule, value: string): boolean {
  return (
    !!props.assetId ||
    !assetHubStore.items.some(i => i.symbol.toLowerCase() === value.toLowerCase())
  );
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (props.assetId && asset.value) {
      if (
        formData.value.name === asset.value.name &&
        formData.value.symbol === asset.value.symbol &&
        formData.value.decimals === toNum(asset.value.decimals)
      ) {
        message.warning('No changes');
      } else {
        updateAsset();
      }
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
    !formData.value.decimals ||
    !formData.value.minBalance
  ) {
    message.warning('Missing data');
    return;
  }
  loading.value = true;

  assetHubClient.value = await assetHubStore.initClient(isMainnetSelected.value);
  if (!assetHubClient.value) return;

  try {
    const team = {
      issuer: formData.value.issuerAddress,
      admin: assetHubStore.account.address,
      freezer: formData.value.freezerAddress,
    };
    txHash.value = await assetHubClient.value.createAsset(
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
    emit('createSuccess', txHash.value);
  } catch (error: any) {
    if (error?.message) {
      message.error(error?.message);
    } else {
      message.error(userFriendlyMsg(error));
    }
  } finally {
    assetHubClient.value.destroyInstance();
  }
  loading.value = false;
}

async function updateAsset() {
  if (!assetHubStore.account) {
    message.warning(t('dashboard.service.assetHub.connect'));
    return;
  }
  if (
    !asset.value ||
    !formData.value.network ||
    !formData.value.assetId ||
    !formData.value.decimals
  ) {
    message.warning('Missing data');
    return;
  }
  loading.value = true;

  assetHubClient.value = await assetHubStore.initClient();
  if (!assetHubClient.value) return;

  try {
    txHash.value = await assetHubClient.value.updateMetadata(
      props.assetId,
      formData.value.name,
      formData.value.symbol,
      formData.value.decimals
    );
    assetHubStore.active.name = formData.value.name;
    assetHubStore.active.symbol = formData.value.symbol;
    assetHubStore.active.decimals = `${formData.value.decimals}`;

    message.success(t('form.success.updated.asset'));

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess', txHash.value);
  } catch (error: any) {
    if (error?.message) {
      message.error(error?.message);
    } else {
      message.error(userFriendlyMsg(error));
    }
  } finally {
    assetHubClient.value.destroyInstance();
  }
  loading.value = false;
}
</script>
