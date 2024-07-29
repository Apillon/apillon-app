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

      <div class="mt-6">
        <h3>Use this function in your app</h3>

        <div class="bg-bg-lighter rounded-full p-0.4 inline-block mt-6 mb-6">
          <n-button
            size="small"
            round
            :class="selectedLang === 'react' ? '!bg-bg-dark' : ''"
            @click="selectLang('react')"
          >
            <span class="px-2">React</span>
          </n-button>
          <n-button
            size="small"
            round
            :class="selectedLang === 'vue' ? '!bg-bg-dark' : ''"
            @click="selectLang('vue')"
          >
            <span class="px-2">Vue</span>
          </n-button>
          <n-button
            size="small"
            round
            :class="selectedLang === 'react-native' ? '!bg-bg-dark' : ''"
            @click="selectLang('react-native')"
          >
            <span class="px-2">React Native</span>
          </n-button>
        </div>
        <CodeBlock
          :code="currentCode"
          :style="codeSize"
          lang="js"
          theme="github-dark"
          highlightjs
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CodeBlock from 'vue3-code-block';

const selectedType = ref('write');
const selectedLang = ref('js');
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
};

// end table

const selectType = (type: string) => {
  selectedType.value = type;
  selectedFunction.value = displayedFunctions.value.length ? displayedFunctions.value[0].name : ''; // Reset the selected function when type changes
};

const selectLang = (type: string) => {
  selectedLang.value = type;
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
    selectedLang.value = 'react';
  }
  updateTableData();
});

// codde stuff
// VueJS code block
const codeVue = computed(() => {
  return `// 1. Installation
  yarn add @subsocial/grill-widget
  
  // 2. Add the div HTML tag with an id of grill to your app.
  <div id="grill"></div>
  
`;
});

// React code block
const codeReact = computed(() => {
  return `// 1. Installation react
  yarn add @subsocial/grill-widget react
  
  // 2. Add the div HTML tag with an id of grill to your app.
  <div id="grill"></div>

`;
});

// React native code block
const codeReactNative = computed(() => {
  return `// 1. Installation react
  yarn add @subsocial/grill-widget react
  
  // 2. Add the div HTML tag with an id of grill to your app.
  <div id="grill"></div>

`;
});

// Computed property to return the current code based on selected language
const currentCode = computed(() => {
  switch (selectedLang.value) {
    case 'react':
      return codeReact.value;
    case 'vue':
      return codeVue.value;
    case 'react-native':
      return codeReactNative.value;
    default:
      return codeReact.value;
  }
});

// Update code size when language changes
const codeSize = computed(() => {
  return { 'min-height': `${22 * currentCode.value.split('\n').length}px` };
});
</script>
