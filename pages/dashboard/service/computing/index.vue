<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.nav.computing') }}</h1>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <IconInfo v-if="$i18n.te('w3Warn.computing.new')" @click="modalW3WarnVisible = true" />
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
        icon="storage/empty"
      >
        <Btn type="primary" @click="showModalCreateContract()">
          {{ $t('computing.contract.createFirst') }}
        </Btn>
      </Empty>

      <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnHide">
        {{ $t('w3Warn.contract.new') }}
      </W3Warn>

      <!-- Modal - Create Contract -->
      <modal v-model:show="modalCreateContractVisible" :title="$t('computing.contract.new')">
        <FormComputingContract
          @submit-success="modalCreateContractVisible = false"
          @create-success="onContractCreated"
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const contractStore = useContractStore();
const { onContractCreated } = useComputing();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.CONTRACT_NEW);

const pageLoading = ref<boolean>(true);
const modalCreateContractVisible = ref<boolean | null>(false);

useHead({
  title: $i18n.t('dashboard.nav.computing'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await contractStore.getContracts();

      setTimeout(() => {
        checkUnfinishedContracts();
      }, 3000);

      pageLoading.value = false;
    });
  }, 100);
});

function showModalCreateContract() {
  if (localStorage.getItem(LsW3WarnKeys.CONTRACT_NEW) || !$i18n.te('w3Warn.contract.new')) {
    modalCreateContractVisible.value = true;
  } else {
    modalW3WarnVisible.value = true;
    modalCreateContractVisible.value = null;
  }
}

/** When user close W3Warn, allow him to create new bucket */
function onModalW3WarnHide() {
  if (modalCreateContractVisible.value !== false) {
    modalCreateContractVisible.value = true;
  }
}
</script>
