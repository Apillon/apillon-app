<template>
  <n-form
    ref="formRef"
    :model="formData"
    :class="{ 'form-errors': formErrors }"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
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

      <n-form-item :label="$t('dashboard.service.assetHub.form.label.assetId')" path="id">
        <n-input
          v-model="formData.assetId"
          :input-props="{ type: 'number' }"
          :placeholder="$t('dashboard.service.assetHub.form.placeholder.assetId')"
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
    </div>
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
  assetId: [{ required: true, message: 'Asset Id selection is required' }],
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

function handleSubmit() {}
</script>
