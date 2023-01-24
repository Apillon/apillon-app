<template>
  <n-space
    v-if="fileDetails.CID || fileDetails.file_uuid"
    class="h-full"
    justify="space-between"
    vertical
  >
    <div>
      <!-- CID -->
      <div v-if="fileDetails.CID" class="body-sm mb-4">
        <p class="body-sm">
          <span class="text-body">{{ $t('storage.fileCid') }}</span>
        </p>
        <div>
          <strong>{{ fileDetails.CID }}</strong>
        </div>
        <button class="text-primary btn-small" @click="copyToClipboard(fileDetails.CID)">
          <strong>{{ $t('dashboard.clipboard.copyLink') }}</strong>
        </button>
      </div>

      <!-- Link -->
      <div v-if="fileDetails.downloadLink" class="body-sm mb-4">
        <p class="body-sm">
          <span class="text-body">{{ $t('storage.file.downloadLink') }}</span>
        </p>
        <div>
          <strong>{{ fileDetails.downloadLink }}</strong>
        </div>
        <button class="text-primary btn-small" @click="copyToClipboard(fileDetails.downloadLink)">
          <strong>{{ $t('dashboard.clipboard.copyLink') }}</strong>
        </button>
      </div>

      <!-- Size -->
      <div class="body-sm mb-4">
        <p class="body-sm text-body">{{ $t('storage.fileSize') }}</p>
        <strong>{{ formatBytes(fileDetails.size || 0) }}</strong>
      </div>

      <!-- Expiration -->
      <div v-if="fileDetails.CID" class="body-sm mb-4">
        <p class="body-sm text-body">{{ $t('storage.expiration') }}</p>
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

      <!-- Replicas -->
      <div v-if="fileDetails.CID" class="body-sm mb-4">
        <p class="body-sm text-body">{{ $t('storage.replicas') }}</p>
        <div class="relative min-h-[20px]">
          <strong v-if="crustFileStatus?.reported_replica_count">
            {{ crustFileStatus.reported_replica_count }}
          </strong>
          <Spinner v-else :size="16" />
        </div>
      </div>

      <!-- Status -->
      <div class="body-sm mb-6">
        <p class="body-sm mb-1 text-body">{{ $t('storage.status') }}</p>
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
    </div>

    <!-- Actions -->
    <n-grid v-if="fileDetails.CID" :cols="2" :x-gap="32">
      <n-gi>
        <n-button
          class="w-full"
          type="primary"
          size="large"
          @click="download(fileDetails.downloadLink, fileDetails.name)"
        >
          {{ $t('general.download') }}
        </n-button>
      </n-gi>
      <n-gi>
        <n-button class="w-full" type="error" ghost>
          {{ $t('general.delete') }}
        </n-button>
      </n-gi>
    </n-grid>
  </n-space>
  <Spinner v-else />
</template>

<script lang="ts" setup>
const props = defineProps({
  fileCid: { type: String, default: '' },
  fileUuid: { type: String, default: '' },
});

const dataStore = useDataStore();
const fileDetails = ref<FileInterface>({} as FileInterface);
const fileStatus = ref<number>(0);
const crustFileStatus = ref<FileCrust>({} as FileCrust);

onMounted(async () => {
  if (props.fileCid) {
    await getFileDetails(props.fileCid);
    await getcrustFileStatus(props.fileCid);
  } else if (props.fileUuid) {
    await getFileDetails(props.fileUuid);
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
    dataStore.file.items[uuidOrCID] = await dataStore.fetchFileDetails(uuidOrCID);
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
