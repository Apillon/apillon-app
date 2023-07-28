<template>
  <div>
    <!-- Notification - show if qouta has been reached -->
    <Notification v-if="isQuotaReached" type="warning" class="w-full mb-8">
      {{ $t('nft.collection.quotaReached') }}
    </Notification>
    <Notification v-else-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <p v-else-if="$i18n.te('nft.collection.infoNew')" class="text-body mb-8">
      {{ $t('nft.collection.infoNew') }}
    </p>

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
          :label="infoLabel('collectionName')"
          :label-props="{ for: 'name' }"
        >
          <n-input
            v-model:value="formData.name"
            :input-props="{ id: 'name' }"
            :placeholder="$t('general.typeHere')"
            clearable
          />
        </n-form-item-gi>

        <!--  Collection Symbol -->
        <n-form-item-gi
          :span="4"
          path="symbol"
          :label="infoLabel('collectionSymbol')"
          :label-props="{ for: 'symbol' }"
        >
          <n-input
            v-model:value="formData.symbol"
            :minlength="1"
            :maxlength="8"
            :input-props="{ id: 'symbol' }"
            :placeholder="$t('general.typeHere')"
            clearable
          />
        </n-form-item-gi>
      </n-grid>

      <!--  Chain -->
      <n-form-item
        path="chain"
        :label="infoLabel('collectionChain')"
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

      <!--  Collection type -->
      <n-form-item
        path="collectionType"
        :label="infoLabel('collectionType')"
        :label-props="{ for: 'collectionType' }"
      >
        <select-options
          v-model:value="formData.collectionType"
          :options="collectionTypes"
          :input-props="{ id: 'collectionType' }"
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
            :placeholder="$t('general.typeHere')"
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
            :placeholder="$t('general.typeHere')"
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
          :label="infoLabel('collectionSupplyLimited')"
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
          />
        </n-form-item-gi>
      </n-grid>

      <n-grid class="items-end" :cols="12" :x-gap="32">
        <!-- Royalties Address -->
        <n-form-item-gi
          path="royaltiesAddress"
          :span="6"
          :label="infoLabel('collectionRoyaltiesAddress')"
          :label-props="{ for: 'royaltiesAddress' }"
        >
          <n-input
            v-model:value="formData.royaltiesAddress"
            :input-props="{ id: 'royaltiesAddress' }"
            :placeholder="$t('general.typeHere')"
            clearable
          />
        </n-form-item-gi>

        <!-- Royalties Fees -->
        <n-form-item-gi
          path="royaltiesFees"
          :span="6"
          :label="infoLabel('collectionRoyaltiesFees')"
          :label-props="{ for: 'royaltiesFees' }"
        >
          <n-input-number
            v-model:value="formData.royaltiesFees"
            :min="0"
            :max="100"
            :input-props="{ id: 'royaltiesFees' }"
            :placeholder="$t('general.typeHere')"
            clearable
          />
        </n-form-item-gi>
      </n-grid>

      <!--  Collection Is Drop -->
      <n-form-item path="drop" :span="1" :show-label="false">
        <n-checkbox
          v-model:checked="formData.drop"
          size="medium"
          :label="infoLabel('collectionDrop')"
        />
      </n-form-item>

      <n-grid v-if="!!formData.drop" :cols="12" :x-gap="32">
        <!--  Collection Mint price -->
        <n-form-item-gi
          path="dropPrice"
          :span="6"
          :label="$t('form.label.collectionDropPrice', { currency: chainCurrency })"
          :label-props="{ for: 'dropPrice' }"
        >
          <n-input-number
            v-model:value="formData.dropPrice"
            :min="0"
            :max="1000"
            :step="0.001"
            :input-props="{ id: 'dropPrice' }"
            :placeholder="$t('general.typeHere')"
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

      <n-grid v-if="!!formData.drop" :cols="12" :x-gap="32">
        <!--  Collection Reserve -->
        <n-form-item-gi path="dropReserve" :span="6" :label="infoLabel('collectionDropReserve')">
          <n-input-number
            v-model:value="formData.dropReserve"
            :min="0"
            :placeholder="$t('general.typeHere')"
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

    <W3Warn
      v-model:show="modalW3WarnVisible"
      :btn-text="$t('nft.collection.upload')"
      @update:show="onModalW3WarnConfirm"
    >
      {{ $t('w3Warn.nft.new') }}
    </W3Warn>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const emit = defineEmits(['submitSuccess']);
const modalW3WarnVisible = ref<boolean>(false);

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();
const {
  booleanSelect,
  chains,
  collectionTypes,
  formRef,
  loading,
  supplyTypes,
  rules,
  isFormDisabled,
  isQuotaReached,
  disablePasteDate,
} = useCollection();

const formErrors = ref<boolean>(false);
const formData = ref<FormCollection>({
  name: '',
  symbol: '',
  chain: Chains.MOONBEAM,
  collectionType: NFTCollectionType.GENERIC,
  dropPrice: 0,
  supplyLimited: 0,
  maxSupply: 0,
  baseUri: null,
  baseExtension: null,
  drop: false,
  dropStart: Date.now() + 3600000,
  dropReserve: 0,
  revocable: false,
  soulbound: false,
  royaltiesAddress: '',
  royaltiesFees: 0,
});

const metadataUri = computed<string>(() => {
  return formData.value.baseUri && formData.value.baseExtension
    ? formData.value.baseUri + '1' + formData.value.baseExtension
    : formData.value.baseUri
    ? formData.value.baseUri + '1.' + $i18n.t('nft.collection.extension')
    : '';
});

const chainCurrency = computed<string>(() => {
  switch (formData.value.chain) {
    case Chains.ASTAR:
      return 'ASTR';
    default:
      return 'GLMR';
  }
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

/** When user close W3Warn, allow him to create new collection */
async function onModalW3WarnConfirm(value: boolean) {
  if (!value) {
    await createCollection();
  }
}

/** Watch modalW3WarnVisible, onShow update timestamp of shown modal in session storage */
watch(
  () => modalW3WarnVisible.value,
  shown => {
    if (shown) {
      sessionStorage.setItem(LsW3WarnKeys.NFT_NEW, Date.now().toString());
    }
  }
);

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    formErrors.value = !!errors;
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (!sessionStorage.getItem(LsW3WarnKeys.NFT_NEW) && $i18n.te('w3Warn.nft.new')) {
      modalW3WarnVisible.value = true;
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
      chain: formData.value.chain,
      collectionType: formData.value.collectionType,
      dropPrice: formData.value.dropPrice,
      maxSupply: formData.value.supplyLimited === 1 ? formData.value.maxSupply : 0,
      baseUri: formData.value.baseUri,
      baseExtension: formData.value.baseExtension,
      drop: formData.value.drop,
      dropStart: Math.floor((formData.value.dropStart || Date.now()) / 1000),
      dropReserve: formData.value.dropReserve,
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

    /** Redirect to Collections */
    router.push(`/dashboard/service/nft`);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
