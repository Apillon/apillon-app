<template>
  <n-form
    ref="formRef"
    class="max-w-xl"
    :model="collectionStore.form.behaviour"
    :rules="rules"
    @submit.prevent="handleSubmitForm"
  >
    <n-grid class="items-end" :cols="12" :x-gap="32">
      <!-- Collection Total supply -->
      <n-form-item-gi
        path="supplyLimited"
        :span="6"
        :label="infoLabel('collectionTotalSupply')"
        :label-props="{ for: 'supplyLimited' }"
      >
        <select-options
          v-model:value="collectionStore.form.behaviour.supplyLimited"
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
        :label="infoLabel('collectionMaxSupply')"
        :label-props="{ for: 'maxSupply' }"
      >
        <n-input-number
          v-model:value="collectionStore.form.behaviour.maxSupply"
          :min="0"
          :max="NFT_MAX_SUPPLY"
          :disabled="!collectionStore.form.behaviour.supplyLimited"
          :input-props="{ id: 'maxSupply' }"
          :placeholder="
            collectionStore.form.behaviour.supplyLimited
              ? $t('form.placeholder.collectionMaxSupply')
              : $t('form.disabled')
          "
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid class="items-end" :cols="12" :x-gap="32">
      <!-- Collection Revocable -->
      <n-form-item-gi
        path="revocable"
        :span="6"
        :label="infoLabel('collectionRevocable')"
        :label-props="{ for: 'revocable' }"
      >
        <select-options
          v-model:value="collectionStore.form.behaviour.revocable"
          :options="booleanSelect"
          :input-props="{ id: 'revocable' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
          clearable
        />
      </n-form-item-gi>

      <!-- Collection Soulbound -->
      <n-form-item-gi
        path="soulbound"
        :span="6"
        :label="infoLabel('collectionSoulbound')"
        :label-props="{ for: 'soulbound' }"
      >
        <select-options
          v-model:value="collectionStore.form.behaviour.soulbound"
          :options="booleanSelect"
          :input-props="{ id: 'soulbound' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid class="items-end" :cols="12" :x-gap="32">
      <!-- Royalties Address -->
      <n-form-item-gi
        path="royaltiesAddress"
        :span="6"
        :label="infoLabel('Royalties Address')"
        :label-props="{ for: 'royaltiesAddress' }"
      >
        <n-input
          v-model:value="collectionStore.form.behaviour.royaltiesAddress"
          :input-props="{ id: 'royaltiesAddress' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>

      <!-- Royalties Fees -->
      <n-form-item-gi
        path="royaltiesFees"
        :span="6"
        :label="infoLabel('Royalties Fees')"
        :label-props="{ for: 'royaltiesFees' }"
      >
        <n-input-number
          v-model:value="collectionStore.form.behaviour.royaltiesFees"
          :min="0"
          :max="100"
          :input-props="{ id: 'royaltiesFees' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid class="items-end" :cols="12" :x-gap="32">
      <!--  Collection Is Drop -->
      <n-form-item-gi path="isDrop" :span="6" :show-label="false">
        <n-checkbox
          v-model:checked="collectionStore.form.behaviour.isDrop"
          size="medium"
          :label="infoLabel('collectionIsDrop')"
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid v-if="!!collectionStore.form.behaviour.isDrop" class="items-end" :cols="12" :x-gap="32">
      <!--  Collection Mint price -->
      <n-form-item-gi
        path="mintPrice"
        :span="6"
        :label="infoLabel('collectionMintPrice')"
        :label-props="{ for: 'mintPrice' }"
      >
        <n-input-number
          v-model:value="collectionStore.form.behaviour.mintPrice"
          :min="0"
          :max="1000"
          :step="0.001"
          :input-props="{ id: 'mintPrice' }"
          clearable
        />
      </n-form-item-gi>

      <!--  Collection Drop start -->
      <n-form-item-gi
        path="dropStart"
        :span="6"
        :label="infoLabel('collectionDropStart')"
        :label-props="{ for: 'dropStart' }"
      >
        <n-date-picker
          v-model:value="collectionStore.form.behaviour.dropStart"
          class="w-full"
          type="datetime"
          :input-props="{ id: 'dropStart' }"
          :is-date-disabled="disablePasteDate"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid v-if="!!collectionStore.form.behaviour.isDrop" class="items-end" :cols="12" :x-gap="32">
      <!--  Collection Reserve -->
      <n-form-item-gi
        path="reserve"
        :span="6"
        :label="infoLabel('collectionReserve')"
        :label-props="{ for: 'reserve' }"
      >
        <n-input-number
          v-model:value="collectionStore.form.behaviour.reserve"
          :min="0"
          :step="1"
          :max="collectionStore.form.behaviour.maxSupply"
          :input-props="{ id: 'reserve' }"
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
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();
const { booleanSelect, formRef, supplyTypes, rules, disablePasteDate } = useCollection();

function infoLabel(field: string) {
  if (
    $i18n.te(`form.label.${field}`) &&
    $i18n.te(`nft.collection.labelInfo.${field}`) &&
    $i18n.t(`nft.collection.labelInfo.${field}`)
  ) {
    return [
      h('span', { class: 'mr-1' }, $i18n.t(`form.label.${field}`)),
      h(
        resolveComponent('IconInfo'),
        { size: 'sm', tooltip: $i18n.t(`nft.collection.labelInfo.${field}`) },
        ''
      ),
    ];
  }
  return $i18n.te(`form.label.${field}`) ? $i18n.t(`form.label.${field}`) : field;
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
      collectionStore.stepDeploy = NftDeployStep.DEPLOY;
    }
  });
}
</script>
