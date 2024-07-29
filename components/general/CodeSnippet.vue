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
import { ref, computed } from 'vue';
import CodeBlock from 'vue3-code-block';

const props = defineProps({
  spaceId: { type: String, default: 'spaceID' },
  postId: { type: String, default: '' },
});

const darkTheme = ref<boolean>(true);
const enableBackButton = ref<boolean>(false);
const enableLoginButton = ref<boolean>(true);
const enableInputAutofocus = ref<boolean>(true);

// State to manage the selected code language
const selectedLanguage = ref('app');

const select = (language: string) => {
  selectedLanguage.value = language;
};

// Settings computed property
const settings = computed(() => {
  return props.postId
    ? {
        theme: darkTheme.value ? 'dark' : 'light',
        widgetElementId: 'grill',
        hub: { id: props.spaceId },
        channel: {
          type: 'channel',
          id: props.postId,
          settings: {
            enableBackButton: enableBackButton.value,
            enableLoginButton: enableLoginButton.value,
            enableInputAutofocus: enableInputAutofocus.value,
          },
        },
      }
    : {
        theme: darkTheme.value ? 'dark' : 'light',
        widgetElementId: 'grill',
        hub: { id: props.spaceId },
      };
});

// VueJS code block
const codeVue = computed(() => {
  return `
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
});

const codeReact = computed(() => {
  return `
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
});

// Computed property to return the current code based on selected language
const currentCode = computed(() => {
  return selectedLanguage.value === 'app' ? codeReact.value : codeVue.value;
});

// Update code size when language changes
const codeSize = computed(() => {
  return { 'min-height': `${22 * currentCode.value.split('\n').length}px` };
});
</script>

<style lang="postcss">
.active {
  background-color: #f0f0f0;
}
</style>
