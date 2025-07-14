<template>
  <div class="mb-6 mt-6 flex gap-2">
    <div class="card-light relative w-1/4 min-w-[260px] border-none p-4">
      <div class="mt-6">
        <n-scrollbar y-scrollable style="max-height: 600px">
          <div
            v-for="f in readEvents"
            :key="f.name"
            class="cursor-pointer rounded-md px-2 py-1 hover:bg-bg-dark"
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
type Function = {
  name: string;
  type: string;
};

const props = defineProps({
  abi: { type: Array<SmartContractABI>, default: [] },
});
const { t } = useI18n();

const tableData = ref<Array<Function[]>>([]);
const selectedEvent = ref('');

const readEvents = props.abi.filter(item => item.type === 'event');

const createColumns = (): NDataTableColumns<Function> => {
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

const updateTableData = () => {
  const contractDetails = props.abi;
  const eventDetails = contractDetails.find(item => item.type === 'event' && item.name === selectedEvent.value);

  if (eventDetails) {
    tableData.value =
      eventDetails.inputs.map(input => ({
        name: input.name,
        type: input.type,
      })) || [];
  } else {
    tableData.value = [];
  }
};

const selectEvent = (name: string) => {
  selectedEvent.value = name;
  updateTableData();
};

onMounted(() => {
  selectedEvent.value = readEvents.length ? readEvents[0].name : '';
  updateTableData();
});
</script>
