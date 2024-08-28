<template>
  <n-form
    ref="formRef"
    :model="formData"
    :class="{ 'form-errors': formErrors }"
    class="w-full max-w-lg mb-8"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <div class="bg-bg-lighter rounded-lg p-8 pb-2 mb-4">
      <n-form-item
        :span="6"
        :label-props="{ for: 'chainId' }"
        :label="$t('dashboard.service.assetHub.form.placeholder.network')"
        path="network"
      >
        <select-options
          v-model:value="formData.network"
          :options="chainOptions"
          :input-props="{ id: 'chainId' }"
          :placeholder="$t('dashboard.service.assetHub.form.placeholder.network')"
          required
          clearable
        />
      </n-form-item>
    </div>
    <p><strong class="text-white">Characteristics</strong></p>
    <div class="bg-bg-lighter rounded-lg p-8">
      <n-form-item :label="$t('dashboard.service.assetHub.form.label.name')" path="name">
        <n-input
          v-model:value="formData.name"
          :input-props="{ type: 'text' }"
          :placeholder="$t('dashboard.service.assetHub.form.placeholder.name')"
          clearable
          class="bg-bg-light"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item :label="$t('dashboard.service.assetHub.form.label.symbol')" path="symbol">
        <n-input
          v-model:value="formData.symbol"
          :input-props="{ type: 'text' }"
          :placeholder="$t('dashboard.service.assetHub.form.label.symbol')"
          clearable
          class="bg-bg-light"
          @keydown.enter.prevent
        />
      </n-form-item>

      <n-form-item
        class="bg-bg-lighter rounded-lg"
        :label="$t('dashboard.service.assetHub.form.label.assetId')"
        path="assetId"
      >
        <n-input-number
          v-model:value="formData.assetId"
          :placeholder="$t('dashboard.service.assetHub.form.placeholder.assetId')"
          clearable
          class="bg-bg-light rounded-lg"
          :min="0"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        class="bg-bg-lighter rounded-lg"
        :label="$t('dashboard.service.assetHub.form.label.decimals')"
        path="decimals"
      >
        <n-input-number
          v-model:value="formData.decimals"
          :placeholder="$t('dashboard.service.assetHub.form.label.decimals')"
          clearable
          class="bg-bg-light rounded-lg"
          :min="0"
          @keydown.enter.prevent
        />
      </n-form-item>

      <n-form-item
        class="bg-bg-lighter rounded-lg"
        :label="$t('dashboard.service.assetHub.form.label.initialSupply')"
        path="initialSupply"
      >
        <n-input-number
          v-model:value="formData.initialSupply"
          :placeholder="$t('dashboard.service.assetHub.form.placeholder.initialSupply')"
          clearable
          class="bg-bg-light rounded-lg"
          :min="0"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        class="bg-bg-lighter rounded-lg"
        :label="$t('dashboard.service.assetHub.form.label.minBalance')"
        path="minBalance"
      >
        <n-input-number
          v-model:value="formData.minBalance"
          :placeholder="$t('dashboard.service.assetHub.form.label.minBalance')"
          clearable
          class="bg-bg-light rounded-lg"
          :min="0"
          @keydown.enter.prevent
        />
      </n-form-item>
    </div>

    <div class="bg-bg-lighter rounded-lg p-8 mt-4">
      <n-form-item
        :label="$t('dashboard.service.assetHub.form.label.issuerAddress')"
        path="issuerAddress"
      >
        <n-input
          v-model:value="formData.issuerAddress"
          :input-props="{ type: 'text' }"
          :placeholder="$t('dashboard.service.assetHub.form.placeholder.issuerAddress')"
          clearable
          class="bg-bg-light"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        :label="$t('dashboard.service.assetHub.form.label.freezerAddress')"
        path="freezerAddress"
      >
        <n-input
          v-model:value="formData.freezerAddress"
          :input-props="{ type: 'text' }"
          :placeholder="$t('dashboard.service.assetHub.form.label.freezerAddress')"
          clearable
          class="bg-bg-light"
          @keydown.enter.prevent
        />
      </n-form-item>
    </div>

    <n-button class="mt-4 w-full" type="primary" native-type="submit" @click="handleSubmit">
      Create asset
    </n-button>
  </n-form>
</template>

<script lang="ts" setup>
type FormAsset = {
  network: string;
  name: string;
  symbol: string;
  assetId: number | null;
  decimals: number | null;
  initialSupply: number | null;
  minBalance: number | null;
  issuerAddress: string;
  freezerAddress: string;
};
const formRef = ref<NFormInst | null>(null);
const formErrors = ref<boolean>(false);
const rules = reactive({
  network: [{ required: true, message: 'Netowrk is required' }],
  name: [{ required: true, message: 'Name is required' }],
  symbol: [{ required: true, message: 'Symbol is required' }],
  assetId: [{ required: true, message: 'Asset Id is required' }],
  decimals: [{ required: true, message: 'Decimals is required' }],
  initialSupply: [{ required: true, message: 'initialSupply is required' }],
  minBalance: [{ required: true, message: 'minBalance is required' }],
  issuerAddress: [{ required: true, message: 'issuerAddress is required' }],
  freezerAddress: [{ required: true, message: 'freezerAddress is required' }],
});

const formData = ref<FormAsset>({
  network: '',
  name: '',
  symbol: '',
  assetId: null,
  decimals: null,
  initialSupply: null,
  minBalance: null,
  issuerAddress: '',
  freezerAddress: '',
});

const chainOptions = [
  { label: 'Moonbase', value: 1287 },
  { label: 'Moonbeam', value: 1284 },
  { label: 'Astar_Shibuya', value: 81 },
  { label: 'Astar', value: 592 },
];

function handleSubmit() {}
</script>
