<template>
  <n-form ref="formRef" :model="formData" :rules="rules" autocomplete="off" @submit.prevent="handleSubmit">
    <n-form-item path="type" :label="$t('nft.collection.website-deploy.form.type')">
      <n-radio-group v-model:value="formData.type" name="radiogroup">
        <n-space>
          <n-radio v-for="(type, key) in websiteTypes" :key="key" :value="type.value" :label="`${type.label}`" />
        </n-space>
      </n-radio-group>
    </n-form-item>

    <n-collapse accordion>
      <n-collapse-item>
        <template #header>
          {{ $t('nft.collection.website-deploy.form.advanced-settings') }}
          <span class="icon-info ml-2 text-xl"></span>
        </template>
        <n-form-item
          path="apiKey"
          :label="$t('nft.collection.website-deploy.form.api-key')"
          :label-props="{ for: 'apiKey' }"
        >
          <n-select
            v-model:value="formData.apiKey"
            :placeholder="$t('nft.collection.website-deploy.form.api-key-placeholder')"
            :options="apiKeyOptions"
            clearable
          >
          </n-select>
        </n-form-item>
        <n-form-item
          path="apiSecret"
          :label="$t('nft.collection.website-deploy.form.api-secret')"
          :label-props="{ for: 'apiSecret' }"
        >
          <n-input
            v-model:value="formData.apiSecret"
            :input-props="{ id: 'apiSecret', autocomplete: 'off' }"
            show-password-on="click"
            type="password"
            :placeholder="$t('nft.collection.website-deploy.form.api-secret-placeholder')"
            clearable
          />
        </n-form-item>
      </n-collapse-item>
    </n-collapse>

    <n-form-item :show-feedback="false" :show-label="false">
      <input type="submit" class="hidden" :value="'Save'" />

      <Btn type="primary" class="mt-2 w-full" :loading="loading" @click="handleSubmit">
        {{ $t('nft.collection.website-deploy.deploy') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';
import { NftWebsiteType } from '~/lib/types/nft';

type FormWebsiteDeploy = {
  apiKey: string;
  apiSecret: string;
  type: NftWebsiteType | null;
};

const emit = defineEmits(['submitSuccess']);
const { t } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();
const settingsStore = useSettingsStore();
const dataStore = useDataStore();

const loading = ref<boolean>(false);

const formRef = ref<NFormInst | null>(null);

const websiteTypes = ref<Array<SelectOption>>([
  { value: NftWebsiteType.PLAIN_JS, label: t('nft.collection.website-deploy.plain_js') },
  { value: NftWebsiteType.REACT, label: t('nft.collection.website-deploy.react') },
  { value: NftWebsiteType.VUE, label: t('nft.collection.website-deploy.vue') },
]);

const formData = reactive<FormWebsiteDeploy>({
  apiKey: '',
  apiSecret: '',
  type: null,
});

const rules: NFormRules = {
  type: [ruleRequired(t('nft.collection.website-deploy.form.type-required'))],
  apiKey: [
    {
      validator(_, value) {
        if (!value && formData.apiSecret) {
          return new Error(t('nft.collection.website-deploy.form.api-key-equired'));
        }
        return true;
      },
      trigger: 'blur',
    },
  ],
  apiSecret: [
    {
      validator(_, value) {
        if (!value && formData.apiKey) {
          return new Error(t('nft.collection.website-deploy.form.api-secret-required'));
        }
        return true;
      },
      trigger: 'blur',
    },
  ],
};

const apiKeyOptions = computed<SelectOption[]>(() =>
  settingsStore.apiKeys.map((item: ApiKeyInterface) => ({
    label: item.name,
    value: item.apiKey,
  }))
);

onMounted(async () => {
  await settingsStore.getApiKeys();
});

async function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
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
    message.success(t('nft.collection.website-deploy.success'));

    collectionStore.active.websiteUuid = data.website_uuid;
    emit('submitSuccess');
  } catch (e) {
    message.error(userFriendlyMsg(e));
  }

  loading.value = false;
}
</script>
