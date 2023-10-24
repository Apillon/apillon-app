<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.nav.computing') }}</h1>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <IconInfo v-if="$i18n.te('w3Warn.computing.new')" @click="showModalW3Warn = true" />
          </n-space>
        </template>
      </Heading>
    </template>
    <slot>
      <TableComputingContract v-if="contractStore.hasContracts" :contracts="contractStore.items" />
      <Empty
        v-else
        :title="$t('computing.contract.empty')"
        :info="$t('computing.contract.emptyInfo')"
        icon="computing/illustration"
      >
        <Btn type="primary" @click="modalCreateContractVisible = true">
          {{ $t('computing.contract.createFirst') }}
        </Btn>
      </Empty>

      <W3Warn v-model:show="showModalW3Warn">
        {{ $t('w3Warn.computing.new') }}
      </W3Warn>

      <!-- Modal - Create Contract -->
      <modal v-model:show="modalCreateContractVisible" :title="$t('computing.contract.new')">
        <FormComputingContract />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const contractStore = useContractStore();
const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);
const modalCreateContractVisible = ref<boolean>(false);

useHead({
  title: $i18n.t('dashboard.nav.computing'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await contractStore.getContracts();

      pageLoading.value = false;
    });
  }, 100);
});

/** Watch showModalW3Warn, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      localStorage.setItem(LsW3WarnKeys.NFT_NEW, Date.now().toString());
    }
  }
);
</script>
