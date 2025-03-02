<template>
  <n-form
    ref="formRef"
    class="max-w-xl"
    :model="collectionStore.form.behavior"
    :rules="rules"
    @submit.prevent="handleSubmitForm"
  >
    <n-grid class="items-end" :cols="12" :x-gap="32">
      <!-- Collection Total supply -->
      <n-form-item-gi
        path="supplyLimited"
        :span="6"
        :label="infoLabel('supplyLimited')"
        :label-props="{ for: 'supplyLimited' }"
      >
        <select-options
          v-model:value="collectionStore.form.behavior.supplyLimited"
          :options="supplyTypes"
          :input-props="{ id: 'supplyLimited' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
          clearable
        />
      </n-form-item-gi>

      <!--  Collection Max supply -->
      <n-form-item-gi
        path="maxSupply"
        :span="6"
        :label="infoLabel('maxSupply')"
        :label-props="{ for: 'maxSupply' }"
      >
        <n-input-number
          v-model:value="collectionStore.form.behavior.maxSupply"
          :min="0"
          :max="NFT_MAX_SUPPLY"
          :disabled="!collectionStore.form.behavior.supplyLimited"
          :input-props="{ id: 'maxSupply' }"
          :placeholder="
            collectionStore.form.behavior.supplyLimited
              ? $t('form.placeholder.collectionMaxSupply')
              : $t('form.disabled')
          "
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid
      v-if="collectionStore.form.base.chainType === ChainType.EVM || isUnique"
      class="items-end"
      :cols="12"
      :x-gap="32"
    >
      <!-- Collection Revocable -->
      <n-form-item-gi
        path="revocable"
        :span="6"
        :label="infoLabel('revocable')"
        :label-props="{ for: 'revocable' }"
      >
        <select-options
          v-model:value="collectionStore.form.behavior.revocable"
          :options="booleanSelect"
          :input-props="{ id: 'revocable' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
        />
      </n-form-item-gi>

      <!-- Collection Soulbound -->
      <n-form-item-gi
        path="soulbound"
        :span="6"
        :label="infoLabel('soulbound')"
        :label-props="{ for: 'soulbound' }"
      >
        <select-options
          v-model:value="collectionStore.form.behavior.soulbound"
          :options="booleanSelect"
          :input-props="{ id: 'soulbound' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid
      v-if="collectionStore.form.base.chainType === ChainType.EVM && !isUnique"
      class="items-end"
      :cols="12"
      :x-gap="32"
    >
      <!-- Royalties Address -->
      <n-form-item-gi
        path="royaltiesAddress"
        :span="6"
        :label="infoLabel('royaltiesAddress')"
        :label-props="{ for: 'royaltiesAddress' }"
      >
        <n-input
          v-model:value="collectionStore.form.behavior.royaltiesAddress"
          :input-props="{ id: 'royaltiesAddress' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>

      <!-- Royalties Fees -->
      <n-form-item-gi
        path="royaltiesFees"
        :span="6"
        :label="infoLabel('royaltiesFees')"
        :label-props="{ for: 'royaltiesFees' }"
      >
        <n-input-number
          v-model:value="collectionStore.form.behavior.royaltiesFees"
          :min="0"
          :max="100"
          :input-props="{ id: 'royaltiesFees' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid v-if="!isUnique" class="items-end" :cols="12" :x-gap="32">
      <!--  Collection Is Drop -->
      <n-form-item-gi path="drop" :span="6" :show-label="false">
        <n-checkbox
          v-model:checked="collectionStore.form.behavior.drop"
          size="medium"
          :label="infoLabel('drop')"
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid v-if="!!collectionStore.form.behavior.drop" class="items-end" :cols="12" :x-gap="32">
      <!--  Collection Mint price -->
      <n-form-item-gi
        path="dropPrice"
        :span="6"
        :label="$t('form.label.collection.dropPrice', { currency: chainCurrency() })"
        :label-props="{ for: 'dropPrice' }"
      >
        <n-input-number
          v-model:value="collectionStore.form.behavior.dropPrice"
          :min="0.00001"
          :max="10000000000"
          :step="0.00001"
          :input-props="{ id: 'dropPrice' }"
          clearable
        />
      </n-form-item-gi>

      <!--  Collection Drop start -->
      <n-form-item-gi
        path="dropStart"
        :span="6"
        :label="infoLabel('dropStart')"
        :label-props="{ for: 'dropStart' }"
      >
        <n-date-picker
          v-model:value="collectionStore.form.behavior.dropStart"
          class="w-full"
          type="datetime"
          :input-props="{ id: 'dropStart' }"
          :is-date-disabled="disablePastDate"
          :is-time-disabled="disablePastTime"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid v-if="!!collectionStore.form.behavior.drop" class="items-end" :cols="12" :x-gap="32">
      <!--  Collection Reserve -->
      <n-form-item-gi
        v-if="collectionStore.form.base.chainType === ChainType.EVM"
        path="dropReserve"
        :span="6"
        :label="infoLabel('dropReserve')"
        :label-props="{ for: 'dropReserve' }"
      >
        <n-input-number
          v-model:value="collectionStore.form.behavior.dropReserve"
          :min="0"
          :step="1"
          :input-props="{ id: 'dropReserve' }"
          clearable
        />
      </n-form-item-gi>

      <!-- Royalties Address -->
      <n-form-item-gi
        v-if="collectionStore.form.base.chainType === ChainType.SUBSTRATE"
        path="royaltiesAddress"
        :span="6"
        :label="infoLabel('dropAddress')"
        :label-props="{ for: 'royaltiesAddress' }"
      >
        <n-input
          v-model:value="collectionStore.form.behavior.royaltiesAddress"
          :input-props="{ id: 'royaltiesAddress' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <!--  Form submit -->
    <n-form-item>
      <input type="submit" class="hidden" :value="$t('form.proceed')" />
      <Btn type="primary" class="w-full mt-2" @click="handleSubmitForm">
        {{ $t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
const message = useMessage();
const { labelInfo } = useComputing();
const collectionStore = useCollectionStore();
const {
  booleanSelect,
  formRef,
  isUnique,
  supplyTypes,
  rules,
  chainCurrency,
  disablePastDate,
  disablePastTime,
} = useCollection();

onMounted(() => {
  if (collectionStore.form.behavior.maxSupply === 0) {
    collectionStore.form.behavior.maxSupply = collectionStore.csvData.length;
  }
});

function infoLabel(field: string) {
  return labelInfo(field, 'form.label.collection');
}

// Submit
function handleSubmitForm(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      collectionStore.mintTab = NftCreateTab.PREVIEW;
    }
  });
}
</script>
