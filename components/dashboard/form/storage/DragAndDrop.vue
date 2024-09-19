<template>
  <n-upload
    multiple
    directory-dnd
    :show-file-list="false"
    :loading="loading"
    :disabled="authStore.isAdmin()"
    :custom-request="uploadFilesRequest"
  >
    <n-upload-dragger class="relative" :style="uploadHeight">
      <div class="py-2 text-center" :class="{ blur: loading }">
        <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
          <span class="icon-upload text-violet text-2xl"></span>
        </div>

        <h4 class="mb-1">{{ $t('storage.file.upload') }}</h4>
        <span class="text-body">{{ $t('storage.file.dragAndDrop') }}</span>
      </div>
      <spinner v-if="loading" />
    </n-upload-dragger>
  </n-upload>
</template>

<script lang="ts" setup>
import { useMessage, type UploadCustomRequestOptions } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const bucketStore = useBucketStore();
const paymentStore = usePaymentStore();
const { fileAlreadyOnFileList, fileTypeSameAsContent, fileTypeValid, isEnoughSpaceInStorage } =
  useUpload();

const loading = ref<boolean>(false);

/** Upload height */
const uploadHeight = computed(() => {
  return {
    height: bucketStore.hasBucketItems ? 'auto' : 'calc(100dvh - 370px)',
  };
});

onMounted(() => {
  paymentStore.getActiveSubscription();
});

/** Upload file request - add file to list */
async function uploadFilesRequest({ file, onError, onFinish }: UploadCustomRequestOptions) {
  loading.value = true;
  const fileListItem: FileListItemType = {
    ...file,
    percentage: 0,
    size: file.file?.size || 0,
    timestamp: Date.now(),
    onFinish,
    onError,
  };
  console.log(paymentStore.hasActiveSubscription);
  console.log(await fileTypeValid(fileListItem));

  if (!isEnoughSpaceInStorage(bucketStore.uploadFileList, fileListItem)) {
    message.warning($i18n.t('validation.notEnoughSpaceInStorage', { name: file.name }));
    onError();
  } else if (fileAlreadyOnFileList(bucketStore.uploadFileList, fileListItem)) {
    onError();
  } else if (!(await fileTypeSameAsContent(fileListItem))) {
    message.warning($i18n.t('validation.fileTypeNotSameAsContent', { name: file.name }));
    onError();
  } else if (!paymentStore.hasActiveSubscription && !(await fileTypeValid(fileListItem))) {
    message.warning($i18n.t('validation.fileTypeNotAllow', { name: file.name }));
    onError();
  } else {
    bucketStore.uploadFileList.push(fileListItem);
  }
  loading.value = false;
}
</script>
