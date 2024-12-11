import { moonbeam, moonbaseAlpha } from '@wagmi/vue/chains';
import { http, createConfig, WagmiPlugin } from '@wagmi/vue';
import { VueQueryPlugin } from '@tanstack/vue-query';

export const wagmiConfig = createConfig({
  chains: [moonbeam, moonbaseAlpha],
  transports: {
    [moonbeam.id]: http(),
    [moonbaseAlpha.id]: http(),
  },
});

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiConfig });
  nuxtApp.vueApp.use(VueQueryPlugin);
});
