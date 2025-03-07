import { moonbeam, moonbaseAlpha } from '@wagmi/vue/chains';
import { http, createConfig, WagmiPlugin, createStorage } from '@wagmi/vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { metaMask, coinbaseWallet, walletConnect } from '@wagmi/vue/connectors';

export const wagmiConfig = createConfig({
  chains: [moonbeam, moonbaseAlpha],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'Apillon Metamask wallet',
        url: 'https://app.apillon.io',
        iconUrl: '/favicon.png',
      },
    }),
    coinbaseWallet({ appName: 'Apillon Coinbase wallet', appLogoUrl: '/favicon.png' }),
    // walletConnect({
    //   projectId: 'fefd3005e5f3b8fd2e73de5333eeccf9',
    //   showQrModal: true,
    // }),
  ],
  multiInjectedProviderDiscovery: false,
  storage: createStorage({ storage: window.sessionStorage }),
  transports: {
    [moonbeam.id]: http(),
    [moonbaseAlpha.id]: http(),
  },
});

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiConfig });
  nuxtApp.vueApp.use(VueQueryPlugin);
});
