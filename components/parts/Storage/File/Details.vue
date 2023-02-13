<template>
  <n-space v-if="fileDetails.file_uuid" class="h-full" justify="space-between" vertical>
    <div>
      <!-- CID -->
      <div v-if="file?.CID" class="body-sm mb-4">
        <p class="body-sm">
          <span class="text-body">{{ $t('storage.fileCid') }}</span>
        </p>
        <div>
          <strong>{{ file.CID }}</strong>
        </div>
        <button class="text-primary btn-small" @click="copyToClipboard(file.CID)">
          <strong>{{ $t('dashboard.clipboard.copyCid') }}</strong>
        </button>
      </div>

      <!-- Link -->
      <div v-if="file.link" class="body-sm mb-4">
        <p class="body-sm">
          <span class="text-body">{{ $t('storage.file.downloadLink') }}</span>
        </p>
        <div>
          <a :href="file.link" target="_blank">
            <strong>{{ file.link }}</strong>
          </a>
        </div>
        <button class="text-primary btn-small" @click="copyToClipboard(file.link)">
          <strong>{{ $t('dashboard.clipboard.copyLink') }}</strong>
        </button>
      </div>

      <!-- Size -->
      <div class="body-sm mb-4">
        <p class="body-sm text-body">{{ $t('storage.fileSize') }}</p>
        <strong>{{ formatBytes(file.size || 0) }}</strong>
      </div>

      <!-- Expiration -->
      <div v-if="file?.CID" class="body-sm mb-4">
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
      <div v-if="file?.CID" class="body-sm mb-4">
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
        <div class="uppercase">
          <n-tag
            v-if="fileStatus === FileStatus.PINNED_TO_CRUST"
            type="success"
            size="tiny"
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
            size="tiny"
            :bordered="false"
            round
          >
            <span class="text-bg-dark">{{ $t(`storage.fileStatus.${fileStatus}`) }}</span>
          </n-tag>
          <n-tag v-else type="error" size="tiny" :bordered="false" round>
            {{ $t(`storage.fileStatus.${fileStatus}`) }}
          </n-tag>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <n-grid v-if="file?.CID" :cols="2" :x-gap="32">
      <n-gi>
        <Btn type="primary" size="large" @click="download(file.link, file.name)">
          {{ $t('general.download') }}
        </Btn>
      </n-gi>
      <n-gi>
        <Btn type="error" size="large" @click="emit('onFileDelete')">
          {{ $t('general.delete') }}
        </Btn>
      </n-gi>
    </n-grid>
  </n-space>
  <Spinner v-else />
</template>

<script lang="ts" setup>
const props = defineProps({
  file: { type: Object, required: true },
});
const emit = defineEmits(['onFileDelete']);

const fileStore = useFileStore();
const fileDetails = ref<FileInterface>({} as FileInterface);
const fileStatus = ref<number>(0);
const crustFileStatus = ref<FileCrust>({} as FileCrust);

onMounted(async () => {
  await getFileDetails(props.file?.CID || props.file.file_uuid);
  if (props.file.CID) {
    await getcrustFileStatus(props.file.CID);
  }
});
onDeactivated(() => {
  fileDetails.value = {} as FileInterface;
  fileStatus.value = 0;
  crustFileStatus.value = {} as FileCrust;
});

/** Get File details */
async function getFileDetails(uuidOrCID: string) {
  if (!(uuidOrCID in fileStore.items)) {
    fileStore.items[uuidOrCID] = await fileStore.fetchFileDetails(uuidOrCID);
  }
  fileDetails.value = fileStore.items[uuidOrCID].file;
  fileStatus.value = fileDetails.value?.fileStatus || fileStore.items[uuidOrCID].fileStatus;
}

/** Get File details from CRUST */
async function getcrustFileStatus(cid: string) {
  if (!(cid in fileStore.crust)) {
    fileStore.crust[cid] = await fileStore.fetchFileDetailsFromCrust(cid);
  }
  crustFileStatus.value = fileStore.crust[cid] as FileCrust;
}
</script>
