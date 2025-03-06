<template>
  <div>
    <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
      {{ t('dashboard.permissions.insufficient') }}
    </Notification>

    <FormInstructions :title="t('nft.collection.data')" :instructions="[t('nft.collection.instruction.data')]">
      <FormNftCollectionBase ref="formBaseRef" hide-submit />
    </FormInstructions>

    <n-form
      ref="formRef"
      :class="{ 'form-errors': formErrors }"
      :model="collectionStore.form"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <FormInstructions
        :title="t('nft.collection.smartContract')"
        :instructions="[t('nft.collection.instruction.smartContract')]"
      >
        <template #headerExtra>
          <div class="flex items-center gap-2 text-2xl">
            <NftChains :chains="enumKeys(EvmChainMainnet)" />
          </div>
        </template>

        <!--  Collection type -->
        <n-form-item
          v-if="
            isFeatureEnabled(Feature.NFT_NESTABLE, authStore.getUserRoles()) &&
            collectionStore.form.behavior.chainType === ChainType.EVM
          "
          path="base.collectionType"
          :label="infoLabel('type') as string"
          :label-props="{ for: 'collectionType' }"
        >
          <select-options
            v-model:value="collectionStore.form.behavior.collectionType"
            :options="collectionTypes"
            :input-props="{ id: 'collectionType' }"
            :placeholder="t('general.pleaseSelect')"
            filterable
            clearable
          />
        </n-form-item>

        <!--  Chain -->
        <n-form-item path="base.chain" :label="infoLabel('chain') as string" :label-props="{ for: 'chain' }">
          <select-options
            v-model:value="collectionStore.form.behavior.chain"
            :options="nftChains"
            :input-props="{ id: 'chain' }"
            :placeholder="t('general.pleaseSelect')"
            filterable
            clearable
          />
        </n-form-item>

        <!--  Chain type -->
        <n-form-item
          v-show="collectionStore.form.behavior.chain === EvmChainMainnet.ASTAR"
          path="base.chainType"
          :label="infoLabel('chainType') as string"
          :label-props="{ for: 'chainType' }"
        >
          <select-options
            v-model:value="collectionStore.form.behavior.chainType"
            :options="chainTypes"
            :input-props="{ id: 'chainType' }"
            :placeholder="t('general.pleaseSelect')"
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
            :label="infoLabel('baseUri') as string"
          >
            <n-input
              v-model:value="collectionStore.form.behavior.baseUri"
              :input-props="{ id: 'baseUri' }"
              :placeholder="t('general.typeHere')"
              clearable
            />
          </n-form-item-gi>

          <!--  Collection Base Extension -->
          <n-form-item-gi
            :class="{ 'hide-feedback': !!metadataUri }"
            :span="4"
            path="behavior.baseExtension"
            :label="infoLabel('baseExtension') as string"
            :label-props="{ for: 'baseExtension' }"
          >
            <n-input
              v-model:value="collectionStore.form.behavior.baseExtension"
              :input-props="{ id: 'baseExtension' }"
              :placeholder="t('general.typeHere')"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi v-if="metadataUri" :span="12" :show-label="false">
            <div class="w-full break-words text-sm">{{ metadataUri }}</div>
          </n-form-item-gi>
        </n-grid>

        <n-grid class="items-end" :cols="12" :x-gap="32">
          <!-- Collection Total supply -->
          <n-form-item-gi
            path="behavior.supplyLimited"
            :span="6"
            :label-props="{ for: 'supplyLimited' }"
            :label="infoLabel('supplyLimited') as string"
          >
            <select-options
              v-model:value="collectionStore.form.behavior.supplyLimited"
              :options="supplyTypes"
              :input-props="{ id: 'supplyLimited' }"
              :placeholder="t('general.pleaseSelect')"
              filterable
              clearable
            />
          </n-form-item-gi>

          <!--  Collection Max supply -->
          <n-form-item-gi
            path="behavior.maxSupply"
            :span="6"
            :label-props="{ for: 'maxSupply' }"
            :label="infoLabel('maxSupply') as string"
          >
            <n-input-number
              v-model:value="collectionStore.form.behavior.maxSupply"
              :min="0"
              :max="NFT_MAX_SUPPLY"
              :disabled="!collectionStore.form.behavior.supplyLimited"
              :input-props="{ id: 'maxSupply' }"
              :placeholder="
                collectionStore.form.behavior.supplyLimited
                  ? t('form.placeholder.collectionMaxSupply')
                  : t('form.disabled')
              "
              clearable
            />
          </n-form-item-gi>
        </n-grid>

        <n-grid
          v-if="collectionStore.form.behavior.chainType === ChainType.EVM || isUnique"
          class="items-end"
          :cols="12"
          :x-gap="32"
        >
          <!-- Collection Revocable -->
          <n-form-item-gi
            path="behavior.revocable"
            :span="6"
            :label-props="{ for: 'revocable' }"
            :label="infoLabel('revocable') as string"
          >
            <select-options
              v-model:value="collectionStore.form.behavior.revocable"
              :options="booleanSelect"
              :input-props="{ id: 'revocable' }"
              :placeholder="t('general.pleaseSelect')"
              filterable
            />
          </n-form-item-gi>

          <!-- Collection Soulbound -->
          <n-form-item-gi
            path="behavior.soulbound"
            :span="6"
            :label-props="{ for: 'soulbound' }"
            :label="infoLabel('soulbound') as string"
          >
            <select-options
              v-model:value="collectionStore.form.behavior.soulbound"
              :options="booleanSelect"
              :input-props="{ id: 'soulbound' }"
              :placeholder="t('general.pleaseSelect')"
              filterable
            />
          </n-form-item-gi>
        </n-grid>

        <n-grid
          v-if="collectionStore.form.behavior.chainType === ChainType.EVM && !isUnique"
          class="items-end"
          :cols="12"
          :x-gap="32"
        >
          <!-- Royalties Address -->
          <n-form-item-gi
            path="behavior.royaltiesAddress"
            :span="6"
            :label="infoLabel('royaltiesAddress') as string"
            :label-props="{ for: 'royaltiesAddress' }"
          >
            <n-input
              v-model:value="collectionStore.form.behavior.royaltiesAddress"
              :input-props="{ id: 'royaltiesAddress' }"
              :placeholder="t('general.typeHere')"
              clearable
            />
          </n-form-item-gi>

          <!-- Royalties Fees -->
          <n-form-item-gi
            path="behavior.royaltiesFees"
            :span="6"
            :label="infoLabel('royaltiesFees') as string"
            :label-props="{ for: 'royaltiesFees' }"
          >
            <n-input-number
              v-model:value="collectionStore.form.behavior.royaltiesFees"
              :min="0"
              :max="100"
              :input-props="{ id: 'royaltiesFees' }"
              :placeholder="t('general.typeHere')"
              clearable
            />
          </n-form-item-gi>
        </n-grid>

        <!--  Collection Is Drop -->
        <n-form-item v-if="!isUnique" path="behavior.drop" :span="1" :show-label="false">
          <n-checkbox
            v-model:checked="collectionStore.form.behavior.drop"
            size="medium"
            :label="infoLabel('drop') as string"
          />
        </n-form-item>

        <n-grid v-if="!!collectionStore.form.behavior.drop" :cols="12" :x-gap="32">
          <!--  Collection Mint price -->
          <n-form-item-gi
            path="behavior.dropPrice"
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
              :placeholder="t('general.typeHere')"
              clearable
            />
          </n-form-item-gi>

          <!--  Collection Drop start -->
          <n-form-item-gi path="behavior.dropStart" :span="6" :label="infoLabel('dropStart') as string">
            <n-date-picker
              v-model:value="collectionStore.form.behavior.dropStart"
              class="w-full"
              type="datetime"
              :is-date-disabled="disablePastDate"
              :is-time-disabled="disablePastTime"
              clearable
            />
          </n-form-item-gi>
        </n-grid>

        <n-grid v-if="!!collectionStore.form.behavior.drop" :cols="12" :x-gap="32">
          <!--  Collection Reserve -->
          <n-form-item-gi
            v-if="collectionStore.form.behavior.chainType === ChainType.EVM"
            path="behavior.dropReserve"
            :span="6"
            :label="infoLabel('dropReserve') as string"
          >
            <n-input-number
              v-model:value="collectionStore.form.behavior.dropReserve"
              :min="0"
              :placeholder="t('general.typeHere')"
              clearable
            />
          </n-form-item-gi>

          <!-- Royalties Address -->
          <n-form-item-gi
            v-if="collectionStore.form.behavior.chainType === ChainType.SUBSTRATE"
            path="behavior.royaltiesAddress"
            :span="6"
            :label="infoLabel('dropAddress') as string"
            :label-props="{ for: 'royaltiesAddress' }"
          >
            <n-input
              v-model:value="collectionStore.form.behavior.royaltiesAddress"
              :input-props="{ id: 'royaltiesAddress' }"
              :placeholder="t('general.typeHere')"
              clearable
            />
          </n-form-item-gi>
        </n-grid>
      </FormInstructions>

      <FormInstructions class="mb-8 !p-0">
        <!--  Form submit -->
        <n-form-item :show-label="false" :show-feedback="false">
          <input type="submit" class="hidden" :value="t('nft.collection.create')" />
          <Btn type="primary" size="large" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
            {{ t('nft.collection.create') }}
          </Btn>
        </n-form-item>
      </FormInstructions>
    </n-form>

    <W3Warn v-model:show="modalW3WarnVisible" :btn-text="t('nft.collection.upload')" @submit="onModalW3WarnConfirm">
      {{ t('w3Warn.nft.new') }}
    </W3Warn>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import { Feature } from '~/lib/types/config';
import { enumKeys, isFeatureEnabled } from '~/lib/utils';
import { ChainType, EvmChainMainnet } from '~/lib/types/nft';
import { NFT_MAX_SUPPLY } from '~/lib/values/general.values';

const emit = defineEmits(['submitSuccess']);

const { t, te } = useI18n();
const router = useRouter();
const message = useMessage();

const authStore = useAuthStore();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();

const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);
const { labelInfo } = useComputing();
const { getPriceServiceName } = useNft();
const {
  booleanSelect,
  nftChains,
  chainTypes,
  collectionTypes,
  formRef,
  loading,
  supplyTypes,
  rules,
  isFormDisabled,
  isUnique,
  chainCurrency,
  collectionEndpoint,
  disablePastDate,
  disablePastTime,
  onChainChange,
  prepareFormData,
  resetAll,
} = useCollection();

const formErrors = ref<boolean>(false);
const formBaseRef = useTemplateRef('formBaseRef');
const submitFormBase = async () => (formBaseRef.value ? await formBaseRef.value.handleSubmitForm() : false);

const metadataUri = computed<string>(() => {
  const baseUri = removeLastSlash(collectionStore.form.behavior.baseUri);
  return collectionStore.form.behavior.baseUri && collectionStore.form.behavior.baseExtension
    ? baseUri + '/1' + collectionStore.form.behavior.baseExtension
    : baseUri
      ? baseUri + '/1.' + t('nft.collection.extension')
      : '';
});

watch(
  () => collectionStore.form.behavior.chain,
  chain => {
    if (chain) {
      onChainChange(chain);
    }
  }
);

function infoLabel(field: string) {
  return labelInfo(field, 'form.label.collection');
}

// Submit
async function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  const formBaseSubmitted = await submitFormBase();

  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    formErrors.value = !!errors;
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (!localStorage.getItem(LsW3WarnKeys.NFT_NEW) && te('w3Warn.nft.new')) {
      modalW3WarnVisible.value = true;
    } else if (formBaseSubmitted) {
      onModalW3WarnConfirm();
    }
  });
}

/** When user close W3Warn, allow him to create new collection */
function onModalW3WarnConfirm() {
  warningStore.showSpendingWarning(getPriceServiceName(), () => createCollection());
}

async function createCollection() {
  loading.value = true;

  try {
    const res = await $api.post<CollectionResponse>(collectionEndpoint(), prepareFormData(true));

    message.success(t('form.success.created.collection'));

    /** On new collection created add new collection to list */
    collectionStore.items.unshift(res.data);

    /** Reset entire state */
    resetAll();

    /** Emit events */
    emit('submitSuccess');

    /** Redirect to Collections */
    router.push(`/dashboard/service/nft/${res.data.collection_uuid}`);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
