<template>
  <div>
    <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>

    <n-form
      v-else
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <n-form-item path="bucketUuid" :label="$t('hosting.add-ipns.bucket-label')" :label-props="{ for: 'bucketUuid' }">
        <n-select
          v-model:value="formData.bucketUuid"
          :placeholder="$t('hosting.add-ipns.bucket-placeholder')"
          :options="bucketOptions"
          filterable
          @update:value="handleUpdateBucket"
        />
      </n-form-item>
      <n-form-item path="cid" :label="$t('hosting.add-ipns.folder-label')" :label-props="{ for: 'repo' }">
        <n-select
          v-model:value="formData.cid"
          :placeholder="$t('hosting.add-ipns.folder-placeholder')"
          :options="folderOptions"
          filterable
          :loading="repoLoading"
          :disabled="!formData.bucketUuid"
        />
      </n-form-item>
      <!--  Ipns name -->
      <n-form-item path="name" :label="$t('form.label.ipnsName')" :label-props="{ for: 'ipnsName' }">
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'ipnsName' }"
          :placeholder="$t('form.placeholder.ipnsName')"
          clearable
        />
      </n-form-item>

      <!--  Ipns description -->
      <n-form-item
        path="description"
        :label="$t('form.label.ipnsDescription')"
        :label-props="{ for: 'ipnsDescription' }"
      >
        <n-input
          v-model:value="formData.description"
          type="textarea"
          :input-props="{ id: 'ipnsDescription' }"
          :placeholder="$t('form.placeholder.ipnsDescription')"
          clearable
        />
      </n-form-item>

      <!--  Form submit -->
      <n-form-item :show-feedback="false">
        <input type="submit" class="hidden" :value="$t('storage.ipns.create')" />
        <Btn
          type="primary"
          class="mb-4 mt-2 w-full"
          :loading="loading"
          :disabled="isFormDisabled"
          @click="handleSubmit"
        >
          {{ $t('storage.ipns.create') }}
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

type FormIpns = {
  name: string;
  description?: string | null;
  bucketUuid: string;
  cid?: string | null | undefined;
};

const props = defineProps({
  buckets: { type: Array<BucketInterface>, default: [] },
});

const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const message = useMessage();
const $i18n = useI18n();
const { query } = useRoute();
const dataStore = useDataStore();
const ipnsStore = useIpnsStore();
const router = useRouter();
const bucketStore = useBucketStore();
const warningStore = useWarningStore();

const loading = ref(false);
const repoLoading = ref(false);
const formRef = ref<NFormInst | null>(null);
const bucketOptions = ref<SelectOption[]>([]);
const folderOptions = ref<SelectOption[]>([]);

const ipns = ref<IpnsInterface | undefined>();

const formData = ref<FormIpns>({
  name: ipns.value?.name || '',
  description: ipns.value?.description || '',
  cid: undefined,
  bucketUuid: '',
});

const rules: NFormRules = {
  name: [ruleRequired($i18n.t('validation.ipnsNameRequired'))],
  description: [ruleDescription($i18n.t('validation.descriptionTooLong'))],
  bucketUuid: [ruleRequired($i18n.t('validation.bucketRequired'))],
  cid: [ruleRequired($i18n.t('validation.folderRequired'))],
};

onMounted(async () => {
  bucketOptions.value = props.buckets.map(bucket => ({
    label: bucket.name,
    value: bucket.bucket_uuid,
  }));

  if (query.bucketUuid) {
    const initialBucket = props.buckets.find(bucket => bucket.bucket_uuid === query.bucketUuid);

    if (initialBucket) {
      formData.value.bucketUuid = initialBucket.bucket_uuid;
      await handleUpdateBucket(initialBucket.bucket_uuid);
    }
  }
});

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

const handleUpdateBucket = async (bucketUuid: string) => {
  repoLoading.value = true;
  const dirContent = await bucketStore.fetchDirectoryContent({
    bucketUuid,
  });
  repoLoading.value = false;

  const directoriesWithCid = dirContent.filter(item => item.CID && item.type === 1);
  folderOptions.value = directoriesWithCid.map(item => ({
    label: item.name,
    value: item.CID ?? '',
  }));
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      warningStore.showSpendingWarning(PriceServiceName.IPNS, () => createIpns());
    }
  });
}

async function createIpns() {
  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }
  loading.value = true;

  try {
    const res = await $api.post<IpnsCreateResponse>(endpoints.ipns(formData.value.bucketUuid), formData.value);

    message.success($i18n.t('form.success.created.ipns'));

    /** On new ipns created add new item to list */
    ipnsStore.items.unshift(res.data);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');

    router.push(`/dashboard/service/storage/${formData.value.bucketUuid}`);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
