import { cryptoWaitReady } from '@polkadot/util-crypto';
import { defineStore } from 'pinia';

export type AssetInterface = {
  id: number;
  owner: string;
  issuer: string;
  admin: string;
  freezer: string;
  supply: string; // Total supply of the token
  deposit: string; // Deposit amount
  minBalance: string; // Minimum balance required for token operations
  isSufficient: boolean; // Indicates if the token balance is sufficient
  accounts: string; // Number of accounts holding the token
  sufficients: string; // Number of sufficient accounts
  approvals: string; // Number of approvals
  status: string; // Current status of the token, e.g., "Live"
  name: string; // Token name
  symbol: string; // Token symbol
  decimals: string; // Number of decimal places for the token
  isFrozen: boolean; // Indicates if the token is frozen
};

export const useAssetHubStore = defineStore('assetHub', {
  state: () => ({
    account: null as WalletAccount | null | undefined,
    active: {} as AssetInterface,
    itemsMainnet: [] as AssetInterface[],
    itemsTestnet: [] as AssetInterface[],
    loading: false,
    mainnet: false,
    search: '',
  }),
  getters: {
    accountConnected(state): boolean {
      return !!state.account && !!state.account?.address;
    },
    assetsLoaded(state): boolean {
      return state.mainnet
        ? Array.isArray(state.itemsMainnet) && state.itemsMainnet.length > 0
        : Array.isArray(state.itemsTestnet) && state.itemsTestnet.length > 0;
    },
    hasAssets(state): boolean {
      return state.mainnet
        ? Array.isArray(state.itemsMainnet) &&
            state.itemsMainnet.length > 0 &&
            state.itemsMainnet.some(i => i.owner === state.account?.address)
        : Array.isArray(state.itemsTestnet) &&
            state.itemsTestnet.length > 0 &&
            state.itemsTestnet.some(i => i.owner === state.account?.address);
    },
    hasAssetsMainnet(state): boolean {
      return (
        Array.isArray(state.itemsMainnet) &&
        state.itemsMainnet.length > 0 &&
        state.itemsMainnet.some(i => i.owner === state.account?.address)
      );
    },
    hasAssetsTestnet(state): boolean {
      return (
        Array.isArray(state.itemsTestnet) &&
        state.itemsTestnet.length > 0 &&
        state.itemsTestnet.some(i => i.owner === state.account?.address)
      );
    },
    items(state): AssetInterface[] {
      return state.mainnet ? state.itemsMainnet : state.itemsTestnet;
    },
  },
  actions: {
    resetData() {
      this.itemsMainnet = [] as AssetInterface[];
      this.itemsTestnet = [] as AssetInterface[];
      this.search = '';
    },

    async initClient(mainnet?: boolean, showMsg = true) {
      if (!this.account) {
        if(showMsg){
          window.$message.warning(window.$i18n.t('dashboard.service.assetHub.connect'));
        }
        return null;
      }
      await cryptoWaitReady();

      const env = mainnet === undefined ? this.mainnet : mainnet;
      return await AssetHubClient.getInstance(getAssetHubRpc(env), this.account);
    },

    /**
     * Fetch wrappers
     */
    async getAssets(): Promise<AssetInterface[]> {
      return this.mainnet ? await this.getAssetsMainnet() : await this.getAssetsTestnet();
    },
    async getAssetsMainnet(): Promise<AssetInterface[]> {
      if (!this.hasAssetsMainnet || isCacheExpired(LsCacheKeys.ASSETS)) {
        this.itemsMainnet = await this.fetchAssets(true);
      }
      return this.itemsMainnet;
    },
    async getAssetsTestnet(): Promise<AssetInterface[]> {
      if (!this.hasAssetsTestnet || isCacheExpired(LsCacheKeys.ASSETS_TESTNET)) {
        this.itemsTestnet = await this.fetchAssets(false);
      }
      return this.itemsTestnet;
    },

    async getAsset(id: number): Promise<AssetInterface> {
      if (this.active?.id === id) return this.active;

      const asset = this.mainnet
        ? this.itemsMainnet.find(i => i.id === id)
        : this.itemsTestnet.find(i => i.id === id);
      if (asset) {
        this.active = asset;
      } else {
        this.active = await this.fetchAsset(id);
      }
      return this.active;
    },

    /**
     * API calls
     */
    async fetchAssets(mainnet?: boolean): Promise<AssetInterface[]> {
      this.loading = true;

      const assetHubClient = await this.initClient(mainnet, false);
      if (!assetHubClient || !this.account) return [];

      const loadedAssets = await assetHubClient.getAssets();
      const assets: AssetInterface[] = [];
      const promises: Array<Promise<any>> = [];

      const prepareAssetData = async asset => {
        const id = toNum(asset[0].toHuman()?.toLocaleString());
        const metadata = await assetHubClient.getAssetMetadata(id);

        assets.push(
          Object.assign({ id }, asset[1].toHuman(), metadata.toHuman()) as AssetInterface
        );
      };

      loadedAssets.forEach(asset => {
        promises.push(prepareAssetData(asset));
      });
      await Promise.all(promises).then(_ => {
        setTimeout(() => (this.loading = false), 10);
      });
      assetHubClient.destroyInstance();

      /** Save timestamp to SS */
      const env = mainnet === undefined ? this.mainnet : mainnet;
      const key = env ? LsCacheKeys.ASSETS : LsCacheKeys.ASSETS_TESTNET;
      sessionStorage.setItem(key, Date.now().toString());

      return assets;
    },

    async fetchAsset(assetId: number): Promise<AssetInterface> {
      const assetHubClient = await this.initClient(this.mainnet, false);
      if (!assetHubClient || !this.accountConnected) return {} as AssetInterface;

      const metadata = await assetHubClient.getAssetMetadata(assetId);
      const details = await assetHubClient.getAssetDetails(assetId);
      assetHubClient.destroyInstance();

      return { id: assetId, ...metadata.toHuman(), ...details?.toHuman() } as AssetInterface;
    },
  },

  persist: {
    key: SessionKeys.ASSET_HUB,
    storage: persistedState.sessionStorage,
    paths: ['account', 'itemsMainnet', 'itemsTestnet'],
    // debug: true,
  } as any,
});
