<template>
  <n-tabs
    ref="encryptTabRef"
    v-model:value="contractStore.encryptTab"
    class="types-hidden"
    animated
  >
    <n-tab-pane :name="EncryptTab.BUCKET">
      <template #tab>
        <IconNumber
          v-if="contractStore.encryptTab === EncryptTab.BUCKET"
          :number="1"
          :active="true"
        />
        <IconSuccessful v-else />
        <span class="ml-2">{{ $t('computing.contract.encrypt.step1') }}</span>
      </template>
      <slot>
        <FormComputingBucket @submit-success="onBucketSelected" />
      </slot>
    </n-tab-pane>
    <n-tab-pane :name="EncryptTab.ASSIGN" :disabled="!contractStore.bucketUuid">
      <template #tab>
        <IconSuccessful v-if="contractStore.encryptTab === EncryptTab.FINISHED" />
        <IconNumber v-else :number="2" :active="contractStore.encryptTab === EncryptTab.ASSIGN" />
        <span class="ml-2">{{ $t('computing.contract.encrypt.step2') }}</span>
      </template>
      <slot>
        <FormComputingAssignCID
          class="max-w-xl mx-auto my-8"
          :contract-uuid="contractStore.active.contract_uuid"
          @submit-success="onCidAssigned"
        />
      </slot>
    </n-tab-pane>
    <n-tab-pane :name="EncryptTab.FINISHED" :disabled="!contractStore.bucketUuid">
      <template #tab>
        <IconNumber :number="3" :active="contractStore.encryptTab === EncryptTab.FINISHED" />
        <span class="ml-2">{{ $t('computing.contract.encrypt.step3') }}</span>
      </template>
      <slot>
        <div class="max-w-md mx-auto my-8 text-center">
          <h4 class="mb-2">{{ $t('computing.contract.encrypt.step3') }}</h4>
          <p class="mb-4">{{ $t('computing.contract.encrypt.step3Info') }}</p>
          <Btn type="secondary" @click="goToFirstStep()">
            {{ $t('computing.contract.encrypt.step3Btn') }}
          </Btn>
        </div>
      </slot>
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts" setup>
import type { TabsInst } from 'naive-ui';

const contractStore = useContractStore();
const transactionStore = useComputingTransactionStore();
const { checkUnfinishedTransactions } = useComputing();

const encryptTabRef = ref<TabsInst | null>(null);

onMounted(() => {
  goToFirstStep();
});

/** Watch active tab, if information are missing, open previous tab */
watch(
  () => contractStore.encryptTab,
  tab => {
    if (tab === EncryptTab.ASSIGN && !contractStore.bucketUuid) {
      contractStore.encryptTab = EncryptTab.BUCKET;
      nextTick(() => encryptTabRef.value?.syncBarPosition());
    } else if (tab >= EncryptTab.ASSIGN) {
      contractStore.encryptTab = EncryptTab.ASSIGN;
      nextTick(() => encryptTabRef.value?.syncBarPosition());
    }
  }
);

function goToFirstStep() {
  if (contractStore.active.bucket_uuid) {
    contractStore.bucketUuid = contractStore.active.bucket_uuid;
    contractStore.encryptTab = EncryptTab.ASSIGN;
  } else {
    contractStore.encryptTab = EncryptTab.BUCKET;
  }
}

function onBucketSelected(bucketUuid: string) {
  contractStore.bucketUuid = bucketUuid;
  contractStore.encryptTab = EncryptTab.ASSIGN;
}

async function onCidAssigned() {
  contractStore.encryptTab = EncryptTab.FINISHED;

  await transactionStore.fetchTransactions(
    contractStore.active.contract_uuid,
    { page: transactionStore.pagination.page },
    false
  );
  checkUnfinishedTransactions();
}
</script>
