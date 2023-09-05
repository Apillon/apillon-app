<template>
  <n-space class="pb-8" :size="32" vertical>
    <template v-if="collectionStore.hasCsvFile">
      <n-data-table :columns="collectionStore.csvColumns" :data="collectionStore.csvData" />
      <n-space justify="space-between">
        <div>
          <Notification v-if="!nft.isSameNumOfRows.value" type="warning">
            {{ $t('nft.validation.csvMissingData') }}
            ( {{ collectionStore.active?.maxSupply }} )
          </Notification>
          <Notification v-else-if="!nft.hasRequiredMetadata.value" type="error">
            {{ $t('nft.validation.csvRequiredColumns') }}
            {{ nft.metadataRequired.join(',') }}
          </Notification>
        </div>
        <n-space justify="end">
          <n-upload
            :show-file-list="false"
            accept=".csv, application/vnd.ms-excel"
            :custom-request="nft.uploadFileRequest"
          >
            <Btn type="secondary">
              {{ $t('nft.upload.differentFile') }}
            </Btn>
          </n-upload>
          <Btn
            type="primary"
            :disabled="!collectionStore.hasCsvFile || !nft.isCsvValid.value"
            @click="modalMetadataAttributesVisible = true"
          >
            {{ $t('nft.upload.csvConfirm') }}
          </Btn>
        </n-space>
      </n-space>
    </template>
    <n-upload
      v-else
      :show-file-list="false"
      accept=".csv, application/vnd.ms-excel"
      :custom-request="nft.uploadFileRequest"
    >
      <n-upload-dragger style="height: calc(100vh - 420px)">
        <div class="py-2 text-center">
          <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
            <span class="icon-upload text-violet text-2xl"></span>
          </div>

          <h4 class="mb-1">{{ $t('nft.upload.csvFile') }}</h4>
          <span class="text-body">{{ $t('nft.upload.dragAndDrop') }}</span>
        </div>
      </n-upload-dragger>
    </n-upload>
  </n-space>
  <modal v-model:show="modalMetadataAttributesVisible" :title="$t('nft.upload.attributes')">
    <n-space class="pb-8" :size="32" vertical>
      <NftMetadataAttributes />
      <Btn class="float-right" type="primary" :loading="loading" @click="createMetadata">
        {{ $t('nft.upload.csvConfirmAttributes') }}
      </Btn>
    </n-space>
  </modal>
</template>

<script lang="ts" setup>
const loading = ref<boolean>(false);
const collectionStore = useCollectionStore();
const nft = useNft();

/**
 * Attributes
 */
const modalMetadataAttributesVisible = ref<boolean>(false);

onMounted(() => {
  if (!!collectionStore.csvFile?.file && !collectionStore.csvData) {
    nft.parseUploadedFile(collectionStore.csvFile.file);
  }
});

function createMetadata() {
  loading.value = true;
  collectionStore.metadata = nft.createNftData();
  loading.value = false;
  collectionStore.mintTab = NftMintTab.IMAGES;
}
</script>
