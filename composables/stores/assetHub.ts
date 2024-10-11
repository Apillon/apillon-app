import { cryptoWaitReady } from '@polkadot/util-crypto';
import { defineStore } from 'pinia';
import Id from '~/pages/dashboard/service/asset-hub/[id].vue';

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
    items: [] as AssetInterface[],
    loading: false,
    search: '',
    pagination: createPagination(),
  }),
  getters: {
    accountConnected(state): boolean {
      return !!state.account && !!state.account?.address;
    },
    assetsLoaded(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasAssets(state): boolean {
      return (
        Array.isArray(state.items) &&
        state.items.length > 0 &&
        state.items.some(i => i.owner === state.account?.address)
      );
    },
  },
  actions: {
    resetData() {
      this.items = [] as AssetInterface[];
      this.pagination.page = 1;
      this.pagination.itemCount = 0;
      this.search = '';
    },

    async initClient(rpc = assetHubNetworks.westend.rpc) {
      if (!this.account) {
        window.$message.warning(window.$i18n.t('dashboard.service.assetHub.connect'));
        return;
      }
      await cryptoWaitReady();

      return await AssetHubClient.getInstance(rpc, this.account);
    },

    /**
     * Fetch wrappers
     */
    async getAssets(): Promise<AssetInterface[]> {
      if (!this.hasAssets || isCacheExpired(LsCacheKeys.ASSETS)) {
        this.items = await this.fetchAssets();
      }
      return this.items;
    },

    async getAsset(id: number): Promise<AssetInterface> {
      if (this.active?.id !== id) {
        this.active = await this.fetchAsset(id);
      }
      return this.active;
    },

    /**
     * API calls
     */
    async fetchAssets(showLoader: boolean = true): Promise<AssetInterface[]> {
      this.loading = showLoader;

      const assetHubClient = await this.initClient();
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
        this.loading = false;
      });

      /** Save timestamp to SS */
      sessionStorage.setItem(LsCacheKeys.ASSETS, Date.now().toString());

      return assets;
    },

    async fetchAsset(assetId: number): Promise<AssetInterface> {
      const asset = this.items.find(i => i.id === assetId);
      if (asset) return asset;

      const assetHubClient = await this.initClient();
      if (!assetHubClient || !this.accountConnected) return {} as AssetInterface;

      const metadata = await assetHubClient.getAssetMetadata(assetId);
      const details = await assetHubClient.getAssetDetails(assetId);

      return { id: assetId, ...metadata.toHuman(), ...details?.toHuman() } as AssetInterface;
    },
  },

  persist: {
    key: SessionKeys.ASSET_HUB,
    storage: persistedState.sessionStorage,
    paths: ['account', 'items'],
    // debug: true,
  } as any,
});
