<template>
  <n-form ref="formRef" :model="formData" :rules="rules" autocomplete="off" @submit.prevent="handleSubmit">
    <n-form-item path="type" :label="$t('form.label.website.type')" :label-props="{ for: 'nftTemplate' }">
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

    <FormFieldApiKey
      :api-key="formData.apiKey"
      :api-secret="formData.apiSecret"
      @update:api-key="apiKey => (formData.apiKey = apiKey)"
      @update:api-secret="apiSecret => (formData.apiSecret = apiSecret)"
    />

    <n-form-item class="mt-8" :show-feedback="false" :show-label="false">
      <input type="submit" class="hidden" :value="'Save'" />

      <Btn type="primary" class="mt-2 w-full" :loading="loading" @click="handleSubmit">
        {{ $t('nft.collection.websiteDeploy.deploy') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormWebsiteDeploy = {
  apiKey: string;
  apiSecret: string;
  type: NftWebsiteType | null;
};

const emit = defineEmits(['submitSuccess']);
const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();
const { ruleApiKey, ruleApiSecret } = useForm();

const loading = ref<boolean>(false);

const formRef = ref<NFormInst | null>(null);

const websiteTypes = ref([
  { value: NftWebsiteType.PLAIN_JS, label: t('nft.collection.websiteDeploy.plain_js'), icon: 'library/javascript' },
  { value: NftWebsiteType.REACT, label: t('nft.collection.websiteDeploy.react'), icon: 'library/react' },
  { value: NftWebsiteType.VUE, label: t('nft.collection.websiteDeploy.vue'), icon: 'library/vue' },
]);

const formData = reactive<FormWebsiteDeploy>({
  apiKey: '',
  apiSecret: '',
  type: null,
});

const rules: NFormRules = {
  type: [ruleRequired(t('validation.website.typeRequired'))],
  apiKey: ruleApiKey(formData),
  apiSecret: ruleApiSecret(formData),
};

async function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (!errors) {
      deployNftWebsite();
    }
  });
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
