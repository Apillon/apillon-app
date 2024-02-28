<template>
  <div>
    <n-space v-bind="$attrs" justify="space-between">
      <div class="w-[20vw] max-w-xs">
        <n-input
          v-model:value="collectionStore.search"
          type="text"
          name="search"
          size="small"
          :placeholder="$t('general.search')"
          clearable
        >
          <template #prefix>
            <span class="icon-search text-2xl"></span>
          </template>
        </n-input>
      </div>

      <n-space size="large">
        <!-- Modal Price list for Hosting -->
        <ModalCreditCosts
          :service="ServiceTypeName.NFT"
          :chain="collectionStore.active.chain"
          filter-by-chain
        />

        <!-- Open Bucket -->
        <n-button
          v-if="collectionStore.active.bucket_uuid"
          size="small"
          :loading="loadingBucket"
          @click="openBucket(collectionStore.active.bucket_uuid)"
        >
          <span class="icon-storage text-xl mr-2"></span>
          <span>{{ $t('nft.openBucket') }}</span>
        </n-button>

        <!-- Refresh -->
        <n-button size="small" :loading="collectionStore.loading" @click="refresh">
          <span class="icon-refresh text-xl mr-2"></span>
          {{ $t('general.refresh') }}
        </n-button>

        <!-- Actions -->
        <n-dropdown
          :key="collectionStore.active.collectionStatus"
          placement="bottom-end"
          trigger="click"
          :options="options"
          :disabled="authStore.isAdmin()"
        >
          <n-button size="small">
            <span class="text-primary">{{ $t('general.actions') }}</span>
            <div class="hidden md:flex items-center relative left-1">
              <span class="icon-down text-2xl text-primary"></span>
            </div>
          </n-button>
        </n-dropdown>
      </n-space>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  env: { type: Number, default: 0 },
});
const emit = defineEmits(['mint', 'nestMint', 'revoke', 'transfer']);

const $i18n = useI18n();
const authStore = useAuthStore();
const collectionStore = useCollectionStore();
const { loadingBucket, openBucket } = useStorage();

const actionsDisabled = computed<boolean>(() => {
  return collectionStore.active?.collectionStatus !== CollectionStatus.DEPLOYED;
});

const options = computed(() => {
  return [
    {
      label: $i18n.t('nft.collection.mint'),
      key: 'mint',
      disabled: actionsDisabled.value,
      props: {
        onClick: () => {
          if (!actionsDisabled.value) {
            emit('mint');
          }
        },
      },
    },
    {
      label: $i18n.t('nft.collection.nestMint'),
      key: 'nestMint',
      show: collectionStore.active?.collectionType === NFTCollectionType.NESTABLE,
      disabled: actionsDisabled.value,
      props: {
        onClick: () => {
          if (!actionsDisabled.value) {
            emit('nestMint');
          }
        },
      },
    },
    {
      label: $i18n.t('nft.collection.revoke'),
      key: 'revoke',
      disabled: actionsDisabled.value || !collectionStore.active?.isRevokable,
      props: {
        onClick: () => {
          if (!actionsDisabled.value && !!collectionStore.active?.isRevokable) {
            emit('revoke');
          }
        },
      },
    },
    {
      label: $i18n.t('nft.collection.transfer'),
      key: 'transfer',
      disabled: actionsDisabled.value,
      props: {
        onClick: () => {
          if (!actionsDisabled.value) {
            emit('transfer');
          }
        },
      },
    },
  ];
});

async function refresh() {
  await collectionStore.fetchCollectionTransactions(collectionStore.active.collection_uuid);
}
</script>
