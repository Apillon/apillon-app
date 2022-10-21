/* eslint-disable import/no-named-default */
import detectEthereumProvider from '@metamask/detect-provider';
import { useDebounceFn } from '@vueuse/core';
import { ethers, providers } from 'ethers';
import useAlerts from './useAlerts';
import chains from '~/config/chains';
import { ActionReturn, removeLastSlash } from '~/lib/utils';

// Shared state
const ethereum = ref<any>();
const provider = ref<providers.Web3Provider>();
const userAccount = ref<string>('');
const chainId = ref<string>('');

export const ProviderConnectors = {
  METAMASK: 1,
};

export const useProvider = () => {
  const authStore = useAuthStore();
  const { $alert } = useAlerts();

  onMounted(() => {
    initProvider();
  });

  async function initProvider() {
    if (provider.value) {
      return ActionReturn(true, provider.value);
    }

    const detected: any = await detectEthereumProvider();
    // Prevent further initialization process if eth is already init in another instance
    if (ethereum.value) {
      provider.value = new ethers.providers.Web3Provider(ethereum.value, 'any');
      return ActionReturn(true, provider.value);
    } else if (
      detected &&
      !detected.selectedProvider &&
      Array.isArray(detected.providers) &&
      detected.providers.length
    ) {
      // Prefer metamask if multiple providers
      let selectedProvider = detected.providers[0];
      for (const p of detected.providers) {
        if (p.isMetaMask) {
          selectedProvider = p;
          break;
        }
      }
      ethereum.value = selectedProvider;
    } else {
      ethereum.value = detected;
    }
  }
  async function selectProvider(connector = ProviderConnectors.METAMASK) {
    ethereum.value = null;
    provider.value = null;

    if (connector === ProviderConnectors.METAMASK) {
      /**
       * METAMASK
       * assume connector === ProviderConnectors.METAMASK
       */
      const detected = (await detectEthereumProvider()) as any;

      if (detected) {
        /** Store current provider */
        authStore.provider = connector;

        if (detected.isMetaMask && !Array.isArray(detected.providers)) {
          ethereum.value = detected;
        } else if (Array.isArray(detected.providers)) {
          /**
           * Multiple providers -> look for metamask
           */
          for (const p of detected.providers) {
            if (p.isMetaMask) {
              ethereum.value = p;
              break;
            }
          }

          /**
           * MetaMask not found, take first injected provider
           */
          if (!ethereum.value && detected.providers.length) {
            ethereum.value = detected.providers[0];
          }
        } else {
          // Only another injected provider is available
          ethereum.value = detected;
        }
      }
      provider.value = new ethers.providers.Web3Provider(ethereum.value, 'any');
      return ActionReturn(true, provider.value);
    }
    // false if no provider was found
    return ActionReturn(false, 'Failed to establish wallet connection');
  }

  function resetProvider() {
    ethereum.value = null;
    provider.value = null;
  }

  async function setUserAccount(value: string) {
    if ((!userAccount.value && !value) || userAccount.value === value) {
      // dont run check if userAccount remains unchanged
      return;
    }
    userAccount.value = value;

    const lowerValue = !value || typeof value !== 'string' ? '' : value.toLowerCase();

    let authAddress = null;
    if (authStore?.crypto?.length > 0 && authStore.crypto[0]) {
      authAddress = authStore.crypto[0].wallet;
    }

    const lowerStore = typeof authAddress !== 'string' ? '' : authAddress.toLowerCase();

    // Auth user wallet does not match provider wallet
    if (!!authAddress && lowerStore !== lowerValue) {
      await authStore.logout();
      walletWarning();
    } else {
      // Store auth data
      authStore.wallet = lowerStore;
    }
  }

  function setChainId(value: string) {
    chainId.value = value;
  }

  const walletWarning = useDebounceFn(() => {
    $alert.warning({
      title: 'Wallet Error',
      message:
        'Current wallet is not associated with your account. Please select the appropriate wallet to use any wallet functionality.',
    });
  }, 500);

  return {
    ethereum: computed(() => ethereum.value),
    provider: computed(() => provider.value),
    userAccount: computed(() => userAccount.value),
    chainId: computed(() => chainId.value),

    explorerUrl: computed(() => {
      if (chainId.value && chains[chainId.value]?.blockExplorerUrls.length) {
        return removeLastSlash(`${chains[chainId.value]?.blockExplorerUrls[0]}`);
      }
      return '';
    }),

    initProvider,
    selectProvider,
    setUserAccount,
    setChainId,
  };
};
