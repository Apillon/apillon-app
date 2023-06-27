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
        <!-- Open Bucket -->
        <n-button
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
const emit = defineEmits(['mint', 'revoke', 'transfer']);

const $i18n = useI18n();
const router = useRouter();
const bucketStore = useBucketStore();
const collectionStore = useCollectionStore();
const loadingBucket = ref<boolean>(false);

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
      label: $i18n.t('nft.collection.revoke'),
      key: 'revoke',
      disabled: actionsDisabled.value,
      props: {
        onClick: () => {
          if (!actionsDisabled.value) {
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

async function openBucket(bucketUuid: string) {
  if (!bucketUuid) {
    return;
  }
  loadingBucket.value = true;

  const bucket = await bucketStore.fetchBucket(bucketUuid);
  loadingBucket.value = false;

  if (bucket && bucket.id) {
    router.push(`/dashboard/service/storage/${bucket.id}`);
  }
}
</script>
