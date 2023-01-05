<template>
  <div v-if="fileDetails.CID || fileDetails.file_uuid">
    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('storage.fileName') }}</p>
      <strong v-if="fileDetails?.name">{{ fileDetails.name }}</strong>
      <strong v-else-if="fileDetails?.fileName">{{ fileDetails.fileName }}</strong>
    </div>

    <div v-if="fileDetails.CID" class="body-sm mb-4">
      <p class="body-sm">
        <span>{{ $t('storage.fileCid') }}</span>
        <button class="ml-2" @click="copyToClipboard(fileDetails.CID, $t)">
          <span class="icon-copy"></span>
        </button>
      </p>
      <strong>{{ fileDetails.CID }}</strong>
    </div>

    <div v-if="fileDetails.downloadLink" class="body-sm mb-4">
      <p class="body-sm">
        <span>{{ $t('storage.file.downloadLink') }}</span>
        <button class="ml-2" @click="copyToClipboard(fileDetails.downloadLink, $t)">
          <span class="icon-copy"></span>
        </button>
      </p>
      <strong>{{ fileDetails.downloadLink }}</strong>
    </div>

    <div class="body-sm mb-4">
      <p class="body-sm">{{ $t('storage.fileSize') }}</p>
      <strong>{{ formatBytes(fileDetails.size || 0) }}</strong>
    </div>

    <div v-if="fileDetails.CID" class="body-sm mb-4">
      <p class="body-sm">{{ $t('storage.expiration') }}</p>
      <div class="relative min-h-[20px]">
        <strong v-if="crustFileStatus?.expired_at">
          {{
            fileExpiration(
              parseInt(crustFileStatus.calculated_at),
              parseInt(crustFileStatus.expired_at)
            )
          }}
        </strong>
        <Spinner v-else :size="16" />
      </div>
    </div>

    <div v-if="fileDetails.CID" class="body-sm mb-4">
      <p class="body-sm">{{ $t('storage.replicas') }}</p>
      <div class="relative min-h-[20px]">
        <strong v-if="crustFileStatus?.reported_replica_count">
          {{ crustFileStatus.reported_replica_count }}
        </strong>
        <Spinner v-else :size="16" />
      </div>
    </div>

    <div class="body-sm mb-6">
      <p class="body-sm mb-1">{{ $t('storage.status') }}</p>
      <n-tag
        v-if="fileStatus === FileStatus.PINNED_TO_CRUST"
        type="success"
        :bordered="false"
        round
      >
        {{ $t(`storage.fileStatus.${fileStatus}`) }}
      </n-tag>
      <n-tag
        v-else-if="
          fileStatus === FileStatus.UPLOADED_TO_IPFS ||
          fileStatus === FileStatus.UPLOADED_TO_S3 ||
          fileStatus === FileStatus.REQUEST_FOR_UPLOAD_GENERATED
        "
        type="info"
        :bordered="false"
        round
      >
        {{ $t(`storage.fileStatus.${fileStatus}`) }}
      </n-tag>
      <n-tag v-else type="error" :bordered="false" round>
        {{ $t(`storage.fileStatus.${fileStatus}`) }}
      </n-tag>
    </div>

    <div class="mb-4" v-if="fileDetails.CID">
      <p class="body-sm mb-2">{{ $t('general.actions') }}</p>
      <n-space size="large" vertical>
        <!-- Renew Pool Balance
      <Btn type="secondary" size="large">{{ $t('storage.renewPoolBalance') }}</Btn> 
      -->
        <Btn
          type="primary"
          size="large"
          @click="download(fileDetails.downloadLink, fileDetails.name)"
        >
          {{ $t('general.download') }}
        </Btn>
        <Btn type="secondary" size="large">{{ $t('general.delete') }}</Btn>
      </n-space>
    </div>
  </div>
  <Spinner v-else />
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  fileCid: { type: String, default: '' },
  fileUuid: { type: String, default: '' },
});

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const fileDetails = ref<FileInterface>({} as FileInterface);
const fileStatus = ref<number>(0);
const crustFileStatus = ref<FileCrust>({} as FileCrust);

onMounted(async () => {
  if (props.fileCid) {
    getFileDetails(props.fileCid);
    getcrustFileStatus(props.fileCid);
  } else if (props.fileUuid) {
    getFileDetails(props.fileUuid);
  }
});
onDeactivated(() => {
  fileDetails.value = {} as FileInterface;
  fileStatus.value = 0;
  crustFileStatus.value = {} as FileCrust;
});

/** Get File details */
async function getFileDetails(uuidOrCID: string) {
  if (!(uuidOrCID in dataStore.file.items)) {
    dataStore.file.items[uuidOrCID] = await dataStore.fetchFileDetails(uuidOrCID, $i18n);
  }
  fileDetails.value = dataStore.file.items[uuidOrCID].file;
  fileStatus.value = fileDetails.value?.fileStatus || dataStore.file.items[uuidOrCID].fileStatus;
}

/** Get File details from CRUST */
async function getcrustFileStatus(cid: string) {
  if (!(cid in dataStore.crust)) {
    dataStore.crust[cid] = await dataStore.fetchFileDetailsFromCrust(cid);
  }
  crustFileStatus.value = dataStore.crust[cid] as FileCrust;
}
</script>
