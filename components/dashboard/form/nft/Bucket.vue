<template>
  <div class="flex justify-center items-center" style="min-height: calc(100vh - 300px)">
    <div class="w-full max-w-lg text-center">
      <h2>{{ $t('nft.metadata.titleBucket') }}</h2>
      <p class="mb-8 whitespace-pre-line">
        {{ $t('nft.metadata.infoBucket') }}
      </p>
      <Btn type="secondary" size="large" @click="">
        {{ $t('nft.metadata.createBucket') }}
      </Btn>

      <div class="my-6 flex items-center">
        <span class="w-full inline-block text-body whitespace-nowrap">
          {{ $t('nft.metadata.orSelectExisting') }}
        </span>
      </div>

      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        :disabled="isFormDisabled"
        @submit.prevent="handleSubmit"
      >
        <n-form-item path="file" :show-label="false" :label-props="{ for: 'file' }">
          <select-options
            v-model:value="formData.bucket"
            :options="buckets"
            :placeholder="$t('general.pleaseSelect')"
            filterable
            clearable
          />
        </n-form-item>
        <!--  Form submit -->
        <n-form-item>
          <input type="submit" class="hidden" :value="$t('nft.metadata.selectBucket')" />
          <Btn
            type="primary"
            class="w-full mt-2"
            :loading="loading"
            :disabled="isFormDisabled"
            @click="handleSubmit"
          >
            {{ $t('nft.metadata.selectBucket') }}
          </Btn>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const collectionStore = useCollectionStore();
const settingsStore = useSettingsStore();

const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);

onMounted(() => {
  bucketStore.getBuckets();
});

const buckets = computed<Array<NSelectOption>>(() => {
  return bucketStore.items.map(item => {
    return { label: item.name, value: item.id };
  });
});

const formData = ref({
  bucket: '',
});

const rules: NFormRules = {
  bucket: [
    {
      required: true,
      message: $i18n.t('validation.nftBucketRequired'),
    },
  ],
};

const isFormDisabled = computed<boolean>(() => {
  return settingsStore.isProjectUser();
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
    }
  });
}
</script>
