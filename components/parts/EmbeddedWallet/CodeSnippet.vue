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
      <n-button
        size="small"
        round
        :class="selectedLanguage === CodeFramework.TYPESCRIPT ? '!bg-bg-dark' : ''"
        @click="select(CodeFramework.TYPESCRIPT)"
      >
        <span class="px-2">TypeScript</span>
      </n-button>
    </div>
    <Btn
      type="secondary"
      size="small"
      inner-class="text-white flex items-center justify-center"
      href="https://wiki.apillon.io/build/12-embedded-wallets-integration.html"
    >
      <span class="icon-file text-xl mr-2"></span>
      {{ $t('embeddedWallet.viewDocumentation') }}
    </Btn>
  </div>

  <CodeBlock :code="currentCode" lang="js" theme="github-dark" highlightjs :style="codeSize" />
</template>

<script lang="ts" setup>
import CodeBlock from 'vue3-code-block';

enum CodeFramework {
  VUE = 'vue',
  REACT = 'react',
  TYPESCRIPT = 'typescript',
}

const embeddedWalletStore = useEmbeddedWalletStore();

// State to manage the selected code language
const selectedLanguage = ref<string>(CodeFramework.VUE as string);

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
    return `import { EmbeddedWalletUI } from '@apillon/wallet-vue';

EmbeddedWalletUI("#wallet", {
  clientId: "${embeddedWalletStore.active.integration_uuid}",
  defaultNetworkId: 1287,
  networks: ${codeNetworks},
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
