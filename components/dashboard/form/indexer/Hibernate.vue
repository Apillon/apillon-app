<template>
  <Spinner v-if="indexerUuid && !indexer" />
  <div v-else>
    <Notification v-if="isFormDisabled" type="error" class="w-full mb-8">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>

    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <p>{{ $t('indexer.hibernateIndexerInfo') }}</p>

      <!--  Form submit -->
      <n-form-item :show-feedback="false">
        <input type="submit" class="hidden" :value="$t('indexer.create')" />
        <Btn
          type="primary"
          class="w-full mt-2"
          :loading="loading"
          :disabled="isFormDisabled"
          @click="handleSubmit"
        >
          {{ $t('indexer.hibernate') }}
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
type FormIndexer = {
  name: string;
  description?: string;
};

const props = defineProps({
  indexerUuid: { type: String, default: null },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const indexerStore = useIndexerStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const indexer = ref<IndexerBaseInterface | null>(null);

const formData = ref<FormIndexer>({
  name: indexer.value?.name || '',
  description: indexer.value?.description || '',
});

const rules: NFormRules = {
  name: [ruleRequired(t('validation.indexerNameRequired'))],
  description: [ruleDescription(t('validation.descriptionTooLong'))],
};

onMounted(async () => {
  if (props.indexerUuid) {
    indexer.value = await indexerStore.getIndexer(props.indexerUuid);
    if (indexer.value) {
      formData.value.name = indexer.value.name;
      formData.value.description = indexer.value.description || '';
    }
  }
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
      await hibernateIndexer();
    }
  });
}

async function hibernateIndexer() {
  await indexerStore.hibernateIndexer(indexerStore.active?.indexer_uuid);
  message.success(t('indexer.successfullyHibernated'));
  emit('submitSuccess');
}
</script>
