<template>
  <div>
    <Notification v-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <p v-else-if="$i18n.te('nft.collection.infoNew')" class="text-body mb-8">
      {{ $t('nft.collection.infoNew') }}
    </p>

    <n-form
      ref="formRef"
      :class="{ 'form-errors': formErrors }"
      :model="collectionStore.form"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <n-grid class="items-end" :cols="12" :x-gap="32">
        <!--  Collection name -->
        <n-form-item-gi
          :span="8"
          path="base.name"
          :label="infoLabel('collectionName')"
          :label-props="{ for: 'name' }"
        >
          <n-input
            v-model:value="collectionStore.form.base.name"
            :input-props="{ id: 'name' }"
            :placeholder="$t('general.typeHere')"
            clearable
          />
        </n-form-item-gi>

        <!--  Collection Symbol -->
        <n-form-item-gi
          :span="4"
          path="base.symbol"
          :label="infoLabel('collectionSymbol')"
          :label-props="{ for: 'symbol' }"
        >
          <n-input
            v-model:value="collectionStore.form.base.symbol"
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
        path="base.chain"
        :label="infoLabel('collectionChain')"
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

      <!--  Chain type -->
      <n-form-item
        v-show="collectionStore.form.base.chain === Chains.ASTAR"
        path="base.chainType"
        :label="infoLabel('collectionChainType')"
        :label-props="{ for: 'chainType' }"
      >
        <select-options
          v-model:value="collectionStore.form.base.chainType"
          :options="chainTypes"
          :input-props="{ id: 'chainType' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
          clearable
        />
      </n-form-item>

      <!--  Collection type -->
      <n-form-item
        v-if="isFeatureEnabled(Feature.NFT_NESTABLE, authStore.getUserRoles())"
        path="base.collectionType"
        :label="infoLabel('collectionType')"
        :label-props="{ for: 'collectionType' }"
      >
        <select-options
          v-model:value="collectionStore.form.base.collectionType"
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
          path="behavior.baseUri"
          :label-props="{ for: 'baseUri' }"
          :label="infoLabel('collectionBaseUri')"
        >
          <n-input
            v-model:value="collectionStore.form.behavior.baseUri"
            :input-props="{ id: 'baseUri' }"
            :placeholder="$t('general.typeHere')"
            clearable
          />
        </n-form-item-gi>

        <!--  Collection Base Extension -->
        <n-form-item-gi
          :class="{ 'hide-feedback': !!metadataUri }"
          :span="4"
          path="behavior.baseExtension"
          :label="infoLabel('collectionBaseExtension')"
          :label-props="{ for: 'baseExtension' }"
        >
          <n-input
            v-model:value="collectionStore.form.behavior.baseExtension"
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
          path="behavior.supplyLimited"
          :span="6"
          :label-props="{ for: 'supplyLimited' }"
          :label="infoLabel('collectionSupplyLimited')"
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
          path="behavior.maxSupply"
          :span="6"
          :label-props="{ for: 'maxSupply' }"
          :label="infoLabel('collectionMaxSupply')"
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

      <n-grid class="items-end" :cols="12" :x-gap="32">
        <!-- Collection Revocable -->
        <n-form-item-gi
          path="behavior.revocable"
          :span="6"
          :label-props="{ for: 'revocable' }"
          :label="infoLabel('collectionRevocable')"
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
          path="behavior.soulbound"
          :span="6"
          :label-props="{ for: 'soulbound' }"
          :label="infoLabel('collectionSoulbound')"
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

      <n-grid class="items-end" :cols="12" :x-gap="32">
        <!-- Royalties Address -->
        <n-form-item-gi
          path="behavior.royaltiesAddress"
          :span="6"
          :label="infoLabel('collectionRoyaltiesAddress')"
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
          path="behavior.royaltiesFees"
          :span="6"
          :label="infoLabel('collectionRoyaltiesFees')"
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

      <!--  Collection Is Drop -->
      <n-form-item path="behavior.drop" :span="1" :show-label="false">
        <n-checkbox
          v-model:checked="collectionStore.form.behavior.drop"
          size="medium"
          :label="infoLabel('collectionDrop')"
        />
      </n-form-item>

      <n-grid v-if="!!collectionStore.form.behavior.drop" :cols="12" :x-gap="32">
        <!--  Collection Mint price -->
        <n-form-item-gi
          path="behavior.dropPrice"
          :span="6"
          :label="$t('form.label.collectionDropPrice', { currency: chainCurrency() })"
          :label-props="{ for: 'dropPrice' }"
        >
          <n-input-number
            v-model:value="collectionStore.form.behavior.dropPrice"
            :min="0"
            :max="1000"
            :step="0.001"
            :input-props="{ id: 'dropPrice' }"
            :placeholder="$t('general.typeHere')"
            clearable
          />
        </n-form-item-gi>

        <!--  Collection Drop start -->
        <n-form-item-gi
          path="behavior.dropStart"
          :span="6"
          :label="infoLabel('collectionDropStart')"
        >
          <n-date-picker
            v-model:value="collectionStore.form.behavior.dropStart"
            class="w-full"
            type="datetime"
            :is-date-disabled="disablePasteDate"
            :is-time-disabled="disablePasteTime"
            clearable
          />
        </n-form-item-gi>
      </n-grid>

      <n-grid v-if="!!collectionStore.form.behavior.drop" :cols="12" :x-gap="32">
        <!--  Collection Reserve -->
        <n-form-item-gi
          path="behavior.dropReserve"
          :span="6"
          :label="infoLabel('collectionDropReserve')"
        >
          <n-input-number
            v-model:value="collectionStore.form.behavior.dropReserve"
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
      @submit="onModalW3WarnConfirm"
    >
      {{ $t('w3Warn.nft.new') }}
    </W3Warn>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();

const authStore = useAuthStore();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();

const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);
const { getPriceServiceName } = useNft();
const {
  booleanSelect,
  chains,
  chainTypes,
  collectionTypes,
  formRef,
  loading,
  supplyTypes,
  rules,
  isFormDisabled,
  chainCurrency,
  disablePasteDate,
  disablePasteTime,
  infoLabel,
  onChainChange,
  prepareFormData,
} = useCollection();

const formErrors = ref<boolean>(false);

const metadataUri = computed<string>(() => {
  const baseUri = removeLastSlash(collectionStore.form.behavior.baseUri);
  return collectionStore.form.behavior.baseUri && collectionStore.form.behavior.baseExtension
    ? baseUri + '/1' + collectionStore.form.behavior.baseExtension
    : baseUri
    ? baseUri + '/1.' + $i18n.t('nft.collection.extension')
    : '';
});

watch(
  () => collectionStore.form.base.chain,
  chain => {
    onChainChange(chain);
  }
);

/** When user close W3Warn, allow him to create new collection */
function onModalW3WarnConfirm() {
  warningStore.showSpendingWarning(getPriceServiceName(), () => createCollection());
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
    } else if (!localStorage.getItem(LsW3WarnKeys.NFT_NEW) && $i18n.te('w3Warn.nft.new')) {
      modalW3WarnVisible.value = true;
    } else {
      warningStore.showSpendingWarning(getPriceServiceName(), () => createCollection());
    }
  });
}

async function createCollection() {
  loading.value = true;

  try {
    const res = await $api.post<CollectionResponse>(endpoints.collections(), prepareFormData(true));

    message.success($i18n.t('form.success.created.collection'));

    /** On new collection created add new collection to list */
    collectionStore.items.push(res.data);

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
