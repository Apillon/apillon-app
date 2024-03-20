<template>
  <div class="w-full max-w-lg mx-auto text-center">
    <!-- Creating new bucket -->
    <template v-if="loadingBucket">
      <AnimationLoader />
      <h2>{{ $t('computing.contract.titleBucketCreation') }}</h2>
      <p class="mb-8 text-body whitespace-pre-line">
        {{ $t('computing.contract.infoBucketCreation') }}
      </p>
    </template>

    <!-- New bucket created -->
    <template v-else-if="contractStore.bucketUuid && loadingBucket === false">
      <IconSuccessful class="text-4xl mb-7" />
      <h2>{{ $t('computing.contract.titleBucketCreated') }}</h2>
      <p class="mb-9 text-body whitespace-pre-line">
        {{ $t('computing.contract.infoBucketCreated') }}
      </p>

      <Btn size="large" @click="contractStore.encryptTab = EncryptTab.ASSIGN">
        {{ $t('computing.contract.proceedUpload') }}
      </Btn>
    </template>

    <!-- Select/create bucket  -->
    <div v-else class="w-full max-w-lg text-center">
      <h2>{{ $t('computing.contract.titleBucket') }}</h2>
      <p class="mb-8 text-body whitespace-pre-line">
        {{ $t('computing.contract.infoBucket') }}
      </p>
      <Btn
        type="secondary"
        size="large"
        :disabled="actionsDisabled"
        @click="modalNewBucketVisible = true"
      >
        {{ $t('computing.contract.createBucket') }}
      </Btn>

      <div class="my-6 flex items-center">
        <span class="w-full inline-block text-body whitespace-nowrap">
          {{ $t('computing.contract.orSelectExisting') }}
        </span>
      </div>

      <n-form
        ref="formRef"
        class="text-left"
        :model="formData"
        :rules="rules"
        :disabled="actionsDisabled"
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
          <input type="submit" class="hidden" :value="$t('computing.contract.selectBucket')" />
          <Btn
            type="primary"
            class="w-full mt-2"
            :loading="loading"
            :disabled="actionsDisabled"
            @click="handleSubmit"
          >
            {{ $t('computing.contract.selectBucket') }}
          </Btn>
        </n-form-item>
      </n-form>
    </div>

    <!-- Modal - Create bucket -->
    <modal v-model:show="modalNewBucketVisible" :title="$t('project.newBucket')">
      <FormStorageBucket
        :submit-text="$t('computing.contract.createBucket')"
        @submit="loadingBucket = true"
        @createSuccess="onBucketCreated"
      />
    </modal>
  </div>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const bucketStore = useBucketStore();
const contractStore = useContractStore();

const loading = ref<boolean>(false);
const loadingBucket = ref<boolean | null>(null);
const modalNewBucketVisible = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);

onMounted(async () => {
  loading.value = true;
  await bucketStore.getBuckets();
  loading.value = false;
});

const actionsDisabled = computed<boolean>(() => {
  return contractStore.active.contractStatus !== ContractStatus.DEPLOYED;
});

const buckets = computed<Array<SelectOption>>(() => {
  return bucketStore.items.map(item => {
    return { label: item.name, value: item.bucket_uuid };
  });
});

const formData = ref<{ bucket: any }>({
  bucket: contractStore.bucketUuid || null,
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
      emit('submitSuccess', formData.value.bucket);
    }
  });
}

function onBucketCreated(bucket: BucketInterface) {
  modalNewBucketVisible.value = false;
  emit('submitSuccess', bucket.bucket_uuid);

  setTimeout(() => {
    loadingBucket.value = false;
  }, 3000);
}
</script>
