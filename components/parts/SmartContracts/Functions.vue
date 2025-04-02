<template>
  <div class="mt-6 flex gap-2">
    <div class="card-light relative w-1/4 min-w-[260px] border-none p-4">
      <div class="ml-2 flex">
        <div class="p-0.4 flex min-w-[158px] justify-center rounded-full bg-bg-lighter">
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
            class="cursor-pointer rounded-md px-2 py-1 hover:bg-bg-dark"
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
      <h3 class="mb-2">{{ selectedFunction }}</h3>

      <n-data-table :bordered="false" :columns="columns" :data="tableData" />
    </div>
  </div>
</template>

<script setup lang="ts">
type Function = {
  name: string;
  type: string;
};
// import VCodeBlock from '@wdns/vue-code-block';

const props = defineProps({
  abi: { type: Array<SmartContractABI>, default: [] },
});
const { t } = useI18n();

const selectedType = ref('write');
const selectedLang = ref('js');
const selectedFunction = ref('');

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

const tableData = ref<Function[]>([]);

const updateTableData = () => {
  const functionDetails = props.abi.find(item => item.type === 'function' && item.name === selectedFunction.value);

  if (functionDetails) {
    tableData.value = functionDetails.inputs.map(input => ({
      name: input.name,
      type: input.type,
    }));
  } else {
    tableData.value = [];
  }
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

const readFunctions = props.abi.filter(
  item => item.type === 'function' && (item.stateMutability === 'view' || item.stateMutability === 'pure')
);

const writeFunctions = props.abi.filter(
  item => item.type === 'function' && (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable')
);

const displayedFunctions = computed(() => (selectedType.value === 'write' ? writeFunctions : readFunctions));

onMounted(() => {
  if (displayedFunctions.value.length) {
    selectedFunction.value = displayedFunctions.value[0].name;
    selectedLang.value = 'react';
  }
  updateTableData();
});
</script>
