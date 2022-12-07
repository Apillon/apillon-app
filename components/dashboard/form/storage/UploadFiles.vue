<template>
  <n-upload :default-file-list="fileList" multiple directory-dnd :custom-request="uploadFiles">
    <n-upload-dragger>
      <div>
        <span>Drag & drop files and folders you want to upload to your bucket, or</span>
        <n-upload-trigger #="{ handleClick }" abstract>
          <strong class="text-primary" @click="handleClick"> Click to upload. </strong>
        </n-upload-trigger>
      </div>
    </n-upload-dragger>
  </n-upload>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  bucketUuid: { type: String, required: true },
});

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();

const fileList = ref<NUploadFileInfo[]>([]);

/**
 *  API calls
 */
const uploadFiles = async ({
  file,
  onError,
  onFinish,
  onProgress,
}: NUploadCustomRequestOptions) => {
  const sessionUuid = file.batchId || uuidv4();
  const bodyData: FormFileUploadRequest = {
    bucket_uuid: props.bucketUuid,
    session_uuid: sessionUuid,
    fileName: file.name,
    contentType: file.type || '',
    path: dataStore.currentFolder.name || '',
  };

  fileList.value.push({
    id: file.id,
    name: file.name,
    status: 'uploading',
    percentage: 0,
  });

  try {
    /** Upload file request */
    const res = await $api.post<FileUploadRequestResponse>(endpoints.storageFileUpload, bodyData);

    /** Upload file to S3 */
    var xhr = new XMLHttpRequest();
    xhr.onprogress = (progress: ProgressEvent<EventTarget>) => {
      console.log('progress');
      console.log(progress);
      console.log(progress.loaded);

      updateFilePercentage(file.id, progress.loaded);
      onProgress({ percent: Math.ceil(progress.loaded) });
    };
    xhr.open('PUT', res.data.signedUrlForUpload, true);
    xhr.onreadystatechange = function (aEvt) {
      console.log('onreadystatechange');
      console.log(xhr);
      console.log(xhr.readyState);
      console.log(aEvt);
      if (xhr.readyState == 2) {
        updateFilePercentage(file.id, 20);
      }
      if (xhr.readyState == 3) {
        updateFilePercentage(file.id, 80);
      }
      if (xhr.readyState == 4) {
        //run any callback here
        updateFilePercentage(file.id, 90);
        onFinish();
      }
    };
    xhr.onload = (success: ProgressEvent<EventTarget>) => {
      console.log('success');
      console.log(success);
      console.log(success.loaded);
      uploadSessionEnd(sessionUuid);
      onFinish();
    };
    xhr.onerror = error => {
      console.log('error', error);
      updateFileStatus(file.id, 'error');
      onError();
    };
    xhr.send(file.file as File);
    console.log('xhr');
    console.log(xhr);
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
};

function updateFilePercentage(fileId: string, percent: number) {
  fileList.value.map(item => {
    if (item.id === fileId) {
      item.percentage = percent;
    }
  });
}
function updateFileStatus(
  fileId: string,
  status: 'pending' | 'uploading' | 'finished' | 'removed' | 'error'
) {
  fileList.value.map(item => {
    if (item.id === fileId) {
      item.status = status;
    }
  });
}

/** Upload Session End */
async function uploadSessionEnd(sessionUuid: string) {
  const resSessionEnd = await $api.post<PasswordResetResponse>(
    `${endpoints.storageFileUploadSession}/${sessionUuid}/end`,
    { directSync: true }
  );

  if (resSessionEnd.data) {
    message.success($i18n.t('storage.fileUploaded'));
  }

  dataStore.fetchDirectoryContent($i18n);
}
</script>
