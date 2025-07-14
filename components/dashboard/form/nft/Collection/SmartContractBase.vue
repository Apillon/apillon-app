<template>
  <n-form ref="formRef" :model="metadataStore.form.smartContract" :rules="rules" @submit.prevent="handleSubmitForm">
    <n-grid :cols="12" :x-gap="32">
      <n-form-item-gi :span="8" path="name" :label="labelInfo('name')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="metadataStore.form.smartContract.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>
      <n-form-item-gi :span="4" path="symbol" :label="labelInfo('symbol')" :label-props="{ for: 'symbol' }">
        <n-input
          v-model:value="metadataStore.form.smartContract.symbol"
          :minlength="1"
          :maxlength="8"
          :input-props="{ id: 'symbol' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <n-form-item v-if="showNetwork" path="chain" :label="labelInfo('chain')" :label-props="{ for: 'chain' }">
      <select-options
        v-model:value="metadataStore.form.smartContract.chain"
        :options="chains"
        :input-props="{ id: 'chain' }"
        :placeholder="$t('general.pleaseSelect')"
        filterable
        clearable
      />
    </n-form-item>

    <n-form-item
      v-if="!simplet && metadataStore.form.smartContract.chainType !== ChainType.SUBSTRATE"
      path="adminAddress"
      :label="labelInfo('adminAddress')"
      :label-props="{ for: 'adminAddress' }"
    >
      <FormFieldWalletAddress
        v-model:value="metadataStore.form.smartContract.adminAddress"
        :input-props="{ id: 'adminAddress' }"
        @connected="address => (metadataStore.form.smartContract.adminAddress = address)"
      />
    </n-form-item>

    <n-form-item v-if="!simplet && !isUnique" path="useApillonIpfsGateway" :show-label="false" :show-feedback="false">
      <n-checkbox
        id="useApillonIpfsGateway"
        v-model:checked="metadataStore.form.smartContract.useApillonIpfsGateway"
        size="medium"
        :label="labelInfo('useGateway')"
      />
    </n-form-item>

    <n-form-item v-if="!simplet && !isUnique && showIpns" path="useIpns" :show-label="false" :show-feedback="false">
      <n-checkbox
        v-model:checked="metadataStore.form.smartContract.useIpns"
        size="medium"
        :label="labelInfo('useIpns')"
      />
    </n-form-item>

    <n-form-item v-if="!hideSubmit" :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.proceed')" />
      <Btn type="primary" class="mt-2 w-full" @click="handleSubmitForm">
        {{ $t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
defineProps({
  hideSubmit: { type: Boolean, default: true },
  showNetwork: { type: Boolean, default: true },
  showIpns: { type: Boolean, default: true },
  simplet: { type: Boolean, default: false },
});
const message = useMessage();
const metadataStore = useMetadataStore();

const { rulesCollection: rules, labelInfo } = useForm();
const { chainsTestnet, formRef, isUnique, nftChains, isChainAvailable } = useCollection();
defineExpose({ formRef, handleSubmitForm });

const chains = computed(() => [...nftChains, ...chainsTestnet].filter(chain => isChainAvailable(chain.value)));

// Submit
async function handleSubmitForm(e?: Event | MouseEvent): Promise<boolean> {
  e?.preventDefault();
  return !(await formRef.value?.validate())?.warnings;
}
</script>
