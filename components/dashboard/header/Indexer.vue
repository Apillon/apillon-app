<template>
  <Heading>
    <slot v-if="!indexerUuid">
      <NuxtLink class="flex items-center gap-x-2" :to="link">
        <span class="icon-back text-2xl align-sub"></span>
        <h1>{{ $t('dashboard.nav.indexing') }}</h1>
      </NuxtLink>
    </slot>
    <slot v-else>
      <n-space align="center" size="large" :wrap="false">
        <NuxtLink :to="{ name: 'dashboard-service-indexing' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <div>
          <h2>{{ indexerStore.active.name }}</h2>
          <TableEllipsis :prefix="$t('indexer.uuid')" :text="indexerStore.active.indexer_uuid" />
        </div>
      </n-space>
    </slot>
    <template #info>
      <n-space v-if="indexerUuid && indexerStore.active" size="large">
        <n-button size="small" @click="showModalEditIndexer = true">
          <span class="icon-edit text-xl text-primary mr-2"></span>
          <span class="text-primary">{{ $t('indexer.update') }}</span>
        </n-button>

        <!-- View documentation -->
        <Btn
          type="secondary"
          size="small"
          inner-class="text-white flex items-center justify-center"
          href="https://wiki.apillon.io/build/12-embedded-wallets-integration.html"
        >
          <span class="icon-file text-xl mr-2"></span>
          {{ $t('embeddedWallet.viewDocumentation') }}
        </Btn>

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
    </template>

    <template #submenu>
      <MenuIndexer v-if="indexerStore.active" />
    </template>

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
  </Heading>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const authStore = useAuthStore();
const indexerStore = useIndexerStore();
const { initIndexer } = useIndexer();

const showModalEditIndexer = ref<boolean | null>(false);
const showModalHibernateIndexer = ref<boolean | null>(false);

defineProps({
  link: { type: String, default: '/dashboard/service/indexing' },
  indexerUuid: { type: String, default: '' },
});

const options = computed(() => {
  return [
    {
      label: t('indexer.hibernate'),
      key: 'mint',
      disabled: indexerStore.active.status !== IndexerStatuses.ACTIVE,
      props: {
        onClick: () => {
          showModalHibernateIndexer.value = true;
        },
      },
    },
  ];
});

function handleIndexerHibernation() {
  showModalHibernateIndexer.value = false;
  initIndexer();
}
</script>
