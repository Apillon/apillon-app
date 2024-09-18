<template>
  <div class="flex items-center gap-x-2 mb-8">
    <h5>{{ $t('embeddedWallet.codeSnippets') }}</h5>
    <div class="bg-bg-lighter rounded-full p-0.4">
      <n-button
        size="small"
        round
        :class="selectedLanguage === 'app' ? '!bg-bg-dark' : ''"
        @click="select('app')"
      >
        <span class="px-2">App</span>
      </n-button>
      <n-button
        size="small"
        round
        :class="selectedLanguage === 'sdk' ? '!bg-bg-dark' : ''"
        @click="select('sdk')"
      >
        <span class="px-2">SDK</span>
      </n-button>
    </div>
  </div>

  <CodeBlock :code="currentCode" lang="js" theme="github-dark" highlightjs :style="codeSize" />
</template>

<script lang="ts" setup>
import CodeBlock from 'vue3-code-block';

// State to manage the selected code language
const selectedLanguage = ref('app');

const select = (language: string) => {
  selectedLanguage.value = language;
};

// VueJS code block
const codeVue = `
  import { initializeOnWindow, getEmbeddedWallet } from '@embedded-wallet/sdk';

  initializeOnWindow({
    production: true,
    accountManagerAddress: '0x5C3512312312312312312312312312312365D4bC',
    defaultNetworkId: 1287,
    networkConfig: {
      /* Custom network configurations */
    },
    onGetSignature: async (gaslessData) => {
      // Custom signature generation logic
    },
    onGetApillonSessionToken: async () => {
      // Fetch Apillon session token
    },
});
`;

const codeReact = `
  import { initializeApp } from '@embedded-wallet/ui';
  
  initializeApp('#embedded-wallet', {
    disableAutoBroadcastAfterSign: false,
    disableDefaultActivatorStyle: false,
    accountManagerAddress: '0xF35C3eB93c6D3764A7D5efC6e9DEB614779437b1',
    networks: [
      {
        name: 'Moonbeam Testnet',
        id: 1287,
        rpcUrl: 'https://rpc.testnet.moonbeam.network',
        explorerUrl: 'https://moonbase.moonscan.io',
      },
      {
        name: 'Amoy',
        id: 80002,
        rpcUrl: 'https://rpc-amoy.polygon.technology',
        explorerUrl: 'https://www.oklink.com/amoy',
      },
    ],
  });
`;

// Computed property to return the current code based on selected language
const currentCode = computed(() => {
  return selectedLanguage.value === 'app' ? codeReact : codeVue;
});

// Update code size when language changes
const codeSize = computed(() => {
  return { 'min-height': `${22 * currentCode.value.split('\n').length}px` };
});
</script>
