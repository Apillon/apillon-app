<template>
  <n-form ref="formRef" :model="formData" :rules="rules" :disabled="uploadDisabled" @submit.prevent="handleSubmit">
    <!--  File -->
    <n-form-item path="file" :label="$t('form.label.contract.file')" :label-props="{ for: 'file' }">
      <FormFieldUploadFile :file="formData.file" :disabled="uploadDisabled" @upload="onFileChange" />
    </n-form-item>

    <!--  NFT ID -->
    <n-form-item path="nftId" :label="$t('form.label.contract.nftId')" :label-props="{ for: 'nftId' }">
      <n-input-number
        v-model:value="formData.nftId"
        :input-props="{ id: 'nftId' }"
        :placeholder="$t('form.placeholder.typeHere')"
        min="1"
        step="1"
        clearable
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-feedback="false" :show-label="false">
      <input type="submit" class="hidden" :value="$t('computing.contract.assignCid')" />
      <Btn type="primary" class="mt-2 w-full" :disabled="uploadDisabled" :loading="loading" @click="handleSubmit">
        {{ $t('computing.contract.assignCid') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, UploadCustomRequestOptions } from 'naive-ui';

type EncryptContent = {
  encryptedContent: string;
};
type FormContractAssignCid = {
  cid: string;
  file: FileListItemType | undefined;
  nftId: number;
};

const props = defineProps({
  contractUuid: { type: String, required: true },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const contractStore = useContractStore();
const warningStore = useWarningStore();
const { uploadFileToIPFS } = useComputing();

const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const formData = ref<FormContractAssignCid>({
  cid: '',
  file: undefined,
  nftId: 1,
});

const contract = computed<ContractInterface | undefined>(() => {
  if (contractStore.active.contract_uuid === props.contractUuid) {
    return contractStore.active;
  }
  return contractStore.items.find(item => item.contract_uuid === props.contractUuid);
});
const uploadDisabled = computed<boolean>(() => contract.value?.contractStatus !== ContractStatus.DEPLOYED);

const rules: NFormRules = {
  file: [ruleRequired($i18n.t('validation.contract.fileRequired'))],
  nftId: [ruleRequired($i18n.t('validation.contract.nftIdRequired'))],
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      warningStore.showSpendingWarning(PriceServiceName.COMPUTING_SCHRODINGER_ASSIGN_CID_TO_NFT, () =>
        encryptFile(formData.value.file)
      );
    }
  });
}

async function onFileChange({ file, onError, onFinish }: UploadCustomRequestOptions) {
  const size = file.file?.size || 0;

  if (file.type?.startsWith('application/octet-stream') || file.type?.startsWith('application/x-msdownload')) {
    message.warning($i18n.t('validation.contract.fileIsApp', { name: file.name }));
    onError();
    return;
  } else if (size > 65536) {
    message.warning($i18n.t('validation.contract.fileTooBig', { name: file.name }));
    onError();
    return;
  }

  formData.value.file = {
    ...file,
    path: file.fullPath,
    percentage: 0,
    size: size,
    timestamp: Date.now(),
    onFinish,
    onError,
  };
}

async function encryptFile(file?: FileListItemType) {
  if (!file) return;

  loading.value = true;
  try {
    const fileContent = await convertBase64(file.file);

    const res = await $api.post<GeneralResponse<EncryptContent>>(endpoints.contractEncrypt(props.contractUuid), {
      contract_uuid: props.contractUuid,
      content: fileContent,
    });
    message.success($i18n.t('form.success.contract.encrypted'));
    file.onFinish();

    await onFileEncrypted(file, res.data.encryptedContent);
  } catch (error) {
    message.error(userFriendlyMsg(error));
    file.onError();
  } finally {
    loading.value = false;
  }
}

async function onFileEncrypted(file: FileListItemType, encryptedContent: string) {
  const fileDetails = await uploadFileToIPFS(file, contractStore.bucketUuid, encryptedContent);

  if (fileDetails) {
    const cid = fileDetails.CIDv1 || fileDetails.CID;

    const fileLink = new URL(fileDetails.link);
    const token = fileLink.searchParams.get('token');

    formData.value.cid = `${cid}/?token=${token}`;

    await assignCid();
  }
}

async function assignCid() {
  try {
    const res = await $api.post<SuccessResponse>(endpoints.contractAssignCid(props.contractUuid), {
      cid: formData.value.cid,
      nftId: formData.value.nftId,
    });

    if (res.data.success) {
      message.success($i18n.t('form.success.contract.cidAssign'));

      /** Emit events */
      emit('submitSuccess');
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
}
</script>
