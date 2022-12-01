<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <n-space align="center" :size="32" class="-mb-4">
        <span class="icon-back"></span>
        <h4>{{ $t('storage.bucketManagement') }}</h4>
        <Notification type="success">
          <span class="text-green">
            Bucket storage
            <strong class="text-grey-light">Bucketname</strong>
            was successfully created
          </span>
        </Notification>
      </n-space>
    </template>

    <template #infobar>
      <n-space align="center" justify="space-between" class="w-full">
        <Tag color="violet">{{ bucket.name }}</Tag>
        <span>
          <span class="icon-storage"></span>
          {{ $t('storage.bucket') }}
        </span>
        <ProgressStorage
          class="w-1/2"
          :percentage="bucket.percentage"
          :size="bucket.sizeMb"
          :max-size="bucket.maxSizeMb"
        />
      </n-space>
    </template>

    <template #sidebar>
      <SidebarBucketManagement />
    </template>

    <template #learn>
      <LearnAlert>
        Click on a service you want to attach to your project. After configuring it, the service
        will become operational.
        <strong>Keep in mind, you can always edit the attached services or add new ones.</strong>
      </LearnAlert>
      <LearnCollapse />
    </template>
    <slot>
      <n-h5 prefix="bar" class="mb-8">{{ $t('nav.storage') }}</n-h5>
      <n-upload multiple directory-dnd :custom-request="uploadFiles">
        <n-upload-dragger>
          <div>
            <span>Drag & drop files and folders you want to upload to your bucket, or</span>
            <n-upload-trigger #="{ handleClick }" abstract>
              <strong class="text-primary" @click="handleClick"> Click to upload. </strong>
            </n-upload-trigger>
          </div>
        </n-upload-dragger>

        <!-- <n-upload-file-list /> -->
      </n-upload>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { lyla } from 'lyla';
import { useMessage } from 'naive-ui';
import { FileInfo, SettledFileInfo } from 'naive-ui/es/upload/src/interface';
import { useI18n } from 'vue-i18n';

const message = useMessage();
const $i18n = useI18n();
const { params } = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('nav.storage'),
});

/** Bucket ID from route */
const bucketId = parseInt(`${params?.id}`);

onMounted(() => {
  if (!Array.isArray(dataStore.services.bucket) || dataStore.services.bucket.length === 0) {
    Promise.all(Object.values(dataStore.promises)).then(_ => {
      dataStore.getBuckets();
      pageLoading.value = false;
    });
  } else if (!dataStore.services.bucket.find(bucket => bucket.id === bucketId)) {
    router.push({ name: 'dashboard-service-storage' });
  } else {
    pageLoading.value = false;
  }
});

/** Bucket from state, if bucket doesn't exists than redirect to storage */
const bucket = computed<BucketInterface>(() => {
  return dataStore.services.bucket.find((item: BucketInterface) => item.id === bucketId) || {};
});

/**
 *  API calls
 */
async function getFilesDetails(fileUuid: string) {
  try {
    const res = await $api.get<FileDetailsResponse>(endpoints.storageFileDetails, {
      file_uuid: fileUuid,
    });

    if (res.file) {
      message.success(res.file.name);
      console.log(res);
    }
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
}

const uploadFiles = async ({
  file,
  withCredentials,
  onError,
  onFinish,
  onProgress,
}: NUploadCustomRequestOptions) => {
  const bodyData: FormFileUploadRequest = {
    bucket_uuid: bucket.value.bucket_uuid,
    session_uuid: authStore.userUuid,
    fileName: file.name,
    contentType: file.type || 'text/plain',
    // path: bucket.value.name,
  };

  try {
    const res = await $api.post<FileUploadRequestResponse>(endpoints.storageFileUpload, bodyData);

    console.log(res.data);
    console.log(file);
    const formData = new FormData();
    formData.append('file', file.file as File);
    console.log(formData);
    console.log('withCredentials', withCredentials);

    lyla
      .post(res.data.signedUrlForUpload, {
        withCredentials,
        body: formData,
        onUploadProgress: ({ percent }) => {
          console.log('percent', percent);
          onProgress({ percent: Math.ceil(percent) });
        },
      })
      .then(({ json }) => {
        message.success(JSON.stringify(json));
        onFinish();
      })
      .catch(error => {
        message.success(error.message);
        onError();
      });
    // uploadFileData(file, res.data.signedUrlForUpload, withCredentials || false);
    sendFile(res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
};

async function uploadFileData(file: SettledFileInfo, url: string, withCredentials: boolean) {
  console.log(file);
  const formData = new FormData();
  formData.append('file', file.file as File);
  console.log(formData);

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: file,
    })
      .then(response => response.json())
      .then(success => console.log(success))
      .catch(error => console.log(error));
    console.log(res);
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
}

async function sendFile(data: FileUploadRequestInterface) {
  try {
    const res = await $api.post<PasswordResetResponse>(
      `${endpoints.storageFileUploadSession}/${authStore.userUuid}/end`,
      { directSync: true }
    );

    if (res.data) {
      message.success($i18n.t('storage.fileUploaded'));
    }
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
}
</script>
