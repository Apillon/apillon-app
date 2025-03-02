<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs"></div>

    <n-space v-if="indexerStore.active" size="large">
      <BtnDocumentation
        size="small"
        href="https://wiki.apillon.io/web3-services/10-web3-infrastructure.html#indexing-service"
        hover-lighter
      />

      <n-button size="small" :loading="indexerStore.loading" @click="initIndexer">
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <n-button size="small" @click="showModalEditIndexer = true">
        <span class="icon-edit text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('indexer.update') }}</span>
      </n-button>

      <!-- Actions -->
      <n-dropdown
        :key="indexerStore.active.indexer_uuid"
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
  <!-- Modal - Create Indexer -->
  <IndexerSpendingWarning v-model:show="showModalNewIndexer">
    <FormIndexer />
  </IndexerSpendingWarning>
  <!-- Modal - Update Indexer -->
  <modal v-model:show="showModalEditIndexer" :title="$t('indexer.update')">
    <FormIndexer
      :indexer-uuid="indexerStore.active.indexer_uuid"
      @submit-success="showModalEditIndexer = false"
    />
  </modal>
  <!-- Modal - Hibernate Indexer -->
  <modal v-model:show="showModalHibernateIndexer" :title="$t('indexer.hibernate')">
    <FormIndexerHibernate
      :indexer-uuid="indexerStore.active.indexer_uuid"
      @submit-success="handleIndexerHibernation()"
    />
  </modal>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const authStore = useAuthStore();
const indexerStore = useIndexerStore();
const { initIndexer } = useIndexer();

const showModalNewIndexer = ref<boolean | null>(false);
const showModalEditIndexer = ref<boolean | null>(false);
const showModalHibernateIndexer = ref<boolean | null>(false);

const isActive = computed(() => indexerStore.active.status === IndexerStatuses.ACTIVE);

function handleIndexerHibernation() {
  showModalHibernateIndexer.value = false;
  initIndexer();
}

const options = computed(() => {
  return [
    {
      label: t('indexer.hibernate'),
      key: 'mint',
      disabled: !isActive.value,
      props: {
        onClick: () => {
          if (isActive.value) {
            showModalHibernateIndexer.value = true;
          }
        },
      },
    },
  ];
});
</script>
