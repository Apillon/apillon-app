export const assetHubNetworks = {
  polkadot: {
    name: 'Polkadot',
    rpc: 'wss://asset-hub-polkadot-rpc.dwellir.com',
  },
  westend: {
    name: 'Westend Testnet',
    rpc: 'wss://asset-hub-westend-rpc.dwellir.com',
  },
};

const connectedAccount = ref<WalletInfo | undefined>();

export default function assetHub() {
  const { t } = useI18n();
  const { error, success } = useMessage();
  const authStore = useAuthStore();
  const assetHubStore = useAssetHubStore();
  const { getMessageSignature } = useProvider();

  const loadingWallet = ref<boolean>(false);
  const modalWalletSelectVisible = ref<boolean>(false);

  onMounted(() => {
    reconnectWallet();
  });

  async function reconnectWallet() {
    if (assetHubStore?.account?.address && assetHubStore?.account?.wallet) {
      const wallet = getWallets().find(w => w.title === assetHubStore.account?.wallet?.title);

      if (wallet && wallet.installed) {
        authStore.setWallet(wallet);

        assetHubStore.account = authStore.wallet.accounts.find(
          acc => acc.address === assetHubStore.account?.address
        );
      } else {
        assetHubStore.account = assetHubStore.account;
      }
    } else {
      assetHubStore.account = null;
    }
  }
  async function walletConnect(account: WalletAccount) {
    loadingWallet.value = true;

    try {
      const { message, timestamp } = await authStore.getAuthMsg();
      await getMessageSignature(account.address, message);
      assetHubStore.account = account;

      success(t('auth.wallet.connected.success'));
    } catch (e) {
      /** Show error message */
      error(userFriendlyMsg(e));
    }
    modalWalletSelectVisible.value = false;
    loadingWallet.value = false;
  }

  return {
    loadingWallet,
    modalWalletSelectVisible,
    walletConnect,
  };
}
