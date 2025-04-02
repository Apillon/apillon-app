<template>
  <n-form
    ref="formRef"
    class="max-w-xl"
    :model="metadataStore.form.smartContract"
    :rules="rules"
    @submit.prevent="handleSubmitForm"
  >
    <h4>{{ $t('nft.collection.smartContract') }}</h4>
    <p class="mb-6">{{ $t('nft.collection.instruction.smartContract') }}</p>

    <n-grid :cols="12" :x-gap="32">
      <!--  Collection name -->
      <n-form-item-gi :span="8" path="name" :label="infoLabel('name')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="metadataStore.form.smartContract.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>

      <!--  Collection Symbol -->
      <n-form-item-gi :span="4" path="symbol" :label="infoLabel('symbol')" :label-props="{ for: 'symbol' }">
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

    <!--  Collection type -->
    <n-form-item
      v-if="
        isFeatureEnabled(Feature.NFT_NESTABLE, authStore.getUserRoles()) &&
        metadataStore.form.smartContract.chainType === ChainType.EVM
      "
      path="collectionType"
      :label="infoLabel('type')"
      :label-props="{ for: 'collectionType' }"
    >
      <select-options
        v-model:value="metadataStore.form.smartContract.collectionType"
        :options="collectionTypes"
        :input-props="{ id: 'collectionType' }"
        :placeholder="$t('general.pleaseSelect')"
        filterable
        clearable
      />
    </n-form-item>

    <!--  Chain -->
    <n-form-item v-if="showNetwork" path="chain" :label="infoLabel('chain')" :label-props="{ for: 'chain' }">
      <select-options
        v-model:value="metadataStore.form.smartContract.chain"
        :options="chains"
        :input-props="{ id: 'chain' }"
        :placeholder="$t('general.pleaseSelect')"
        filterable
        clearable
      />
    </n-form-item>

    <!-- Admin Address -->
    <n-form-item
      v-if="metadataStore.form.smartContract.chainType !== ChainType.SUBSTRATE"
      path="adminAddress"
      :label="infoLabel('adminAddress')"
      :label-props="{ for: 'adminAddress' }"
    >
      <FormFieldWalletAddress
        v-model:value="metadataStore.form.smartContract.adminAddress"
        :input-props="{ id: 'adminAddress' }"
        @connected="address => (metadataStore.form.smartContract.adminAddress = address)"
      />
    </n-form-item>

    <!--  Collection Use Gateway -->
    <n-form-item v-if="!isUnique" path="useApillonIpfsGateway" :show-label="false" :show-feedback="false">
      <n-checkbox
        id="useApillonIpfsGateway"
        v-model:checked="metadataStore.form.smartContract.useApillonIpfsGateway"
        size="medium"
        :label="infoLabel('useGateway')"
      />
    </n-form-item>

    <!--  Collection Dynamic metadata -->
    <n-form-item v-if="!isUnique && showIpns" path="useIpns" :show-label="false" :show-feedback="false">
      <n-checkbox
        v-model:checked="metadataStore.form.smartContract.useIpns"
        size="medium"
        :label="infoLabel('useIpns')"
      />
    </n-form-item>

    <div class="my-6">
      <h4>{{ $t('nft.collection.behavior') }}</h4>
      <p>{{ $t('nft.collection.behaviorInfo') }}</p>
    </div>

    <n-grid class="items-end" :class="{ 'mt-8': !isUnique }" :cols="12" :x-gap="32">
      <!-- Collection Total supply -->
      <n-form-item-gi
        path="supplyLimited"
        :span="6"
        :label="infoLabel('supplyLimited')"
        :label-props="{ for: 'supplyLimited' }"
      >
        <select-options
          v-model:value="metadataStore.form.smartContract.supplyLimited"
          :options="supplyTypes"
          :input-props="{ id: 'supplyLimited' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
          clearable
        />
      </n-form-item-gi>

      <!--  Collection Max supply -->
      <n-form-item-gi path="maxSupply" :span="6" :label="infoLabel('maxSupply')" :label-props="{ for: 'maxSupply' }">
        <n-input-number
          v-model:value="metadataStore.form.smartContract.maxSupply"
          :min="0"
          :max="NFT_MAX_SUPPLY"
          :disabled="!metadataStore.form.smartContract.supplyLimited"
          :input-props="{ id: 'maxSupply' }"
          :placeholder="
            metadataStore.form.smartContract.supplyLimited
              ? t('form.placeholder.collectionMaxSupply')
              : t('form.disabled')
          "
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid
      v-if="metadataStore.form.smartContract.chainType === ChainType.EVM || isUnique"
      class="items-end"
      :cols="metadataStore.form.smartContract.collectionType === NFTCollectionType.NESTABLE ? 8 : 12"
      :x-gap="32"
    >
      <!-- Collection Revocable -->
      <n-form-item-gi path="revocable" :span="4" :label="infoLabel('revocable')" :label-props="{ for: 'revocable' }">
        <select-options
          v-model:value="metadataStore.form.smartContract.revocable"
          :options="booleanSelect"
          :input-props="{ id: 'revocable' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
        />
      </n-form-item-gi>

      <!-- Collection Soulbound -->
      <n-form-item-gi path="soulbound" :span="4" :label="infoLabel('soulbound')" :label-props="{ for: 'soulbound' }">
        <select-options
          v-model:value="metadataStore.form.smartContract.soulbound"
          :options="booleanSelect"
          :input-props="{ id: 'soulbound' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
        />
      </n-form-item-gi>

      <!-- Collection AutoIncrement -->
      <n-form-item-gi
        v-show="metadataStore.form.smartContract.collectionType === NFTCollectionType.GENERIC"
        path="isAutoIncrement"
        :span="4"
        :label="infoLabel('autoIncrement')"
        :label-props="{ for: 'autoIncrement' }"
      >
        <select-options
          v-model:value="metadataStore.form.smartContract.isAutoIncrement"
          :options="booleanSelect"
          :input-props="{ id: 'autoIncrement' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
        />
      </n-form-item-gi>
    </n-grid>

    <FormInstructions
      v-if="metadataStore.form.smartContract.chainType === ChainType.EVM && !isUnique"
      class="lg:w-[150%]"
      :title="$t('nft.collection.royalties')"
      :instructions="[$t('nft.collection.royaltiesInfo')]"
    >
      <n-grid class="items-end" :cols="12" :x-gap="32">
        <!-- <n-form-item-gi :span="12" :show-label="false">
        <div>
          <h4>{{ $t('nft.collection.behavior') }}</h4>
          <p>{{ $t('nft.collection.behaviorInfo') }}</p>
        </div>
      </n-form-item-gi> -->

        <!-- Royalties Fees -->
        <n-form-item-gi
          path="royaltiesFees"
          :span="4"
          :label="infoLabel('royaltiesFees')"
          :label-props="{ for: 'royaltiesFees' }"
        >
          <n-input-number
            v-model:value="metadataStore.form.smartContract.royaltiesFees"
            :min="0"
            :max="100"
            :input-props="{ id: 'royaltiesFees' }"
            :placeholder="$t('general.typeHere')"
            clearable
          >
            <template #suffix>%</template>
          </n-input-number>
        </n-form-item-gi>

        <!-- Royalties Address -->
        <n-form-item-gi
          path="royaltiesAddress"
          :span="8"
          :label="infoLabel('royaltiesAddress')"
          :label-props="{ for: 'royaltiesAddress' }"
        >
          <FormFieldWalletAddress
            v-model:value="metadataStore.form.smartContract.royaltiesAddress"
            :input-props="{ id: 'royaltiesAddress' }"
            @connected="address => (metadataStore.form.smartContract.royaltiesAddress = address)"
          />
        </n-form-item-gi>
      </n-grid>
    </FormInstructions>

    <n-grid v-if="!isUnique" class="items-end" :cols="12" :x-gap="32">
      <n-form-item-gi :span="12" :show-label="false">
        <div>
          <h4>{{ $t('nft.collection.drop') }}</h4>
          <p>{{ $t('nft.collection.dropInfo') }}</p>
        </div>
      </n-form-item-gi>
      <!--  Collection Is Drop -->
      <n-form-item-gi path="drop" :span="6" :label="infoLabel('drop')">
        <n-switch id="drop" v-model:value="metadataStore.form.smartContract.drop" size="medium" class="!ml-0" />
        <strong v-if="metadataStore.form.smartContract.drop" class="text-xs text-green">
          {{ $t('form.switch.on') }}
        </strong>
        <span v-else class="text-xs text-disabled">{{ $t('form.switch.off') }}</span>
      </n-form-item-gi>
    </n-grid>

    <n-grid v-if="!!metadataStore.form.smartContract.drop" class="items-end" :cols="12" :x-gap="32">
      <!--  Collection Mint price -->
      <n-form-item-gi
        path="dropPrice"
        :span="6"
        :label="
          $t('form.label.collection.dropPrice', { currency: chainCurrency(metadataStore.form.smartContract.chain) })
        "
        :label-props="{ for: 'dropPrice' }"
      >
        <n-input-number
          v-model:value="metadataStore.form.smartContract.dropPrice"
          :min="0.00001"
          :max="10000000000"
          :step="0.00001"
          :input-props="{ id: 'dropPrice' }"
          clearable
        />
      </n-form-item-gi>

      <!--  Collection Drop start -->
      <n-form-item-gi path="dropStart" :span="6" :label="infoLabel('dropStart')" :label-props="{ for: 'dropStart' }">
        <n-date-picker
          v-model:value="metadataStore.form.smartContract.dropStart"
          class="w-full"
          type="datetime"
          :input-props="{ id: 'dropStart' }"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <n-grid v-if="!!metadataStore.form.smartContract.drop" class="items-end" :cols="12" :x-gap="32">
      <!--  Collection Reserve -->
      <n-form-item-gi
        v-if="metadataStore.form.smartContract.chainType === ChainType.EVM"
        path="dropReserve"
        :span="6"
        :label="infoLabel('dropReserve')"
        :label-props="{ for: 'dropReserve' }"
      >
        <n-input-number
          v-model:value="metadataStore.form.smartContract.dropReserve"
          :min="0"
          :step="1"
          :input-props="{ id: 'dropReserve' }"
          clearable
        />
      </n-form-item-gi>

      <!-- Royalties Address -->
      <n-form-item-gi
        v-if="metadataStore.form.smartContract.chainType === ChainType.SUBSTRATE"
        path="royaltiesAddress"
        :span="6"
        :label="infoLabel('dropAddress')"
        :label-props="{ for: 'royaltiesAddress' }"
      >
        <n-input
          v-model:value="metadataStore.form.smartContract.royaltiesAddress"
          :input-props="{ id: 'royaltiesAddress' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <!--  Form submit -->
    <n-form-item v-if="!hideSubmit" :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.proceed')" />
      <Btn type="primary" class="mt-2 w-full" @click="handleSubmitForm">
        {{ $t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { Feature } from '~/lib/types/config';
import { isFeatureEnabled } from '~/lib/utils';
import { chainCurrency } from '~/lib/utils/chain';
import { NFT_MAX_SUPPLY } from '~/lib/values/general.values';
import { ChainType, NFTCollectionType } from '~/lib/types/nft';

defineProps({
  hideSubmit: { type: Boolean, default: false },
  showNetwork: { type: Boolean, default: true },
  showIpns: { type: Boolean, default: true },
});
const { t } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const metadataStore = useMetadataStore();

const { labelInfo } = useComputing();
const {
  booleanSelect,
  collectionTypes,
  nftChains,
  chainsTestnet,
  formRef,
  isUnique,
  supplyTypes,
  rules,
  isChainAvailable,
} = useCollection();
defineExpose({ formRef, handleSubmitForm });

onMounted(() => {
  if (metadataStore.form.smartContract.maxSupply === 0) {
    metadataStore.form.smartContract.maxSupply = metadataStore.csvData.length;
  }
});

const chains = computed(() => [...nftChains, ...chainsTestnet].filter(chain => isChainAvailable(chain.value)));

function infoLabel(field: string) {
  return labelInfo(field, 'form.label.collection');
}

// Submit
async function handleSubmitForm(e?: Event | MouseEvent): Promise<boolean> {
  e?.preventDefault();
  return !(
    await formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
      errors?.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    })
  )?.warnings;
}
</script>
