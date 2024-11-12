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
      <!--  Indexer name -->
      <n-form-item path="name" :label="$t('form.label.indexerName')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.indexerName')"
          clearable
        />
      </n-form-item>

      <!--  Indexer description -->
      <n-form-item
        path="description"
        :label="$t('form.label.indexerDescription')"
        :label-props="{ for: 'description' }"
      >
        <n-input
          v-model:value="formData.description"
          type="textarea"
          :input-props="{ id: 'description' }"
          :placeholder="$t('form.placeholder.indexerDescription')"
          clearable
        />
      </n-form-item>

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
          <template v-if="props.indexerUuid">
            {{ $t('indexer.update') }}
          </template>
          <template v-else>
            {{ $t('indexer.create') }}
          </template>
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

const $i18n = useI18n();
const router = useRouter();
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
  name: [ruleRequired($i18n.t('validation.indexerNameRequired'))],
  description: [ruleDescription($i18n.t('validation.descriptionTooLong'))],
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
    } else if (props.indexerUuid) {
      await updateIndexer();
    } else {
      await createIndexer();
    }
  });
}

async function createIndexer() {
  loading.value = true;

  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  try {
    const bodyData = {
      ...formData.value,
      project_uuid: dataStore.projectUuid,
    };
    const res = await $api.post<IndexerBaseResponse>(endpoints.indexer(), bodyData);

    message.success($i18n.t('form.success.created.indexer'));

    /** On new website created add new website to list */
    indexerStore.items.push(res.data as IndexerBaseInterface);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');

    /** Redirect to new web page */
    router.push(`/dashboard/service/indexing/${res.data.indexer_uuid}`);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateIndexer() {
  loading.value = true;

  try {
    const res = await $api.patch<IndexerBaseResponse>(
      endpoints.indexers(props.indexerUuid),
      formData.value
    );
    message.success($i18n.t('form.success.updated.indexer'));
    /** On indexer updated refresh indexer data */
    indexerStore.items.forEach((item: IndexerBaseInterface) => {
      if (item.indexer_uuid === props.indexerUuid) {
        item.name = res.data.name;
        item.description = res.data.description;
      }
    });
    if (indexerStore.active.indexer_uuid === props.indexerUuid) {
      indexerStore.active.name = res.data.name;
      indexerStore.active.description = res.data.description;
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
