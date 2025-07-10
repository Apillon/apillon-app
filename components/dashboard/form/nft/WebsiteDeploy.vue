<template>
  <Notification
    v-if="collectionStore.active.collectionStatus < CollectionStatus.DEPLOYED"
    type="warning"
    class="mb-8 w-full"
  >
    <div>
      {{ $t('nft.collection.websiteDeploy.notDeployed') }}
    </div>
    <div class="relative">
      <Spinner :size="12" />
    </div>
  </Notification>
  <Notification v-else-if="isFormDisabled" type="error" class="mb-4">
    {{ $t('nft.collection.websiteDeploy.disabled') }}
  </Notification>
  <n-form
    ref="formRef"
    :model="formData"
    :disabled="isFormDisabled"
    :rules="rules"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <n-form-item
      v-if="!templateType"
      path="type"
      :label="$t('form.label.website.type')"
      :label-props="{ for: 'nftTemplate' }"
    >
      <n-radio-group v-model:value="formData.type" class="w-full gap-4 md:grid md:grid-cols-3" name="radiogroup">
        <CardSelect
          v-for="(type, key) in websiteTypes"
          :key="key"
          class="md:my-0"
          :icon="type.icon"
          :title="type.label"
          :selected="formData.type === Number(type.value)"
          @click="formData.type = Number(type.value)"
        >
          <n-radio class="hidden" :value="type.value" :label="`${type.label}`" />
        </CardSelect>
      </n-radio-group>
    </n-form-item>

    <FormFieldNftCollection
      v-if="templateType"
      v-model:value="formData.nftCollection"
      clearable
      @update:value="c => (formData.nftCollection = c)"
    />
    <FormFieldEmbeddedWallet
      v-model:value="formData.embeddedWallet"
      clearable
      @update:value="ew => (formData.embeddedWallet = ew)"
    />

    <FormFieldApiKey
      :api-key="formData.apiKey"
      :api-secret="formData.apiSecret"
      @update:api-key="apiKey => (formData.apiKey = apiKey)"
      @update:api-secret="apiSecret => (formData.apiSecret = apiSecret)"
    />

    <n-form-item v-if="!hideSubmit" class="mt-8" :show-feedback="false" :show-label="false">
      <input type="submit" class="hidden" :value="'Save'" />

      <Btn type="primary" class="mt-2 w-full" :disabled="isFormDisabled" :loading="loading" @click="handleSubmit">
        {{ $t('nft.collection.websiteDeploy.deploy') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormWebsiteDeploy = {
  apiKey: string | null;
  apiSecret: string | null;
  type: NftWebsiteType | null;
  nftCollection: string | null;
  embeddedWallet: string | null;
};

defineExpose({ handleSubmit });
const emit = defineEmits(['submitSuccess']);
const props = defineProps({
  templateType: { type: Number, default: null },
  hideSubmit: { type: Boolean, default: false },
});
const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const collectionStore = useCollectionStore();
const { ruleApiKey, ruleApiSecret } = useForm();
const { checkUnfinishedCollection } = useCollection();

const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);

const websiteTypes = ref([
  { value: NftWebsiteType.PLAIN_JS, label: t('nft.collection.websiteDeploy.plain_js'), icon: 'library/javascript' },
  { value: NftWebsiteType.REACT, label: t('nft.collection.websiteDeploy.react'), icon: 'library/react' },
  { value: NftWebsiteType.VUE, label: t('nft.collection.websiteDeploy.vue'), icon: 'library/vue' },
]);

const formData = reactive<FormWebsiteDeploy>({
  apiKey: null,
  apiSecret: null,
  type: props.templateType,
  nftCollection: collectionStore.active.collection_uuid,
  embeddedWallet: null,
});

const rules: NFormRules = {
  type: ruleRequired(t('validation.website.typeRequired')),
  nftCollection: ruleRequired(t('validation.nft.collection')),
  apiKey: [{ required: settingsStore.apiKeyQuotaReached, message: t('validation.apiRequired') }, ruleApiKey(formData)],
  apiSecret: ruleApiSecret(formData),
};

const isFormDisabled = computed(() => collectionStore.active.collectionStatus !== CollectionStatus.DEPLOYED);

onMounted(() => {
  if (!props.templateType && collectionStore.active.collection_uuid) {
    checkUnfinishedCollection();
  }
});

watch(
  () => collectionStore.active.collection_uuid,
  uuid => (formData.nftCollection = uuid ?? formData.nftCollection)
);

async function handleSubmit(e?: Event | MouseEvent) {
  e?.preventDefault();

  const validation = await formRef.value?.validate();

  if (props.hideSubmit) {
    return !validation?.warnings ? formData : null;
  } else if (!validation?.warnings) {
    deployNftWebsite();
  }
}

async function deployNftWebsite() {
  loading.value = true;
  try {
    const bodyData = {
      ...formData,
      collectionUuid: collectionStore.active.collection_uuid,
      projectUuid: dataStore.projectUuid,
    };

    const { data } = await $api.post<WebsiteResponse>(endpoints.deployNftWebsite, bodyData);
    message.success(t('nft.collection.websiteDeploy.success'));

    collectionStore.active.websiteUuid = data.website_uuid;
    emit('submitSuccess', data);
  } catch (e) {
    message.error(userFriendlyMsg(e));
  }

  loading.value = false;
}
</script>
