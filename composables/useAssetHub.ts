import { cryptoWaitReady } from '@polkadot/util-crypto';
import type { AssetHubClient as AssetHubClientType } from '#imports';

export const assetHubNetworks = {
  westend: {
    name: 'Westend Asset Hub (testnet)',
    rpc: 'wss://asset-hub-westend-rpc.dwellir.com',
  },
  polkadot: {
    name: 'Asset Hub (mainnet)',
    rpc: 'wss://asset-hub-polkadot-rpc.dwellir.com',
  },
};

export const getAssetHubRpc = (mainnet = false) =>
  mainnet ? assetHubNetworks.polkadot.rpc : assetHubNetworks.westend.rpc;

/** Available columns - show/hide column */
const selectedColumns = ref([
  'id',
  'name',
  'symbol',
  'decimals',
  'supply',
  'minBalance',
  'deposit',
  'owner',
  'admin',
  'issuer',
  'freezer',
  'status',
]);
const assetHubClient = ref<AssetHubClientType | null | undefined>();

export const toNum = (text: string) => Number(text.replaceAll(',', ''));

export default function assetHub() {
  const { t } = useI18n();
  const { error, success } = useMessage();
  const authStore = useAuthStore();
  const dataStore = useDataStore();
  const assetHubStore = useAssetHubStore();
  const { getMessageSignature } = useProvider();

  const pageLoading = ref<boolean>(true);
  const loadingWallet = ref<boolean>(false);
  const modalWalletSelectVisible = ref<boolean>(false);

  async function initAssetHub() {
    await sleep(10);
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await assetHubStore.getAssets();
      pageLoading.value = false;
    });
  }

  async function initClient(rpc = assetHubNetworks.westend.rpc) {
    if (assetHubStore.account) {
      assetHubClient.value = await AssetHubClient.getInstance(rpc, assetHubStore.account);
    }
  }

  async function reconnectWallet() {
    await sleep(200);
    if (assetHubStore?.account?.address && assetHubStore?.account?.wallet) {
      await cryptoWaitReady();

      const wallet = getWallets().find(w => w.title === assetHubStore.account?.wallet?.title);
      if (wallet && wallet.installed) {
        await sleep(200);
        authStore.setWallet(wallet);

        assetHubStore.account = authStore.wallet.accounts.find(
          acc => acc.address === assetHubStore.account?.address
        );
      } else {
        assetHubStore.account = null;
      }
    } else if (authStore.wallet.address && authStore.wallet.accounts.length > 0) {
      assetHubStore.account = authStore.wallet.accounts.find(
        acc => acc.address === authStore.wallet.address
      );
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
    assetHubClient,
    loadingWallet,
    modalWalletSelectVisible,
    pageLoading,
    selectedColumns,
    initAssetHub,
    initClient,
    reconnectWallet,
    walletConnect,
  };
}
