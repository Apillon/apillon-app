<template>
  <n-form ref="formRef" :model="formData" :rules="rules" autocomplete="off" @submit.prevent="handleSubmit">
    <n-form-item path="type" :label="$t('form.label.website.type')">
      <n-radio-group v-model:value="formData.type" name="radiogroup">
        <n-space>
          <n-radio v-for="(type, key) in websiteTypes" :key="key" :value="type.value" :label="`${type.label}`" />
        </n-space>
      </n-radio-group>
    </n-form-item>

    <FormFieldApiKey
      :api-key="formData.apiKey"
      :api-secret="formData.apiSecret"
      @update:api-key="apiKey => (formData.apiKey = apiKey)"
      @update:api-secret="apiSecret => (formData.apiSecret = apiSecret)"
    />

    <n-form-item :show-feedback="false" :show-label="false">
      <input type="submit" class="hidden" :value="'Save'" />

      <Btn type="primary" class="mt-2 w-full" :loading="loading" @click="handleSubmit">
        {{ $t('nft.collection.websiteDeploy.deploy') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

type FormWebsiteDeploy = {
  apiKey: string;
  apiSecret: string;
  type: NftWebsiteType | null;
};

const emit = defineEmits(['submitSuccess']);
const { t } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();
const dataStore = useDataStore();

const loading = ref<boolean>(false);

const formRef = ref<NFormInst | null>(null);

const websiteTypes = ref<Array<SelectOption>>([
  { value: NftWebsiteType.PLAIN_JS, label: t('nft.collection.websiteDeploy.plain_js') },
  { value: NftWebsiteType.REACT, label: t('nft.collection.websiteDeploy.react') },
  { value: NftWebsiteType.VUE, label: t('nft.collection.websiteDeploy.vue') },
]);

const formData = reactive<FormWebsiteDeploy>({
  apiKey: '',
  apiSecret: '',
  type: null,
});

const rules: NFormRules = {
  type: [ruleRequired(t('validation.website.typeRequired'))],
  apiKey: {
    validator: (_, value) => validateApiKey(value, formData.apiSecret),
    message: t('validation.apiKeyRequired'),
    trigger: 'blur',
  },
  apiSecret: {
    validator: (_, value) => validateApiKey(value, formData.apiKey),
    message: t('validation.apiSecretRequired'),
    trigger: 'blur',
  },
};

async function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || t('general.error'))));
    } else {
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
