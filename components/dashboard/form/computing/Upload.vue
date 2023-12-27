<template>
  <n-upload
    :show-file-list="false"
    :disabled="uploadDisabled && authStore.isAdmin()"
    :custom-request="encryptFile"
  >
    <n-upload-dragger class="h-60">
      <div class="py-2 text-center">
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

const props = defineProps({
  contractUuid: { type: String, required: true },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const contractStore = useContractStore();

const loading = ref<boolean>(true);

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
  loading.value = true;

  try {
    const fileContent = await convertBase64(file.file);

    await $api.post<any>(endpoints.contractEncrypt(props.contractUuid), {
      contract_uuid: props.contractUuid,
      content: fileContent,
    });

    message.success($i18n.t('form.success.contract.encrypted'));
    onFinish();

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
    onError();
  }
  loading.value = false;
}

const convertBase64 = file => {
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
