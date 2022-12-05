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

const message = useMessage();
const $i18n = useI18n();

const fileList = ref<NUploadFileInfo[]>([
  {
    id: 'a',
    name: 'My Fault.png',
    status: 'error',
  },
  {
    id: 'c',
    name: 'Finished you can dowload.png',
    status: 'finished',
    url: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
  },
  {
    id: 'd',
    name: 'Waiting for the finish .doc',
    status: 'uploading',
    percentage: 50,
  },
]);

/**
 *  API calls
 */
async function fetchFilesDetails(fileUuid: string) {
  try {
    const res = await $api.get<FileDetailsResponse>(endpoints.storageFileDetails, {
      file_uuid: fileUuid,
    });

    if (res.data) {
      message.success(res.data.file.filename);
      console.log(res);
    }
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
}

const uploadFiles = async ({
  file,
  onError,
  onFinish,
  onProgress,
}: NUploadCustomRequestOptions) => {
  const sessionUuid = uuidv4();
  const bodyData: FormFileUploadRequest = {
    bucket_uuid: props.bucketUuid,
    session_uuid: sessionUuid,
    fileName: file.name,
    contentType: file.type || 'text/plain',
    path: '/folder',
  };

  try {
    /** Upload file request */
    const res = await $api.post<FileUploadRequestResponse>(endpoints.storageFileUpload, bodyData);

    /** Upload file to S3 */
    var xhr = new XMLHttpRequest();
    xhr.onprogress = percent => {
      console.log('progress', percent);
      onProgress({ percent: Math.ceil(100) });
    };
    xhr.open('PUT', res.data.signedUrlForUpload, false);
    xhr.onreadystatechange = function (aEvt) {
      console.log('onreadystatechange');
      console.log(xhr);
      console.log(aEvt);
      if (xhr.readyState == 4) {
        //run any callback here
        onFinish();
      }
    };
    xhr.onload = success => {
      console.log('success', success);
      onFinish();
    };
    xhr.onerror = error => {
      console.log('error', error);
      onError();
    };
    xhr.send(file.file as File);
    console.log('xhr');
    console.log(xhr);

    /** Session End */
    const resSessionEnd = await $api.post<PasswordResetResponse>(
      `${endpoints.storageFileUploadSession}/${sessionUuid}/end`,
      { directSync: true }
    );

    if (resSessionEnd.data) {
      message.success($i18n.t('storage.fileUploaded'));
    }
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
};
</script>
