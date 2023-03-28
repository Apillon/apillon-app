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
      <!--  Collection Symbol -->
      <n-form-item
        path="symbol"
        :label="$t('form.label.collectionSymbol')"
        :label-props="{ for: 'symbol' }"
      >
        <n-input
          v-model:value="formData.symbol"
          :input-props="{ id: 'symbol' }"
          :placeholder="$t('form.placeholder.collectionSymbol')"
          clearable
        />
      </n-form-item>

      <!--  Collection name -->
      <n-form-item
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
      </n-form-item>

      <n-grid class="items-end" :cols="12" :x-gap="16">
        <!--  Collection Base URI -->
        <n-form-item-gi
          :class="{ 'hide-feedback': !!metadataUri }"
          :span="8"
          path="baseUri"
          :label="baseUriLabel"
          :label-props="{ for: 'baseUri' }"
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
          :label="$t('form.label.collectionBaseExtension')"
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
          {{ metadataUri }}
        </n-form-item-gi>
      </n-grid>

      <!--  Collection Max supply -->
      <n-form-item path="maxSupply" :label="$t('form.label.collectionMaxSupply')">
        <n-input-number
          v-model:value="formData.maxSupply"
          :min="0"
          :max="NFT_MAX_SUPPLY"
          :placeholder="$t('form.placeholder.collectionMaxSupply')"
          clearable
        />
      </n-form-item>

      <n-grid :cols="2" :x-gap="32">
        <!--  Collection Is Drop -->
        <n-form-item-gi path="isDrop" :span="1" :label="$t('form.label.collectionIsDrop')">
          <n-switch v-model:value="formData.isDrop" />
        </n-form-item-gi>

        <!--  Collection Drop start -->
        <n-form-item-gi
          v-if="!!formData.isDrop"
          path="dropStart"
          :span="1"
          :label="$t('form.label.collectionDropStart')"
        >
          <n-date-picker
            v-model:value="formData.dropStart"
            class="w-full"
            type="datetime"
            :is-date-disabled="disablePasteDate"
            clearable
          />
        </n-form-item-gi>
      </n-grid>

      <n-grid v-if="!!formData.isDrop" :cols="2" :x-gap="32">
        <!--  Collection Mint price -->
        <n-form-item-gi path="mintPrice" :span="1" :label="$t('form.label.collectionMintPrice')">
          <n-input-number
            v-model:value="formData.mintPrice"
            :placeholder="$t('form.placeholder.collectionMintPrice')"
            clearable
          />
        </n-form-item-gi>

        <!--  Collection Reserve -->
        <n-form-item-gi path="reserve" :span="1" :label="$t('form.label.collectionReserve')">
          <n-input-number
            v-model:value="formData.reserve"
            :min="0"
            :placeholder="$t('form.placeholder.collectionReserve')"
            clearable
          />
        </n-form-item-gi>
      </n-grid>

      <!--  Form submit -->
      <n-form-item>
        <input type="submit" class="hidden" :value="$t('nft.collection.create')" />
        <Btn
          type="primary"
          class="w-full mt-2"
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

const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();
const settingsStore = useSettingsStore();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const IconInfo = resolveComponent('IconInfo');

const formErrors = ref<boolean>(false);
const formData = ref<FormCollection>({
  name: '',
  symbol: '',
  mintPrice: 0,
  maxSupply: null,
  baseUri: '',
  baseExtension: '',
  isDrop: false,
  dropStart: Date.now() + 3600000,
  reserve: 0,
});

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
  baseExtension: [
    {
      validator: validateBaseExtension,
      message: $i18n.t('validation.collectionBaseExtensionRequired'),
    },
  ],
  maxSupply: [
    {
      required: true,
      message: $i18n.t('validation.collectionMaxSupplyRequired'),
    },
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
const baseUriLabel = computed(() => {
  return [
    h('span', { class: 'mr-1' }, $i18n.t('form.label.collectionBaseUri')),
    h(IconInfo, { size: 'sm', tooltip: $i18n.t('nft.collection.baseUriInfo') }, ''),
  ];
});

const isQuotaReached = computed<boolean>(() => {
  return collectionStore.quotaReached === true;
});
const isFormDisabled = computed<boolean>(() => {
  return isQuotaReached.value || settingsStore.isProjectUser();
});

function validateReserve(_: NFormItemRule, value: number): boolean {
  return value <= (formData.value?.maxSupply || 0);
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
  return !formData.value.isDrop || (value > 0 && value < 999999);
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
      maxSupply: formData.value.maxSupply,
      baseUri: formData.value.baseUri,
      baseExtension: formData.value.baseExtension,
      isDrop: formData.value.isDrop,
      dropStart: Math.floor((formData.value.dropStart || Date.now()) / 1000),
      reserve: formData.value.reserve,
    };
    const res = await $api.post<CollectionResponse>(endpoints.collections(), bodyData);

    message.success($i18n.t('form.success.created.collection'));

    /** On new collection created add new collection to list */
    collectionStore.items.push(res.data);

    /** Reset collection qouta limit */
    collectionStore.quotaReached = undefined;

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
