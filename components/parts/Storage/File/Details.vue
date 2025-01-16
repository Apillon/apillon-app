<template>
  <n-space v-if="fileDetails.file_uuid" class="h-full" justify="space-between" vertical>
    <div>
      <!-- UUID -->
      <div v-if="file.uuid" class="body-sm mb-4">
        <p class="body-sm">
          <span class="text-body">{{ $t('general.uuid') }}</span>
        </p>
        <div>
          <strong>{{ file.uuid }}</strong>
        </div>
        <button class="btn-small text-primary" @click="copyToClipboard(file.uuid)">
          <strong>{{ $t('dashboard.clipboard.copyUuid') }}</strong>
        </button>
      </div>

      <!-- CID -->
      <div v-if="file?.CID" class="body-sm mb-4">
        <p class="body-sm">
          <span class="text-body">{{ $t('storage.fileCid') }}</span>
        </p>
        <div>
          <strong>{{ file.CID }}</strong>
        </div>
        <button class="btn-small text-primary" @click="copyToClipboard(file.CID)">
          <strong>{{ $t('dashboard.clipboard.copyCid') }}</strong>
        </button>
      </div>

      <!-- CID -->
      <div v-if="file?.CIDv1" class="body-sm mb-4">
        <p class="body-sm">
          <span class="text-body">CIDv1</span>
        </p>
        <div>
          <strong>{{ file.CIDv1 }}</strong>
        </div>
        <button class="btn-small text-primary" @click="copyToClipboard(file.CIDv1)">
          <strong>{{ $t('dashboard.clipboard.copyCid') }}v1</strong>
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
        <button class="btn-small text-primary" @click="copyToClipboard(file.link)">
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
          <strong v-if="crustFileDetails?.expired_at">
            {{
              fileExpiration(
                parseInt(crustFileDetails.calculated_at),
                parseInt(crustFileDetails.expired_at),
                file.updateTime,
                currentBlockId
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
          <strong v-if="crustFileDetails?.reported_replica_count">
            {{ crustFileDetails.reported_replica_count }}
          </strong>
          <Spinner v-else :size="16" />
        </div>
      </div>

      <!-- Status -->
      <div class="body-sm mb-6">
        <p class="body-sm mb-1 text-body">{{ $t('storage.status') }}</p>
        <div class="uppercase">
          <StorageFileStatus :file-status="fileDetails.fileStatus" />
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
  file: { type: Object as PropType<BucketItemInterface>, required: true },
});
const emit = defineEmits(['onFileDelete']);

const fileStore = useFileStore();
const fileDetails = ref<FileInterface>({} as FileInterface);
const crustFileDetails = ref<FileCrust>({} as FileCrust);
const currentBlockId = ref<number>(0);

onMounted(async () => {
  await getFileDetails(props.file?.CID || props.file.uuid);
  if (props.file.CID) {
    currentBlockId.value = await fileStore.getCurrentBlockFromCrust();
    await getCrustFileDetails(props.file.CID);
  }
});
onDeactivated(() => {
  fileDetails.value = {} as FileInterface;
  crustFileDetails.value = {} as FileCrust;
});

/** Get File details */
async function getFileDetails(uuidOrCID?: string) {
  if (!uuidOrCID) {
    return;
  }
  if (!(uuidOrCID in fileStore.items)) {
    fileStore.items[uuidOrCID] = await fileStore.fetchFileDetails(uuidOrCID);
  }
  fileDetails.value = fileStore.items[uuidOrCID];
}

/** Get File details from CRUST */
async function getCrustFileDetails(cid: string) {
  if (!(cid in fileStore.crust)) {
    try {
      fileStore.crust[cid] = await fileStore.fetchFileDetailsFromCrust(cid);
    } catch (e) {
      console.error(e);
    }
  }
  crustFileDetails.value = fileStore.crust[cid] as FileCrust;
}
</script>
