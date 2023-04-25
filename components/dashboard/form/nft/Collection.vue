<template>
  <div>
    <!-- Notification - show if qouta has been reached -->
    <Notification v-if="isQuotaReached" type="warning" class="w-full mb-8">
      {{ $t('nft.collection.quotaReached') }}
    </Notification>
    <Notification v-else-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <template v-else>
      <!-- Info text -->
      <p v-if="$i18n.te('nft.collection.infoNew')" class="text-body mb-8">
        {{ $t('nft.collection.infoNew') }}
      </p>
    </template>

    <n-form
      ref="formRef"
      :class="{ 'form-errors': formErrors }"
      :model="formData"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
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
            v-model:value="formData.name"
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
            v-model:value="formData.symbol"
            :minlength="1"
            :maxlength="8"
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
          v-model:value="formData.chain"
          :options="chains"
          :input-props="{ id: 'chain' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
          clearable
        />
      </n-form-item>

      <n-grid class="items-end" :cols="12" :x-gap="32">
        <!--  Collection Base URI -->
        <n-form-item-gi
          :class="{ 'hide-feedback': !!metadataUri }"
          :span="8"
          path="baseUri"
          :label-props="{ for: 'baseUri' }"
          :label="infoLabel('collectionBaseUri')"
        >
          <n-input
            v-model:value="formData.baseUri"
            :input-props="{ id: 'baseUri' }"
            :placeholder="$t('form.placeholder.collectionBaseUri')"
            clearable
          />
        </n-form-item-gi>

        <!--  Collection Base Extension -->
        <n-form-item-gi
          :class="{ 'hide-feedback': !!metadataUri }"
          :span="4"
          path="baseExtension"
          :label="infoLabel('collectionBaseExtension')"
          :label-props="{ for: 'baseExtension' }"
        >
          <n-input
            v-model:value="formData.baseExtension"
            :input-props="{ id: 'baseExtension' }"
            :placeholder="$t('form.placeholder.collectionBaseExtension')"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi v-if="metadataUri" :span="12" :show-label="false">
          <div class="w-full text-sm break-words">{{ metadataUri }}</div>
        </n-form-item-gi>
      </n-grid>

      <n-grid class="items-end" :cols="12" :x-gap="32">
        <!-- Collection Total supply -->
        <n-form-item-gi
          path="supplyLimited"
          :span="6"
          :label-props="{ for: 'supplyLimited' }"
          :label="infoLabel('collectionTotalSupply')"
        >
          <select-options
            v-model:value="formData.supplyLimited"
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
          :label-props="{ for: 'maxSupply' }"
          :label="infoLabel('collectionMaxSupply')"
        >
          <n-input-number
            v-model:value="formData.maxSupply"
            :min="0"
            :max="NFT_MAX_SUPPLY"
            :disabled="!formData.supplyLimited"
            :input-props="{ id: 'maxSupply' }"
            :placeholder="
              formData.supplyLimited
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
          :label-props="{ for: 'revocable' }"
          :label="infoLabel('collectionRevocable')"
        >
          <select-options
            v-model:value="formData.revocable"
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
          :label-props="{ for: 'soulbound' }"
          :label="infoLabel('collectionSoulbound')"
        >
          <select-options
            v-model:value="formData.soulbound"
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
            placeholder="Royalties Address"
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
            placeholder="Royalties Fees"
            clearable
          />
        </n-form-item-gi>
      </n-grid>

      <!--  Collection Is Drop -->
      <n-form-item path="isDrop" :span="1" :show-label="false">
        <n-checkbox
          v-model:checked="formData.isDrop"
          size="medium"
          :label="$t('form.label.collectionIsDrop')"
        />
      </n-form-item>

      <n-grid v-if="!!formData.isDrop" :cols="12" :x-gap="32">
        <!--  Collection Mint price -->
        <n-form-item-gi
          path="mintPrice"
          :span="6"
          :label="infoLabel('collectionMintPrice')"
          :label-props="{ for: 'mintPrice' }"
        >
          <n-input-number
            v-model:value="formData.mintPrice"
            :min="0"
            :max="1000"
            :step="0.001"
            :input-props="{ id: 'mintPrice' }"
            :placeholder="$t('form.placeholder.collectionMintPrice')"
            clearable
          />
        </n-form-item-gi>

        <!--  Collection Drop start -->
        <n-form-item-gi path="dropStart" :span="6" :label="infoLabel('collectionDropStart')">
          <n-date-picker
            v-model:value="formData.dropStart"
            class="w-full"
            type="datetime"
            :is-date-disabled="disablePasteDate"
            clearable
          />
        </n-form-item-gi>
      </n-grid>

      <n-grid v-if="!!formData.isDrop" :cols="12" :x-gap="32">
        <!--  Collection Reserve -->
        <n-form-item-gi path="reserve" :span="6" :label="$t('form.label.collectionReserve')">
          <n-input-number
            v-model:value="formData.reserve"
            :min="0"
            :placeholder="$t('form.placeholder.collectionReserve')"
            clearable
          />
        </n-form-item-gi>
      </n-grid>

      <!--  Form submit -->
      <n-form-item :show-label="false">
        <input type="submit" class="hidden" :value="$t('nft.collection.create')" />
        <Btn
          type="primary"
          size="large"
          :loading="loading"
          :disabled="isFormDisabled"
          @click="handleSubmit"
        >
          {{ $t('nft.collection.create') }}
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { h } from 'vue';

const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();
const settingsStore = useSettingsStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const chains = [
  { label: 'Moonbeam', value: Chains.MOONBEAM },
  { label: 'Moonbase', value: Chains.MOONBASE },
  // { label: 'Astar Shibuya', value: Chains.ASTAR_SHIBUYA },
  // { label: 'Astar', value: Chains.ASTAR },
];

const formErrors = ref<boolean>(false);
const formData = ref<FormCollection>({
  name: '',
  symbol: '',
  chain: Chains.MOONBASE,
  mintPrice: 0,
  supplyLimited: 0,
  maxSupply: 0,
  baseUri: '',
  baseExtension: '',
  isDrop: false,
  dropStart: Date.now() + 3600000,
  reserve: 0,
  revocable: false,
  soulbound: false,
  royaltiesAddress: '',
  royaltiesFees: 0,
});

const supplyTypes = [
  { label: $i18n.t('form.supplyTypes.unlimited'), value: 0 },
  { label: $i18n.t('form.supplyTypes.limited'), value: 1 },
];
const booleanSelect = [
  { label: $i18n.t('form.booleanSelect.true'), value: true },
  { label: $i18n.t('form.booleanSelect.false'), value: false },
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
      required: true,
      message: $i18n.t('validation.collectionBaseUriRequired'),
    },
    {
      type: 'url',
      message: $i18n.t('validation.collectionBaseUri'),
    },
  ],
  baseExtension: [
    {
      required: true,
      message: $i18n.t('validation.collectionBaseExtensionRequired'),
    },
  ],
  maxSupply: [
    {
      max: NFT_MAX_SUPPLY,
      validator: validateMaxSupply,
      message: $i18n.t('validation.collectionMaxSupplyReached', { max: NFT_MAX_SUPPLY }),
    },
  ],
  mintPrice: [
    {
      required: true,
      message: $i18n.t('validation.collectionMintPriceRequired'),
    },
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

const metadataUri = computed<string>(() => {
  return formData.value.baseUri && formData.value.baseExtension
    ? formData.value.baseUri + '1' + formData.value.baseExtension
    : formData.value.baseUri
    ? formData.value.baseUri + '1.' + $i18n.t('nft.collection.extension')
    : '';
});

const isQuotaReached = computed<boolean>(() => {
  return collectionStore.quotaReached === true;
});
const isFormDisabled = computed<boolean>(() => {
  return isQuotaReached.value || settingsStore.isProjectUser();
});
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

/**
 * Validations
 */
function validateReserve(_: NFormItemRule, value: number): boolean {
  return formData.value?.maxSupply === 0 || value <= (formData.value?.maxSupply || 0);
}
function validateMaxSupply(_: NFormItemRule, value: number): boolean {
  return value <= NFT_MAX_SUPPLY;
}
function validateBaseExtension(_: NFormItemRule, value: number): boolean {
  return !formData.value.baseUri || !!value;
}
function validateDropStart(_: NFormItemRule, value: number): boolean {
  return !formData.value.isDrop || value > Date.now();
}
function validateMintPrice(_: NFormItemRule, value: number): boolean {
  return !formData.value.isDrop || (value >= 0 && value < 999999);
}
function disablePasteDate(ts: number) {
  return ts < Date.now();
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    formErrors.value = !!errors;
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      await createCollection();
    }
  });
}

async function createCollection() {
  loading.value = true;

  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  try {
    const bodyData = {
      project_uuid: dataStore.projectUuid,
      name: formData.value.name,
      symbol: formData.value.symbol,
      mintPrice: formData.value.mintPrice,
      maxSupply: formData.value.supplyLimited === 1 ? formData.value.maxSupply : 0,
      baseUri: formData.value.baseUri,
      baseExtension: formData.value.baseExtension,
      isDrop: formData.value.isDrop,
      dropStart: Math.floor((formData.value.dropStart || Date.now()) / 1000),
      reserve: formData.value.reserve,
      isRevokable: formData.value.revocable,
      isSoulbound: formData.value.soulbound,
      royaltiesAddress: formData.value.royaltiesAddress,
      royaltiesFees: formData.value.royaltiesFees,
    };
    const res = await $api.post<CollectionResponse>(endpoints.collections(), bodyData);

    message.success($i18n.t('form.success.created.collection'));

    /** On new collection created add new collection to list */
    collectionStore.items.push(res.data);

    /** Reset collection qouta limit */
    collectionStore.quotaReached = undefined;
    collectionStore.resetMetadata();
    collectionStore.resetForms();

    /** Emit events */
    emit('submitSuccess');

    /** Redirect to new web page */
    router.push(`/dashboard/service/nft/${res.data.id}`);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
