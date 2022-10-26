import chains from '~/config/chains';

const isWpLoading = ref(true); // disable interaction while setting metamask account/chain
const isWpInitialized = ref(false); // is window.ethereum initialized
const isWPConnected = ref(false); // is metamask account connected
const isWpChainConnected = ref(false); // is metamask chain connected

export default function useWalletAccounts() {
  const config = useRuntimeConfig();
  const { $alert } = useAlerts();

  const metamaskStatus = ref('Waiting for wallet...');

  const { ethereum, provider, userAccount, initProvider, setUserAccount, setChainId } =
    useProvider();

  const isWalletPluginReady = computed(() => {
    return (
      !isWpLoading.value && isWpInitialized.value && isWPConnected.value && isWpChainConnected.value
    );
  });

  onMounted(async () => {
    const { success, data } = await initProvider();

    if (!success) {
      metamaskStatus.value = data;
    } else {
      isWpInitialized.value = true;

      registerEventHandlers();
      await checkForConnectedAccount();
      await checkChain();
    }

    isWpLoading.value = false;
  });

  onUnmounted(() => {
    removeEventHandlers();
  });

  function registerEventHandlers() {
    if (ethereum.value) {
      ethereum.value.on('accountsChanged', handleAccountsChanged);
      ethereum.value.on('chainChanged', handleChainChanged);
    }
  }

  function removeEventHandlers() {
    if (ethereum.value) {
      ethereum.value.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.value.removeListener('chainChanged', handleChainChanged);
    }
  }

  async function checkForConnectedAccount() {
    if (!isWpInitialized.value) {
      console.error('Wallet not initialized');
      return;
    }

    if (!ethereum.value) {
      console.error('Ethereum not initialized');
      return;
    }

    try {
      await handleAccountsChanged();
    } catch (err) {
      console.error(err);
      $alert.error('Please connect to specified chain to use this functionality');
    }
  }

  async function checkChain() {
    if (!ethereum.value) {
      console.error('Ethereum not initialized');
      $alert.error('Please connect to specified chain to use this functionality');
      return;
    }
    const chainId = await ethereum.value.request({ method: 'eth_chainId' });
    // return the first chainId that is not null.
    if (chainId !== '0x0') {
      handleChainChanged(chainId);
    }
  }

  async function handleAccountsChanged() {
    // Get accounts from ethers, which respects capitalization
    if (!provider?.value) {
      console.error('Provider not initialized');
      return;
    }
    const accounts = await provider.value.listAccounts();
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      setUserAccount('');
      isWPConnected.value = false;
      metamaskStatus.value = 'Please connect to a wallet';
    } else if (accounts[0] !== userAccount.value) {
      setUserAccount(accounts[0]);
      isWPConnected.value = true;
    } else if (userAccount.value) {
      // account is connected and unchanged
      isWPConnected.value = true;
    }
  }

  function handleChainChanged(chainId: string) {
    if (chainId === '0x0' || chainId === '0' || Number(chainId) === 0) {
      $alert.error('Please connect or unlock wallet');
      return;
    }
    setChainId(chainId);
    console.debug(`Chain changed to '${chainId}'`);
    if (chainId === config.CHAIN_ID) {
      isWpChainConnected.value = true;
      // watch `isWpChainConnected` to reload component
    } else {
      isWpChainConnected.value = false;
      metamaskStatus.value = 'Select the supported chain';
    }
  }

  /**
   * Trigger wallet modal if NO account already set
   */
  async function connectToAccount(resetPermissions = false) {
    if (!isWpInitialized.value) {
      console.error('Wallet not initialized');
      $alert.error('Wallet not initialized');
      return;
    }

    if (!ethereum.value) {
      console.error('Ethereum not initialized');
      $alert.error('Ethereum not initialized');
      return;
    }

    try {
      isWpLoading.value = true;

      if (resetPermissions) {
        await ethereum.value.request({
          method: 'wallet_requestPermissions',
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
      }

      if (ethereum.value.isCoinbaseWallet) {
        await ethereum.value.enable();
      } else if (!ethereum.value.isWalletConnect) {
        await ethereum.value.request({
          method: 'eth_requestAccounts',
        });
      }

      handleAccountsChanged();
    } catch (err: any) {
      if (err.code === 4001) {
        /**
         * EIP-1193 userRejectedRequest error
         * If this happens, the user rejected the connection request.
         */
        metamaskStatus.value = 'Please connect to a wallet';
        console.error('You have to connect to a wallet to use this functionality', err);
        $alert.error('You have to connect to a wallet to use this functionality');
      } else {
        console.error(err);
        $alert.error('You have to connect to a wallet to use this functionality');
      }
    }

    isWpLoading.value = false;
  }

  /**
   * Open MetaMask request to change to a specific chain
   * If chain is not added to metamask yet, open request to add it
   */
  async function connectToChain(chainId = config.CHAIN_ID) {
    if (!isWpInitialized.value) {
      console.error('Wallet not initialized');
      $alert.error('Wallet not initialized');
      return;
    }

    if (!ethereum.value) {
      console.error('Ethereum not initialized');
      $alert.error('Wallet not initialized');
      return;
    }

    try {
      isWpLoading.value = true;
      await ethereum.value.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });

      handleChainChanged(chainId);
    } catch (err: any) {
      if (err.code === 4001) {
        console.error('Please connect to specified chain to use this functionality');
        $alert.error('Wallet not initialized');
      } else if (!!chains[chainId] && err.code === 4902) {
        // Chain not added to MetaMask yet
        try {
          await ethereum.value.request({
            method: 'wallet_addEthereumChain',
            params: [chains[chainId]],
          });
        } catch (err: any) {
          if (err.code === 4001) {
            // User declined
            console.error('Please add the specified chain to use this functionality');
          }
        }
      } else {
        console.error(err);
        $alert.error('Please connect to specified chain to use this functionality');
      }
    }

    isWpLoading.value = false;
  }

  return {
    metamaskStatus,
    isWpLoading: computed(() => isWpLoading.value),
    isWpInitialized: computed(() => isWpInitialized.value),
    isWPConnected: computed(() => isWPConnected.value),
    isWpChainConnected: computed(() => isWpChainConnected.value),
    isWalletPluginReady,
    connectToAccount,
    connectToChain,
  };
}
