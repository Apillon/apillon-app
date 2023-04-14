<template>
  <div class="flex justify-center items-center" style="min-height: calc(100vh - 300px)">
    <div
      v-if="
        isStepAvailable(NftDeployStep.DEPLOY) && collectionStore.stepDeploy === NftDeployStep.DEPLOY
      "
      class="w-full"
    >
      <NftPreview>
        <Btn class="max-w-lg w-full" type="primary" :loading="loading" @click="deploy">
          {{ $t('nft.collection.deploy') }}
        </Btn>
      </NftPreview>
    </div>

    <div
      v-else-if="
        isStepAvailable(NftDeployStep.BEHAVIOUR) &&
        collectionStore.stepDeploy === NftDeployStep.BEHAVIOUR
      "
    >
      <div class="text-center">
        <h2>{{ $t('nft.metadata.titleCollectionBehaviour') }}</h2>
        <p class="mb-8 text-body whitespace-pre-line">
          {{ $t('nft.metadata.infoCollectionBehaviour') }}
        </p>
      </div>
      <n-form
        ref="formBehaviourRef"
        :model="collectionStore.form.behaviour"
        :rules="rules"
        @submit.prevent="handleSubmitFormBehaviours"
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
          <!--  Collection Is Drop -->
          <n-form-item-gi path="isDrop" :span="6" :show-label="false">
            <n-checkbox
              v-model:checked="collectionStore.form.behaviour.isDrop"
              size="medium"
              :label="$t('form.label.collectionIsDrop')"
            />
          </n-form-item-gi>
        </n-grid>

        <n-grid
          v-if="!!collectionStore.form.behaviour.isDrop"
          class="items-end"
          :cols="12"
          :x-gap="32"
        >
          <!--  Collection Mint price -->
          <n-form-item-gi
            path="mintPrice"
            :span="6"
            :label="$t('form.label.collectionMintPrice')"
            :label-props="{ for: 'mintPrice' }"
          >
            <n-input-number
              v-model:value="collectionStore.form.behaviour.mintPrice"
              :input-props="{ id: 'mintPrice' }"
              :placeholder="$t('form.placeholder.collectionMintPrice')"
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

        <n-grid
          v-if="!!collectionStore.form.behaviour.isDrop"
          class="items-end"
          :cols="12"
          :x-gap="32"
        >
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
              :input-props="{ id: 'reserve' }"
              :placeholder="$t('form.placeholder.collectionReserve')"
              clearable
            />
          </n-form-item-gi>
        </n-grid>

        <!--  Form submit -->
        <n-form-item>
          <input type="submit" class="hidden" :value="$t('form.proceed')" />
          <Btn type="primary" class="w-full mt-2" @click="handleSubmitFormBehaviours">
            {{ $t('form.proceed') }}
          </Btn>
        </n-form-item>
      </n-form>
    </div>

    <div v-else class="w-full max-w-lg">
      <div class="text-center">
        <h2>{{ $t('nft.metadata.titleCollectionName') }}</h2>
        <p class="mb-8 text-body whitespace-pre-line">
          {{ $t('nft.metadata.infoCollectionName') }}
        </p>
      </div>
      <n-form
        ref="formNameRef"
        :model="collectionStore.form.base"
        :rules="rules"
        @submit.prevent="handleSubmitFormName"
      >
        <n-grid class="items-end" :cols="12" :x-gap="32">
          <!--  Collection name -->
          <n-form-item-gi
            :span="8"
            path="name"
            :label="$t('form.label.collectionName')"
            :label-props="{ for: 'name' }"
          >
            <n-input
              v-model:value="collectionStore.form.base.name"
              :input-props="{ id: 'name' }"
              :placeholder="$t('form.placeholder.collectionName')"
              clearable
            />
          </n-form-item-gi>

          <!--  Collection Symbol -->
          <n-form-item-gi
            :span="4"
            path="symbol"
            :label="$t('form.label.collectionSymbol')"
            :label-props="{ for: 'symbol' }"
          >
            <n-input
              v-model:value="collectionStore.form.base.symbol"
              :input-props="{ id: 'symbol' }"
              :placeholder="$t('form.placeholder.collectionSymbol')"
              clearable
            />
          </n-form-item-gi>
        </n-grid>

        <!--  Chain -->
        <n-form-item
          path="chain"
          :label="$t('form.label.collectionChain')"
          :label-props="{ for: 'chain' }"
        >
          <select-options
            v-model:value="collectionStore.form.base.chain"
            :options="chains"
            :input-props="{ id: 'chain' }"
            :placeholder="$t('general.pleaseSelect')"
            filterable
            clearable
          />
        </n-form-item>

        <!--  Form submit -->
        <n-form-item>
          <input type="submit" class="hidden" :value="$t('form.proceed')" />
          <Btn type="primary" class="w-full mt-2" @click="handleSubmitFormName">
            {{ $t('form.proceed') }}
          </Btn>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const emit = defineEmits(['submitSuccess']);
const { createThumbnailUrl, deployCollection, infoLabel } = useNft();

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();

const loading = ref(false);
const formNameRef = ref<NFormInst | null>(null);
const formBehaviourRef = ref<NFormInst | null>(null);

const chains = [
  { label: 'Moonbeam', value: Chains.MOONBEAM },
  { label: 'Moonbase', value: Chains.MOONBASE },
];
const supplyTypes = [
  { label: $i18n.t('form.supplyTypes.unlimited'), value: false },
  { label: $i18n.t('form.supplyTypes.limited'), value: true },
];
const booleanSelect = [
  { label: $i18n.t('form.booleanSelect.true'), value: 1 },
  { label: $i18n.t('form.booleanSelect.false'), value: 0 },
];

const rules: NFormRules = {
  symbol: [
    {
      required: true,
      message: $i18n.t('validation.collectionSymbolRequired'),
    },
  ],
  name: [
    {
      required: true,
      message: $i18n.t('validation.collectionNameRequired'),
    },
  ],
  baseUri: [
    {
      type: 'url',
      message: $i18n.t('validation.collectionBaseUri'),
    },
  ],
  maxSupply: [
    // {
    //   max: NFT_MAX_SUPPLY,
    //   validator: validateMaxSupply,
    //   message: $i18n.t('validation.collectionMaxSupplyReached', { max: NFT_MAX_SUPPLY }),
    // },
  ],
  mintPrice: [
    {
      validator: validateMintPrice,
      message: $i18n.t('validation.collectionMintPrice'),
    },
  ],
  dropStart: [
    {
      validator: validateDropStart,
      message: $i18n.t('validation.collectionDropStart'),
    },
  ],
  reserve: [
    {
      validator: validateReserve,
      message: $i18n.t('validation.collectionReserve'),
    },
  ],
};

function isStepAvailable(step: number) {
  if (step === NftDeployStep.DEPLOY) {
    return (
      !!collectionStore.form.behaviour.revocable !== null &&
      !!collectionStore.form.behaviour.soulbound !== null &&
      isStepAvailable(NftDeployStep.BEHAVIOUR)
    );
  } else if (step === NftDeployStep.BEHAVIOUR) {
    return !!collectionStore.form.base.name && !!collectionStore.form.base.symbol;
  }
  return true;
}

/**
 * Validations
 */
function validateReserve(_: NFormItemRule, value: number): boolean {
  return (
    !collectionStore.form.behaviour?.supplyLimited ||
    collectionStore.form.behaviour?.maxSupply === 0 ||
    value <= (collectionStore.form.behaviour?.maxSupply || 0)
  );
}
// function validateMaxSupply(_: NFormItemRule, value: number): boolean {
//   return value <= NFT_MAX_SUPPLY;
// }
function validateDropStart(_: NFormItemRule, value: number): boolean {
  return !collectionStore.form.behaviour.isDrop || value > Date.now();
}
function validateMintPrice(_: NFormItemRule, value: number): boolean {
  return !collectionStore.form.behaviour.isDrop || (value >= 0 && value < Number.MAX_SAFE_INTEGER);
}
function disablePasteDate(ts: number) {
  return ts < Date.now();
}

// Submit
function handleSubmitFormName(e: Event | MouseEvent) {
  e.preventDefault();
  formNameRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      collectionStore.stepDeploy = NftDeployStep.BEHAVIOUR;
    }
  });
}
function handleSubmitFormBehaviours(e: Event | MouseEvent) {
  e.preventDefault();
  formBehaviourRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      collectionStore.stepDeploy = NftDeployStep.DEPLOY;
    }
  });
}

async function deploy() {
  loading.value = true;
  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  try {
    const bodyData = {
      project_uuid: dataStore.projectUuid,
      name: collectionStore.form.base.name,
      symbol: collectionStore.form.base.symbol,
      chain: collectionStore.form.base.chain,
      baseExtension: collectionStore.form.behaviour.baseExtension,
      mintPrice: collectionStore.form.behaviour.mintPrice,
      maxSupply: collectionStore.form.behaviour.supplyLimited
        ? collectionStore.form.behaviour.maxSupply
        : 0,
      isDrop: collectionStore.form.behaviour.isDrop,
      dropStart: Math.floor((collectionStore.form.behaviour.dropStart || Date.now()) / 1000),
      reserve: collectionStore.form.behaviour.reserve,
      revocable: collectionStore.form.behaviour.revocable,
      soulbound: collectionStore.form.behaviour.soulbound,
    };
    const res = await $api.post<CollectionResponse>(endpoints.collections(), bodyData);
    collectionStore.active = res.data;

    /** On new collection created add new collection to list */
    collectionStore.items.push(res.data);

    await deployCollection();

    /** Reset collection qouta limit, metadata, forms */
    collectionStore.quotaReached = undefined;
    collectionStore.resetMetadata();
    collectionStore.resetForms();

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
