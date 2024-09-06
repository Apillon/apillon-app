<template>
  <div class="flex gap-2 mt-6 mb-6">
    <div class="relative card-light border-none p-4 w-1/4 min-w-[260px]">
      <div class="mt-6">
        <n-scrollbar y-scrollable style="max-height: 600px">
          <div
            v-for="f in readEvents"
            :key="f.name"
            class="cursor-pointer hover:bg-bg-dark py-1 px-2 rounded-md"
            @click="selectEvent(f.name)"
          >
            <div :class="selectedEvent === f.name ? 'text-yellow' : ''">
              {{ f.name }}
            </div>
          </div>
        </n-scrollbar>
      </div>
    </div>
    <div class="w-3/4 px-4">
      <h3>{{ selectedEvent }}</h3>

      <n-data-table :bordered="false" :columns="columns" :data="tableData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const selectedEvent = ref('');

const smartContractStore = useSmartContractStore();
const deployedContractStore = useDeployedContractStore();

// table
const { t } = useI18n();

const createColumns = (): NDataTableColumns<ApiKeyInterface> => {
  return [
    {
      title: 'type',
      key: 'type',
    },
    {
      title: t('dashboard.name'),
      key: 'name',
    },
  ];
};
const columns = createColumns();

const tableData = ref([]);

const updateTableData = () => {
  const contractDetails = deployedContractStore.active.contractVersion.abi;
  const eventDetails = contractDetails.find(
    item => item.type === 'event' && item.name === selectedEvent.value
  );

  if (eventDetails) {
    tableData.value = eventDetails.inputs.map(input => ({
      name: input.name,
      type: input.type,
    }));
  } else {
    tableData.value = [];
  }

  console.log(tableData.value);
};
// end table

const selectEvent = (name: string) => {
  selectedEvent.value = name;
  updateTableData();
};

const readEvents = deployedContractStore.active.contractVersion.abi.filter(
  item => item.type === 'event'
);

onMounted(() => {
  selectedEvent.value = readEvents.length ? readEvents[0].name : '';
  updateTableData();
});
</script>
