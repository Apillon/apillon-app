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
        <!-- Refresh -->
        <n-button size="small" :loading="collectionStore.loading" @click="refresh">
          <span class="icon-refresh text-xl mr-2"></span>
          {{ $t('general.refresh') }}
        </n-button>

        <!-- Actions -->
        <n-dropdown
          placement="bottom-end"
          trigger="click"
          :key="collectionStore.active.collectionStatus"
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
const props = defineProps({
  env: { type: Number, default: 0 },
});
const emit = defineEmits(['mint', 'transfer']);

const $i18n = useI18n();
const collectionStore = useCollectionStore();

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
        onClick: () => {},
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
  collectionStore.fetchCollectionTransactions(collectionStore.active.collection_uuid);
}
</script>
