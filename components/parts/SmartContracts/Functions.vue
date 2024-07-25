<template>
  <div class="flex gap-2 mt-6">
    <div class="relative card-light border-none p-4 w-1/4 min-w-[260px]">
      <div class="flex ml-2">
        <div class="bg-bg-lighter rounded-full p-0.4 flex justify-center min-w-[158px]">
          <n-button
            size="small"
            round
            :class="selectedType === 'write' ? '!bg-bg-dark' : ''"
            @click="selectType('write')"
          >
            <span class="px-2">Write</span>
          </n-button>
          <n-button
            size="small"
            round
            :class="selectedType === 'read' ? '!bg-bg-dark' : ''"
            @click="selectType('read')"
          >
            <span class="px-2">Read</span>
          </n-button>
        </div>
      </div>
      <div class="mt-6">
        <n-scrollbar y-scrollable style="max-height: 600px">
          <div
            v-for="f in displayedFunctions"
            :key="f.name"
            class="cursor-pointer hover:bg-bg-dark py-1 px-2 rounded-md"
            @click="selectFunction(f.name)"
          >
            <div :class="selectedFunction === f.name ? 'text-yellow' : ''">
              {{ f.name }}
            </div>
          </div>
        </n-scrollbar>
      </div>
    </div>
    <div class="w-3/4 p-4">
      <h3>{{ selectedFunction }}</h3>

      <n-data-table :bordered="false" :columns="columns" :data="tableData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
const selectedType = ref('write');
const selectedFunction = ref('');

const smartContractsStore = useSmartContractsStore();

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
  const contractDetails = smartContractsStore.getContractDetails.contractVersion.abi;
  const functionDetails = contractDetails.find(
    item => item.type === 'function' && item.name === selectedFunction.value
  );

  if (functionDetails) {
    tableData.value = functionDetails.inputs.map(input => ({
      name: input.name,
      type: input.type,
    }));
  } else {
    tableData.value = [];
  }

  console.log(tableData.value);
};

// end table

const selectType = (type: string) => {
  selectedType.value = type;
  selectedFunction.value = displayedFunctions.value.length ? displayedFunctions.value[0].name : ''; // Reset the selected function when type changes
};

const selectFunction = (name: string) => {
  selectedFunction.value = name;
  updateTableData();
};

const readFunctions = smartContractsStore.getContractDetails.contractVersion.abi.filter(
  item =>
    item.type === 'function' && (item.stateMutability === 'view' || item.stateMutability === 'pure')
);

const writeFunctions = smartContractsStore.getContractDetails.contractVersion.abi.filter(
  item =>
    item.type === 'function' &&
    (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable')
);

const displayedFunctions = computed(() =>
  selectedType.value === 'write' ? writeFunctions : readFunctions
);

onMounted(() => {
  if (displayedFunctions.value.length) {
    selectedFunction.value = displayedFunctions.value[0].name;
  }
  updateTableData();
});
</script>
