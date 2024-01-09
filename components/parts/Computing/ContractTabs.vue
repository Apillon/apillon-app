<template>
  <n-tabs ref="encryptTabRef" v-model:value="contractStore.encryptTab" type="segment" animated>
    <n-tab-pane :name="EncryptTab.BUCKET">
      <template #tab>
        <IconNumber
          v-if="contractStore.encryptTab === EncryptTab.BUCKET"
          :number="1"
          :active="true"
        />
        <IconSuccessful v-else />
        <span class="ml-2">Select bucket</span>
      </template>
      <slot>
        <FormComputingBucket @submit-success="onBucketSelected" />
      </slot>
    </n-tab-pane>
    <n-tab-pane :name="EncryptTab.UPLOAD" :disabled="false">
      <template #tab>
        <IconSuccessful v-if="contractStore.encryptTab === EncryptTab.ENCRYPT" />
        <IconNumber v-else :number="2" :active="contractStore.encryptTab === EncryptTab.UPLOAD" />
        <span class="ml-2">Upload file</span>
      </template>
      <slot>
        <FormComputingUpload
          class="max-w-xl mx-auto my-8"
          :contract-uuid="contractStore.active.contract_uuid"
          @submit-success="onFileUploaded"
        />
      </slot>
    </n-tab-pane>
    <n-tab-pane :name="EncryptTab.ENCRYPT" :disabled="false">
      <template #tab>
        <IconNumber :number="3" :active="contractStore.encryptTab === EncryptTab.ENCRYPT" />
        <span class="ml-2">Encrypt</span>
      </template>
      <slot>
        <FormComputingAssignCID
          v-if="contractStore.cid"
          class="max-w-xl mx-auto my-8"
          :contract-uuid="contractStore.active.contract_uuid"
          :cid="contractStore.cid"
        />
      </slot>
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import type { TabsInst } from 'naive-ui';

const message = useMessage();
const contractStore = useContractStore();

const encryptTabRef = ref<TabsInst | null>(null);

/** Watch active tab, if information are missing, open previous tab */
watch(
  () => contractStore.encryptTab,
  tab => {
    if (tab === EncryptTab.UPLOAD && !contractStore.bucketUuid) {
      contractStore.encryptTab = EncryptTab.BUCKET;
      nextTick(() => encryptTabRef.value?.syncBarPosition());
    } else if (tab === EncryptTab.ENCRYPT && !contractStore.cid) {
      contractStore.encryptTab = EncryptTab.UPLOAD;
      nextTick(() => encryptTabRef.value?.syncBarPosition());
    }
  }
);

function onBucketSelected(bucketUuid: string) {
  contractStore.bucketUuid = bucketUuid;
  contractStore.encryptTab = EncryptTab.UPLOAD;
}

async function onFileUploaded(encryptedContent: string) {
  const cid = await uploadFileToIPFS(
    contractStore.file,
    contractStore.bucketUuid,
    encryptedContent
  );
  contractStore.uploading = false;

  if (cid) {
    contractStore.cid = cid;
    contractStore.encryptTab = EncryptTab.ENCRYPT;
  }
}

async function uploadFileToIPFS(
  file: FileListItemType,
  bucketUuid: string,
  encryptedContent: string
): Promise<string | null> {
  const sessionUuid = uuidv4();
  const data = {
    session_uuid: sessionUuid,
    files: [{ fileName: file.name }],
  };

  try {
    const uploadSession = await $api.post<FilesUploadRequestResponse>(
      endpoints.storageFilesUpload(bucketUuid),
      data
    );
    const uploadUrl = uploadSession.data.files[0];

    // Upload to S3
    await fetch(uploadUrl.url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: encryptedContent,
    });

    // End session
    await $api.post(endpoints.storageFileUpload(bucketUuid, sessionUuid));

    // Start pooling file
    const uploadedFile = await getFile(bucketUuid, uploadUrl.file_uuid);

    return uploadedFile.CID || uploadedFile.CIDv1;
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  return null;
}

async function getFile(bucketUuid: string, fileUuid: string): Promise<FileInterface> {
  return new Promise(function (resolve) {
    const getFileInterval = setInterval(async () => {
      const fileData = await getFilePoll(bucketUuid, fileUuid);

      if (fileData && (fileData?.CID || fileData?.CIDv1)) {
        clearInterval(getFileInterval);
        resolve(fileData);
      }
    }, 5000);
  });
}

async function getFilePoll(bucketUuid: string, fileUuid: string): Promise<FileInterface> {
  const response = await $api.get<FileDetailsResponse>(
    endpoints.storageFileDetails(bucketUuid, fileUuid)
  );
  return response.data;
}
</script>
