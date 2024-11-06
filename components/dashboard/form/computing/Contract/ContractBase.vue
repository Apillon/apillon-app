<template>
  <div>
    <Notification v-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>

    <n-form
      ref="formRef"
      :model="contractStore.form"
      :rules="rules"
      :disabled="isFormDisabled"
      autocomplete="off"
      @submit.prevent="handleSubmit"
    >
      <!--  Contract name -->
      <n-form-item
        path="name"
        :label="$t('form.label.contract.name')"
        :label-props="{ for: 'name' }"
      >
        <n-input
          v-model:value="contractStore.form.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.contract.name')"
          clearable
        />
      </n-form-item>

      <!--  Contract description -->
      <n-form-item
        path="description"
        :label="$t('form.label.contract.description')"
        :label-props="{ for: 'description' }"
      >
        <n-input
          v-model:value="contractStore.form.description"
          type="textarea"
          :input-props="{ id: 'description' }"
          :placeholder="$t('form.placeholder.contract.description')"
          clearable
        />
      </n-form-item>

      <!--  Bucket Uuid -->
      <n-form-item
        path="bucket_uuid"
        :label="$t('form.label.bucketName')"
        :label-props="{ for: 'bucket_uuid' }"
      >
        <select-options
          v-model:value="contractStore.form.bucket_uuid"
          :options="buckets"
          :placeholder="$t('general.pleaseSelect')"
          filterable
          clearable
        />
      </n-form-item>

      <!-- Contract Restrict To Owner -->
      <n-form-item
        path="contractData.restrictToOwner"
        :span="6"
        :label="labelInfo('restrictToOwner')"
        :label-props="{ for: 'restrictToOwner' }"
      >
        <select-options
          v-model:value="contractStore.form.contractData.restrictToOwner"
          :options="booleanSelect"
          :input-props="{ id: 'restrictToOwner' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
        />
      </n-form-item>

      <!--  Form submit -->
      <n-form-item :show-feedback="false" :show-label="false">
        <input type="submit" class="hidden" :value="$t('computing.contract.create')" />
        <Btn
          type="primary"
          class="w-full mt-2"
          :loading="loading"
          :disabled="isFormDisabled"
          @click="handleSubmit"
        >
          {{ $t('computing.contract.create') }}
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const contractStore = useContractStore();
const { booleanSelect } = useCollection();
const { labelInfo } = useComputing();

const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);

const buckets = computed<Array<NSelectOption>>(() => {
  return bucketStore.items.map(item => {
    return { label: item.name, value: item.bucket_uuid };
  });
});

const rules: NFormRules = {
  name: [ruleRequired($i18n.t('validation.contract.nameRequired'))],
  description: [ruleDescription($i18n.t('validation.descriptionTooLong'))],
};

onMounted(() => {
  bucketStore.getBuckets();
});

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
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
      emit('submitSuccess');
    }
  });
}
</script>
