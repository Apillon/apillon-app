<template>
  <Spinner v-if="collectionId > 0 && !collection" />
  <div v-else>
    <!-- Notification - show if qouta has been reached -->
    <Notification v-if="isQuotaReached" type="warning" class="w-full mb-8">
      {{ $t('nft.collection.quotaReached') }}
    </Notification>
    <Notification v-else-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <template v-else>
      <!-- Info text -->
      <p v-if="collectionId === 0 && $i18n.te('nft.collection.infoNew')" class="text-body mb-8">
        {{ $t('nft.collection.infoNew') }}
      </p>
      <p v-else-if="collectionId > 0 && $i18n.te('nft.collection.infoEdit')" class="text-body mb-8">
        {{ $t('nft.collection.infoEdit') }}
      </p>
    </template>

    <n-form
      ref="formRef"
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

      <n-grid :cols="2" :x-gap="32">
        <!--  Collection Mint price -->
        <n-form-item-gi path="mintPrice" :label="$t('form.label.collectionMintPrice')">
          <n-input-number
            v-model:value="formData.mintPrice"
            :min="0"
            :placeholder="$t('form.placeholder.collectionMintPrice')"
            clearable
          />
        </n-form-item-gi>

        <!--  Collection Max supply -->
        <n-form-item-gi path="maxSupply" :label="$t('form.label.collectionMaxSupply')">
          <n-input-number
            v-model:value="formData.maxSupply"
            :min="0"
            :placeholder="$t('form.placeholder.collectionMaxSupply')"
            clearable
          />
        </n-form-item-gi>
      </n-grid>

      <!--  Collection Base URI -->
      <n-form-item
        path="baseUri"
        :label="$t('form.label.collectionBaseUri')"
        :label-props="{ for: 'baseUri' }"
      >
        <n-input
          v-model:value="formData.baseUri"
          :input-props="{ id: 'baseUri' }"
          :placeholder="$t('form.placeholder.collectionBaseUri')"
          clearable
        />
      </n-form-item>

      <!--  Collection Base Extension -->
      <n-form-item
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
      </n-form-item>

      <n-grid :cols="3" :x-gap="32">
        <!--  Collection Is Drop -->
        <n-form-item-gi path="isDrop" :label="$t('form.label.collectionIsDrop')">
          <n-switch v-model:value="formData.isDrop" />
        </n-form-item-gi>

        <!--  Collection Drop start -->
        <n-form-item-gi path="dropStart" :label="$t('form.label.collectionDropStart')">
          <n-switch v-model:value="formData.dropStart" />
        </n-form-item-gi>

        <!--  Collection Reserve -->
        <n-form-item-gi path="reserve" :label="$t('form.label.collectionReserve')">
          <n-switch v-model:value="formData.reserve" />
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
          <template v-if="collection">
            {{ $t('nft.collection.update') }}
          </template>
          <template v-else>
            {{ $t('nft.collection.create') }}
          </template>
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const props = defineProps({
  collectionId: { type: Number, default: 0 },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();
const settingsStore = useSettingsStore();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const collection = ref<CollectionInterface | null>(null);

onMounted(async () => {
  if (props.collectionId) {
    collection.value = await collectionStore.getCollection(props.collectionId);
    formData.value.name = collection.value.name;
    formData.value.symbol = collection.value.symbol;
    formData.value.mintPrice = collection.value.mintPrice;
    formData.value.maxSupply = collection.value.maxSupply;
    formData.value.baseUri = collection.value.baseUri;
    formData.value.baseExtension = collection.value.baseExtension;
    formData.value.isDrop = collection.value.isDrop;
    formData.value.dropStart = collection.value.dropStart;
    formData.value.reserve = collection.value.reserve;
  }
});

const formData = ref<FormCollection>({
  name: collection.value?.name || '',
  symbol: collection.value?.symbol || '',
  mintPrice: collection.value?.mintPrice || 0,
  maxSupply: collection.value?.maxSupply || 0,
  baseUri: collection.value?.baseUri || '',
  baseExtension: collection.value?.baseExtension || '',
  isDrop: collection.value?.isDrop || false,
  dropStart: collection.value?.dropStart || false,
  reserve: collection.value?.reserve || false,
});

const rules: NFormRules = {
  name: [
    {
      required: true,
      message: $i18n.t('validation.collectionNameRequired'),
    },
  ],
  symbol: [
    {
      required: true,
      message: $i18n.t('validation.collectionSymbolRequired'),
    },
  ],
  mintPrice: [
    {
      required: true,
      message: $i18n.t('validation.collectionMintPriceRequired'),
    },
  ],
  maxSupply: [
    {
      required: true,
      message: $i18n.t('validation.collectionMaxSupplyRequired'),
    },
  ],
};

const isQuotaReached = computed<boolean>(() => {
  return props.collectionId === 0 && collectionStore.quotaReached === true;
});
const isFormDisabled = computed<boolean>(() => {
  return isQuotaReached.value || settingsStore.isProjectUser();
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (props.collectionId > 0) {
      await updateCollection();
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
      ...formData.value,
      project_uuid: dataStore.projectUuid,
    };
    const res = await $api.post<CollectionResponse>(endpoints.collection, bodyData);

    message.success($i18n.t('form.success.created.collection'));

    /** On new collection created add new collection to list */
    collectionStore.items.push(res.data);

    /** Reset collection qouta limit */
    collectionStore.quotaReached = undefined;

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');

    /** Redirect to new web page */
    router.push(`/dashboard/service/nft/${res.data.id}`);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateCollection() {
  loading.value = true;

  try {
    const res = await $api.patch<CollectionResponse>(endpoints.collection, formData.value);

    message.success($i18n.t('form.success.updated.collection'));

    /** On collection updated refresh collection data */
    collectionStore.items.forEach((item: CollectionInterface) => {
      if (item.id === props.collectionId) {
        item.name = res.data.name;
        item.description = res.data.description;
      }
    });
    if (collectionStore.active.id === props.collectionId) {
      collectionStore.active.name = res.data.name;
      collectionStore.active.description = res.data.description;
    }

    /** Emit events */
    emit('submitSuccess');
    emit('updateSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
