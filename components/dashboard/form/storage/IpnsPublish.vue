<template>
  <Spinner v-if="fileStore.loading" />
  <div v-else>
    <div v-if="fileStore.all.length">
      <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
        <n-form-item
          path="file"
          :label="$t('storage.ipns.selectFile')"
          :label-props="{ for: 'file' }"
        >
          <select-options
            v-model:value="formData.file"
            :options="files"
            :placeholder="$t('storage.ipns.selectFile')"
            filterable
            clearable
          />
        </n-form-item>

        <!--  Publis IPNS submit -->
        <n-form-item :show-label="false">
          <input type="submit" class="hidden" :value="$t('form.proceed')" />
          <Btn type="primary" size="large" class="mt-2" :loading="loading" @click="handleSubmit">
            {{ $t('storage.ipns.publish') }}
          </Btn>
        </n-form-item>
      </n-form>
    </div>
    <div v-else>No files</div>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const props = defineProps({
  ipnsId: { type: Number, required: true },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const message = useMessage();
const $i18n = useI18n();
const bucketStore = useBucketStore();
const fileStore = useFileStore();
const ipnsStore = useIpnsStore();

const loading = ref(false);
const modalCreateIpnsVisible = ref<boolean>(false);

const formRef = ref<NFormInst | null>(null);
const formData = ref<FormIpnsPublishFile>({
  file: '',
});
const rules: NFormRules = {
  file: [
    {
      required: true,
      message: $i18n.t('validation.fileRequired'),
    },
  ],
};

const files = fileStore.all
  .filter(item => !!item.CID)
  .map(item => {
    return { label: item.fileName, value: item.CID };
  });

onMounted(async () => {
  await fileStore.fetchAllFiles(FileUploadRequestFileStatus.UPLOAD_COMPLETED);
});

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      publishToIpns(props.ipnsId);
    }
  });
}

async function publishToIpns(ipnsId: number) {
  loading.value = true;

  try {
    const res = await $api.post<IpnsPublishResponse>(
      endpoints.ipnsPublish(bucketStore.selected, ipnsId),
      { cid: formData.value?.file }
    );

    message.success($i18n.t('form.success.created.ipns'));

    /** On  ipns publish, update data */
    ipnsStore.items.forEach(ipns => {
      if (ipns.id === res.data.id) {
        ipns.ipnsName = res.data.ipnsName;
        ipns.ipnsValue = res.data.ipnsValue;
      }
    });

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
