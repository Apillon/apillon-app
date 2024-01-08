<template>
  <n-tabs ref="encryptTabRef" v-model:value="contractStore.encryptTab" type="segment" animated>
    <n-tab-pane :name="EncryptTab.BUCKET">
      <template #tab>
        <IconNumber
          v-if="contractStore.encryptTab === EncryptTab.BUCKET"
          :number="1"
          :active="true"
        />
        <IconSuccessful v-else />
        <span class="ml-2">Select bucket</span>
      </template>
      <slot>
        <FormComputingBucket @submit-success="onBucketSelected" />
      </slot>
    </n-tab-pane>
    <n-tab-pane :name="EncryptTab.UPLOAD" :disabled="false">
      <template #tab>
        <IconSuccessful v-if="contractStore.encryptTab === EncryptTab.ENCRYPT" />
        <IconNumber v-else :number="2" :active="contractStore.encryptTab === EncryptTab.UPLOAD" />
        <span class="ml-2">Upload file</span>
      </template>
      <slot>
        <FormComputingUpload
          class="max-w-xl mx-auto my-8"
          :contract-uuid="contractStore.active.contract_uuid"
          @submit-success="onFileUploaded"
        />
      </slot>
    </n-tab-pane>
    <n-tab-pane :name="EncryptTab.ENCRYPT" :disabled="false">
      <template #tab>
        <IconNumber :number="3" :active="contractStore.encryptTab === EncryptTab.ENCRYPT" />
        <span class="ml-2">Encrypt</span>
      </template>
      <slot>
        <FormComputingAssignCID
          class="max-w-xl mx-auto my-8"
          :contract-uuid="contractStore.active.contract_uuid"
        />
      </slot>
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts" setup>
import type { TabsInst } from 'naive-ui';

const contractStore = useContractStore();

const encryptTabRef = ref<TabsInst | null>(null);

/** Watch active tab, if information are missing, open previous tab */
watch(
  () => contractStore.encryptTab,
  tab => {
    console.log(tab);
    if (tab === EncryptTab.UPLOAD && !contractStore.bucketUuid) {
      contractStore.encryptTab = EncryptTab.BUCKET;
      nextTick(() => encryptTabRef.value?.syncBarPosition());
    } else if (tab === EncryptTab.ENCRYPT && contractStore.cid) {
      contractStore.encryptTab = EncryptTab.UPLOAD;
      nextTick(() => encryptTabRef.value?.syncBarPosition());
    }
  }
);

function onBucketSelected(bucketUuid: string) {
  contractStore.bucketUuid = bucketUuid;
  contractStore.encryptTab = EncryptTab.UPLOAD;
}

function onFileUploaded(encryptedContent: string) {
  //TODO: upload encryptedContent in bucket
  contractStore.encryptTab = EncryptTab.ENCRYPT;
}
</script>
