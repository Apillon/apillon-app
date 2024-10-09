import { cryptoWaitReady } from '@polkadot/util-crypto';

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

const connectedAccount = ref<WalletAccount | undefined>();

export default function assetHub() {
  const { t } = useI18n();
  const { error, success, warning } = useMessage();
  const authStore = useAuthStore();
  const { getMessageSignature } = useProvider();

  const loading = ref(false);
  const loadingWallet = ref<boolean>(false);
  const modalWalletSelectVisible = ref<boolean>(false);

  async function walletConnect(account: WalletAccount) {
    loadingWallet.value = true;

    try {
      const { message, timestamp } = await authStore.getAuthMsg();
      await getMessageSignature(account.address, message);
      connectedAccount.value = account;

      success(t('auth.wallet.connected.success'));
    } catch (e) {
      /** Show error message */
      error(userFriendlyMsg(e));
    }
    modalWalletSelectVisible.value = false;
    loadingWallet.value = false;
  }

  async function initClient(rpc = assetHubNetworks.westend.rpc) {
    if (!connectedAccount.value) {
      warning(t('dashboard.service.assetHub.connect'));
      return;
    }
    await cryptoWaitReady();

    return await AssetHubClient.getInstance(rpc, connectedAccount.value);
  }

  async function getAssetDetails(assetId: number) {
    const assetHubClient = await initClient();
    if (!assetHubClient || !connectedAccount.value) return;

    const metadata = await assetHubClient.getAssetMetadata(assetId);
    const details = await assetHubClient.getAssetDetails(assetId);

    return {
      name: metadata.name.toString(),
      symbol: metadata.symbol.toString(),
      decimals: metadata.decimals.toString(),
      owner: details?.owner?.toString(),
      issuer: details?.issuer?.toString(),
      admin: details?.admin?.toString(),
      freezer: details?.freezer?.toString(),
      supply: details?.supply?.toString(),
      deposit: details?.deposit?.toString(),
      minBalance: details?.minBalance?.toString(),
      status: details?.status?.toString(),
    };
  }

  return {
    connectedAccount,
    loading,
    loadingWallet,
    modalWalletSelectVisible,
    getAssetDetails,
    walletConnect,
  };
}
