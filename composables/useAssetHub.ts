import { BN } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { getWallets } from '~/lib/wallet/wallets';
import type { AssetHubClient as AssetHubClientType } from '~/lib/asset-hub/client';
import { AssetHubClient } from '~/lib/asset-hub/client';

export const assetHubNetworks = {
  assetHub: {
    name: 'Asset Hub',
    env: 'mainnet',
    rpc: 'wss://asset-hub-polkadot-rpc.dwellir.com',
  },
  westend: {
    name: 'Westend Asset Hub',
    env: 'testnet',
    rpc: 'wss://asset-hub-westend-rpc.dwellir.com',
  },
};

export const getAssetHubRpc = (mainnet = false) =>
  mainnet ? assetHubNetworks.assetHub.rpc : assetHubNetworks.westend.rpc;

const assetHubClient = ref<AssetHubClientType | null | undefined>();

export const toNum = (text: string) => Number(text?.replaceAll(',', ''));

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

  const supply = computed(() => {
    const factor = new BN(10).pow(new BN(assetHubStore.active.decimals));
    const supplyBN = new BN(assetHubStore.active?.supply?.replaceAll(',', ''));
    return supplyBN.div(factor).toString();
  });

  async function initAssetHub() {
    await sleep(10);
    await dataStore.waitOnPromises(false);
    await assetHubStore.getAssets();
    pageLoading.value = false;
  }

  async function initClient(rpc = assetHubNetworks.westend.rpc) {
    if (assetHubStore.account) {
      assetHubClient.value = await AssetHubClient.getInstance(rpc, assetHubStore.account);
    }
  }

  const refreshAsset = async (assetId: number) => {
    await sleep(2000);
    const updatedAsset = await assetHubStore.fetchAssets();

    Object.assign(assetHubStore.active, updatedAsset);
    assetHubStore.items.forEach(item => {
      if (item.id === assetId) {
        Object.assign(item, updatedAsset);
      }
    });
  };

  const refreshAssets = async (assetId: number, network: string) => {
    await sleep(2000);

    assetHubStore.mainnet = network === assetHubNetworks.assetHub.rpc;
    const newAsset = await assetHubStore.fetchAsset(assetId);

    if (newAsset) {
      assetHubStore.active = newAsset;

      if (network === assetHubNetworks.westend.rpc) {
        assetHubStore.itemsTestnet.push(newAsset);
      } else {
        assetHubStore.itemsMainnet.push(newAsset);
      }
    }
  };

  async function reconnectWallet() {
    await sleep(200);
    const userWallet = authStore.wallet.address || authStore.user.wallet;

    if (assetHubStore?.account?.address && assetHubStore?.account?.wallet) {
      await cryptoWaitReady();

      const wallet = getWallets().find(w => w.title === assetHubStore.account?.wallet?.title);
      if (wallet && wallet.installed) {
        await sleep(200);
        authStore.setWallet(wallet);

        assetHubStore.account = authStore.wallet.accounts.find(acc => acc.address === assetHubStore.account?.address);
      } else {
        assetHubStore.account = null;
      }
    } else if (userWallet && authStore.wallet.accounts.length > 0) {
      assetHubStore.account = authStore.wallet.accounts.find(acc => acc.address === userWallet);
    } else {
      assetHubStore.account = null;
    }
  }

  async function walletConnect(account: WalletAccount) {
    loadingWallet.value = true;

    try {
      const { message } = await authStore.getAuthMsg();
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
    assetHubNetworks,
    loadingWallet,
    modalWalletSelectVisible,
    pageLoading,
    supply,
    initAssetHub,
    initClient,
    reconnectWallet,
    refreshAsset,
    refreshAssets,
    walletConnect,
  };
}
