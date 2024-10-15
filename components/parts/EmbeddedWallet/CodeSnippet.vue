<template>
  <div class="flex items-center gap-x-2 mb-8">
    <h5>{{ $t('embeddedWallet.codeSnippets') }}</h5>
    <div class="bg-bg-lighter rounded-full p-0.4">
      <n-button
        size="small"
        round
        :class="selectedLanguage === CodeFramework.VUE ? '!bg-bg-dark' : ''"
        @click="select(CodeFramework.VUE)"
      >
        <span class="px-2">Vue</span>
      </n-button>
      <n-button
        size="small"
        round
        :class="selectedLanguage === CodeFramework.REACT ? '!bg-bg-dark' : ''"
        @click="select(CodeFramework.REACT)"
      >
        <span class="px-2">React</span>
      </n-button>
    </div>
  </div>

  <CodeBlock :code="currentCode" lang="js" theme="github-dark" highlightjs :style="codeSize" />
</template>

<script lang="ts" setup>
enum CodeFramework {
  VUE = 'vue',
  REACT = 'react',
}

import CodeBlock from 'vue3-code-block';

const embeddedWalletStore = useEmbeddedWalletStore();

// State to manage the selected code language
const selectedLanguage = ref('vue');

const select = (language: string) => {
  selectedLanguage.value = language;
};

// VueJS code block
const codeVue = `
import { WalletWidget } from '@apillon/wallet-vue';

<WalletWidget
  :clientId="${embeddedWalletStore.active.integration_uuid}"
  :defaultNetworkId="1287"
  :networks="[
    {
      name: 'Moonbeam Testnet',
      id: 1287,
      rpcUrl: 'https://rpc.testnet.moonbeam.network',
      explorerUrl: 'https://moonbase.moonscan.io',
    },
    {
      name: 'Celo Alfajores Testnet',
      id: 44787,
      rpcUrl: 'https://alfajores-forno.celo-testnet.org',
      explorerUrl: 'https://explorer.celo.org/alfajores',
    },
    {
      name: 'Amoy',
      id: 80002,
      rpcUrl: 'https://rpc-amoy.polygon.technology',
      explorerUrl: 'https://www.oklink.com/amoy',
    },
  ]"
/>
`;

const codeReact = `
import { WalletWidget } from '@apillon/wallet-react';
  
<WalletWidget
  clientId={${embeddedWalletStore.active.integration_uuid}}
  defaultNetworkId={1287}
  networks={[
    {
      name: 'Moonbeam Testnet',
      id: 1287,
      rpcUrl: 'https://rpc.testnet.moonbeam.network',
      explorerUrl: 'https://moonbase.moonscan.io',
    },
    {
      name: 'Celo Alfajores Testnet',
      id: 44787,
      rpcUrl: 'https://alfajores-forno.celo-testnet.org',
      explorerUrl: 'https://explorer.celo.org/alfajores',
    },
    {
      name: 'Amoy',
      id: 80002,
      rpcUrl: 'https://rpc-amoy.polygon.technology',
      explorerUrl: 'https://www.oklink.com/amoy',
    },
  ]}
/>
`;

// Computed property to return the current code based on selected language
const currentCode = computed(() => {
  return selectedLanguage.value === CodeFramework.REACT ? codeReact : codeVue;
});

// Update code size when language changes
const codeSize = computed(() => {
  return { 'min-height': `${22 * currentCode.value.split('\n').length}px` };
});
</script>
