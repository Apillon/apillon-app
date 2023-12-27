<template>
  <div class="flex justify-center items-center" style="min-height: calc(100dvh - 300px)">
    <div class="w-full max-w-lg text-center">
      <!-- Creating new bucket -->
      <template v-if="loadingBucket">
        <AnimationLoader />
        <h2>{{ $t('nft.metadata.titleBucketCreation') }}</h2>
        <p class="mb-8 text-body whitespace-pre-line">
          {{ $t('nft.metadata.infoBucketCreation') }}
        </p>
      </template>

      <!-- New bucket created -->
      <template v-else-if="collectionStore.bucketUuid && loadingBucket === false">
        <IconSuccessful class="text-4xl mb-7" />
        <h2>{{ $t('nft.metadata.titleBucketCreated') }}</h2>
        <p class="mb-9 text-body whitespace-pre-line">{{ $t('nft.metadata.infoBucketCreated') }}</p>

        <Btn size="large" @click="collectionStore.mintTab = NftMintTab.UPLOAD">
          {{ $t('nft.metadata.proceedUpload') }}
        </Btn>
      </template>

      <!-- Select/create bucket  -->
      <div v-else class="w-full max-w-lg text-center">
        <h2>{{ $t('nft.metadata.titleBucket') }}</h2>
        <p class="mb-8 text-body whitespace-pre-line">
          {{ $t('nft.metadata.infoBucket') }}
        </p>
        <Btn type="secondary" size="large" @click="modalNewBucketVisible = true">
          {{ $t('nft.metadata.createBucket') }}
        </Btn>

        <div class="my-6 flex items-center">
          <span class="w-full inline-block text-body whitespace-nowrap">
            {{ $t('nft.metadata.orSelectExisting') }}
          </span>
        </div>

        <n-form
          ref="formRef"
          class="text-left"
          :model="formData"
          :rules="rules"
          @submit.prevent="handleSubmit"
        >
          <n-form-item path="bucket" :show-label="false" :label-props="{ for: 'bucket' }">
            <select-options
              v-model:value="formData.bucket"
              :options="buckets"
              :loading="loading"
              :placeholder="$t('general.pleaseSelect')"
              filterable
              clearable
            />
          </n-form-item>
          <!--  Form submit -->
          <n-form-item :show-label="false">
            <input type="submit" class="hidden" :value="$t('nft.metadata.selectBucket')" />
            <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
              {{ $t('nft.metadata.selectBucket') }}
            </Btn>
          </n-form-item>
        </n-form>
      </div>

      <!-- Modal - Create bucket -->
      <modal v-model:show="modalNewBucketVisible" :title="$t('project.newBucket')">
        <FormStorageBucket
          :bucket-type="BucketType.NFT_METADATA"
          @submit="loadingBucket = true"
          @createSuccess="onBucketCreated"
        />
      </modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const message = useMessage();
const bucketStore = useBucketStore();
const collectionStore = useCollectionStore();

const loading = ref<boolean>(false);
const loadingBucket = ref<boolean | null>(null);
const modalNewBucketVisible = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);

onMounted(async () => {
  loading.value = true;
  await bucketStore.getBuckets();
  loading.value = false;
});

const buckets = computed<Array<NSelectOption>>(() => {
  return bucketStore.items.map(item => {
    return { label: item.name, value: item.bucket_uuid };
  });
});

const formData = ref<{ bucket: any }>({
  bucket: collectionStore.bucketUuid || null,
});

const rules: NFormRules = {
  bucket: [
    {
      required: true,
      message: $i18n.t('validation.nftBucketRequired'),
    },
  ],
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      collectionStore.bucketUuid = formData.value.bucket;
      collectionStore.mintTab = NftMintTab.UPLOAD;
    }
  });
}

function onBucketCreated(bucket: BucketInterface) {
  modalNewBucketVisible.value = false;
  collectionStore.bucketUuid = bucket.bucket_uuid;

  setTimeout(() => {
    loadingBucket.value = false;
  }, 3000);
}
</script>
