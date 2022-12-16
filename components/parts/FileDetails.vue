<template>
  <div v-if="fileDetails.CID || fileDetails.file_uuid">
    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('storage.fileName') }}</p>
      <strong>{{ fileDetails.name || fileDetails.fileName }}</strong>
    </div>

    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('storage.fileCid') }}</p>
      <strong>{{ fileDetails.CID }}</strong>
    </div>

    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('storage.fileSize') }}</p>
      <strong>{{ formatBytes(fileDetails.size) }}</strong>
    </div>

    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('storage.expiration') }}</p>
      <div class="relative min-h-[20px]">
        <strong v-if="crustStatus?.expired_at">
          {{ fileExpiration(parseInt(crustStatus.expired_at)) }}
        </strong>
        <Spinner v-else :size="16" />
      </div>
    </div>

    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('storage.replicas') }}</p>
      <div class="relative min-h-[20px]">
        <strong v-if="crustStatus?.reported_replica_count">
          {{ crustStatus.reported_replica_count }}
        </strong>
        <Spinner v-else :size="16" />
      </div>
    </div>

    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('storage.status') }}</p>
      <n-tag
        v-if="fileStatus === FileStatus.PINNED_TO_CRUST"
        type="success"
        :bordered="false"
        round
      >
        {{ $t('general.ok') }}
      </n-tag>
      <n-tag
        v-else-if="fileStatus === FileStatus.UPLOADED_TO_IPFS"
        type="info"
        :bordered="false"
        round
      >
        UPLOADED_TO_IPFS
      </n-tag>
      <n-tag
        v-else-if="fileStatus === FileStatus.UPLOADED_TO_S3"
        type="info"
        :bordered="false"
        round
      >
        UPLOADED_TO_S3
      </n-tag>
      <n-tag
        v-else-if="fileStatus === FileStatus.REQUEST_FOR_UPLOAD_GENERATED"
        type="info"
        :bordered="false"
        round
      >
        UPLOADED_TO_S3
      </n-tag>
      <n-tag v-else type="error" :bordered="false" round>
        {{ $t('general.error') }}
      </n-tag>
    </div>

    <div class="mb-4">
      <p class="body-sm">{{ $t('general.actions') }}</p>
    </div>
    <Btn type="secondary" size="large">{{ $t('storage.renewPoolBalance') }}</Btn>
  </div>
  <Spinner v-else />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot, crustTypes } from '@crustio/type-definitions';
import { AnyJson } from '@polkadot/types-codec/types';

const props = defineProps({
  fileCid: { type: String, default: '' },
  fileUuid: { type: String, default: '' },
});

type File = FileInterface | FileUploadInterface;

const $i18n = useI18n();
const dataStore = useDataStore();
const fileDetails = ref<File>({} as File);
const fileStatus = ref<number>(0);
const crustStatus = ref<AnyJson>();

onMounted(async () => {
  if (props.fileCid) {
    getFileDetails(props.fileCid);
    getCrustStatus(props.fileCid);
  } else if (props.fileUuid) {
    getFileDetails(props.fileUuid);
  }
});
onDeactivated(() => {
  fileDetails.value = {} as File;
  fileStatus.value = 0;
  crustStatus.value = {} as FileInfo;
});

// Define FileInfo
type FileInfo = typeof crustTypes.market.types.FileInfoV2;

async function getFileDetails(uuidOrCID: string) {
  const fileDetailsResponse = await dataStore.fetchFileDetails(uuidOrCID, $i18n);
  fileDetails.value = fileDetailsResponse.file;
  fileStatus.value = fileDetailsResponse.fileStatus;
}

/** Get File details from CRUST */
async function getCrustStatus(cid: string) {
  if (!(cid in dataStore.crust)) {
    dataStore.crust[cid] = await fetchFileDetailsFromCrust(cid);
  }
  crustStatus.value = dataStore.crust[cid];
}

async function fetchFileDetailsFromCrust(cid: string) {
  const api = new ApiPromise({
    provider: new WsProvider('wss://rpc.crust.network'),
    typesBundle: typesBundleForPolkadot,
  });

  await api.isReadyOrError;
  const fileInfo = await api.query.market.filesV2(cid);
  return fileInfo.toJSON();
}
</script>
