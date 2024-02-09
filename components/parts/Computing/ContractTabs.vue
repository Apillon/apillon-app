<template>
  <n-tabs
    ref="encryptTabRef"
    v-model:value="contractStore.encryptTab"
    class="types-hidden"
    animated
  >
    <n-tab-pane :name="EncryptTab.BUCKET">
      <template #tab>
        <IconNumber
          v-if="contractStore.encryptTab === EncryptTab.BUCKET"
          :number="1"
          :active="true"
        />
        <IconSuccessful v-else />
        <span class="ml-2">{{ $t('computing.contract.encrypt.step1') }}</span>
      </template>
      <slot>
        <FormComputingBucket @submit-success="onBucketSelected" />
      </slot>
    </n-tab-pane>
    <n-tab-pane :name="EncryptTab.ASSIGN" :disabled="!contractStore.bucketUuid">
      <template #tab>
        <IconSuccessful v-if="contractStore.encryptTab === EncryptTab.FINISHED" />
        <IconNumber v-else :number="2" :active="contractStore.encryptTab === EncryptTab.ASSIGN" />
        <span class="ml-2">{{ $t('computing.contract.encrypt.step2') }}</span>
      </template>
      <slot>
        <FormComputingUpload
          class="max-w-xl mx-auto my-8 relative"
          :contract-uuid="contractStore.active.contract_uuid"
          @submit-success="onFileUploaded"
        />
        <FormComputingAssignCID
          class="max-w-xl mx-auto my-8"
          :contract-uuid="contractStore.active.contract_uuid"
          :cid="contractStore.cid"
          :enabled="!!contractStore.cid"
          @submit-success="contractStore.encryptTab = EncryptTab.FINISHED"
        />
      </slot>
    </n-tab-pane>
    <n-tab-pane
      :name="EncryptTab.FINISHED"
      :disabled="!contractStore.bucketUuid || !contractStore.cid"
    >
      <template #tab>
        <IconNumber :number="3" :active="contractStore.encryptTab === EncryptTab.FINISHED" />
        <span class="ml-2">{{ $t('computing.contract.encrypt.step3') }}</span>
      </template>
      <slot>
        <div class="max-w-md mx-auto my-8 text-center">
          <h4 class="mb-2">{{ $t('computing.contract.encrypt.step3') }}</h4>
          <p class="mb-4">{{ $t('computing.contract.encrypt.step3Info') }}</p>
          <Btn type="secondary" @click="goToFirstStep()">
            {{ $t('computing.contract.encrypt.step3Btn') }}
          </Btn>
        </div>
      </slot>
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import type { TabsInst } from 'naive-ui';

const { t } = useI18n();
const message = useMessage();
const contractStore = useContractStore();

const encryptTabRef = ref<TabsInst | null>(null);

onMounted(() => {
  goToFirstStep();
});

/** Watch active tab, if information are missing, open previous tab */
watch(
  () => contractStore.encryptTab,
  tab => {
    if (tab === EncryptTab.ASSIGN && !contractStore.bucketUuid) {
      contractStore.encryptTab = EncryptTab.BUCKET;
      nextTick(() => encryptTabRef.value?.syncBarPosition());
    } else if (tab >= EncryptTab.ASSIGN && !contractStore.cid) {
      contractStore.encryptTab = EncryptTab.ASSIGN;
      nextTick(() => encryptTabRef.value?.syncBarPosition());
    }
  }
);

function goToFirstStep() {
  contractStore.cid = '';
  contractStore.file = {} as FileListItemType;

  if (contractStore.active.bucket_uuid) {
    contractStore.bucketUuid = contractStore.active.bucket_uuid;
    contractStore.encryptTab = EncryptTab.ASSIGN;
  } else {
    contractStore.encryptTab = EncryptTab.BUCKET;
  }
}

function onBucketSelected(bucketUuid: string) {
  contractStore.bucketUuid = bucketUuid;
  contractStore.encryptTab = EncryptTab.ASSIGN;
}

async function onFileUploaded(encryptedContent: string) {
  const fileDetails = await uploadFileToIPFS(
    contractStore.file,
    contractStore.bucketUuid,
    encryptedContent
  );
  contractStore.uploading = false;

  if (fileDetails) {
    const cid = fileDetails.CIDv1 || fileDetails.CID;

    const fileLink = new URL(fileDetails.link);
    const token = fileLink.searchParams.get('token');

    contractStore.cid = `${cid}/?token=${token}`;
    console.log(contractStore.cid);
  }
}

async function uploadFileToIPFS(
  file: FileListItemType,
  bucketUuid: string,
  encryptedContent: string
): Promise<FileInterface | null> {
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

    setTimeout(() => {
      message.success(t('computing.contract.encrypt.step2Info'), { duration: 5000 });
    }, 1000);

    // Start pooling file
    return await getFile(bucketUuid, uploadUrl.file_uuid);
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
