<template>
  <div class="mb-8 flex items-center gap-x-2">
    <h5>{{ $t('embeddedWallet.codeSnippets') }}</h5>
    <div class="p-0.4 rounded-full bg-bg-lighter">
      <n-button
        round
        :class="selectedLanguage === CodeFramework.REACT ? '!bg-bg-dark' : ''"
        @click="select(CodeFramework.REACT)"
      >
        <span class="px-2">React</span>
      </n-button>
      <n-button
        round
        :class="selectedLanguage === CodeFramework.VUE ? '!bg-bg-dark' : ''"
        @click="select(CodeFramework.VUE)"
      >
        <span class="px-2">Vue</span>
      </n-button>
      <n-button
        round
        :class="selectedLanguage === CodeFramework.TYPESCRIPT ? '!bg-bg-dark' : ''"
        @click="select(CodeFramework.TYPESCRIPT)"
      >
        <span class="px-2">TypeScript</span>
      </n-button>
    </div>
    <BtnDocumentation href="https://wiki.apillon.io/build/12-embedded-wallets-integration.html" hover-lighter />
  </div>

  <CodeBlock :code="currentCode" language="ts" theme="prismFunky" :style="codeSize" />
</template>

<script lang="ts" setup>
import { CodeBlock } from 'vuejs-code-block';

enum CodeFramework {
  REACT = 'react',
  VUE = 'vue',
  TYPESCRIPT = 'typescript',
}

const embeddedWalletStore = useEmbeddedWalletStore();

// State to manage the selected code language
const selectedLanguage = ref<string>(CodeFramework.REACT as string);

const select = (language: string) => {
  selectedLanguage.value = language;
};

// VueJS code block
const codeNetworks = `[
    {
      name: 'Moonbase Testnet',
      id: 1287,
      rpcUrl: 'https://rpc.testnet.moonbeam.network',
      explorerUrl: 'https://moonbase.moonscan.io',
    },
    /* ... */
  ]`;

// Computed property to return the current code based on selected language
const currentCode = computed(() => {
  if (selectedLanguage.value === CodeFramework.REACT) {
    return `import { WalletWidget } from '@apillon/wallet-react';

<WalletWidget
  clientId="${embeddedWalletStore.active.integration_uuid}"
  defaultNetworkId={1287}
  networks={${codeNetworks}}
/>
`;
  } else if (selectedLanguage.value === CodeFramework.TYPESCRIPT) {
    return `import { EmbeddedWalletUI } from '@apillon/wallet-ui';
 
EmbeddedWalletUI("#wallet", {
  clientId: "${embeddedWalletStore.active.integration_uuid}",
  defaultNetworkId: 1287,
  networks: ${codeNetworks}
});
`;
  } else {
    return `import { WalletWidget } from '@apillon/wallet-vue';
 
<WalletWidget
  clientId="${embeddedWalletStore.active.integration_uuid}"
  :defaultNetworkId="1287"
  :networks="${codeNetworks}"
/>
`;
  }
});

// Update code size when language changes
const codeSize = computed(() => {
  return { 'min-height': `${22 * currentCode.value.split('\n').length}px` };
});
</script>
