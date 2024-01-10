<template>
  <n-upload
    class="pr-1"
    :show-file-list="false"
    :disabled="uploadDisabled && authStore.isAdmin()"
    :custom-request="encryptFile"
  >
    <n-upload-dragger class="h-40">
      <div v-if="contractStore.uploading">
        <Spinner />
        <h4 class="mt-12 text-center">{{ $t('computing.contract.encrypt.step2Info') }}</h4>
      </div>
      <div v-else class="py-2 text-center">
        <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
          <span class="icon-upload text-violet text-2xl"></span>
        </div>

        <h4 class="mb-1">{{ $t('computing.upload.upload') }}</h4>
        <span class="text-body">{{ $t('computing.upload.dragAndDrop') }}</span>
      </div>
    </n-upload-dragger>
  </n-upload>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

type EncryptContent = {
  encryptedContent: string;
};

const props = defineProps({
  contractUuid: { type: String, required: true },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const contractStore = useContractStore();

const contract = computed<ContractInterface | undefined>(() => {
  if (contractStore.active.contract_uuid === props.contractUuid) {
    return contractStore.active;
  }
  return contractStore.items.find(item => item.contract_uuid === props.contractUuid);
});

const uploadDisabled = computed<boolean>(
  () => contract.value?.contractStatus !== ContractStatus.DEPLOYED
);

/** Upload file request - add file to list */
async function encryptFile({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  const size = file.file?.size || 0;
  if (size > 65536) {
    message.warning($i18n.t('validation.contract.fileTooBig', { name: file.name }));
    onError();
    return;
  }

  contractStore.uploading = true;
  contractStore.file = {
    ...file,
    percentage: 0,
    size: size,
    timestamp: Date.now(),
    onFinish,
    onError,
  };

  try {
    const fileContent = await convertToBase64(file.file);

    const res = await $api.post<GeneralResponse<EncryptContent>>(
      endpoints.contractEncrypt(props.contractUuid),
      {
        contract_uuid: props.contractUuid,
        content: fileContent,
      }
    );
    message.success($i18n.t('form.success.contract.encrypted'));
    onFinish();

    /**Emit events */
    emit('submitSuccess', res.data.encryptedContent);
  } catch (error) {
    message.error(userFriendlyMsg(error));
    onError();
  }
  contractStore.uploading = false;
}

const convertToBase64 = file => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = error => {
      reject(error);
    };
  });
};
</script>
