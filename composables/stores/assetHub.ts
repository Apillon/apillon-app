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
    account: {} as WalletAccount,
    active: {} as AssetInterface,
    items: [] as AssetInterface[],
    loading: false,
    search: '',
    pagination: createPagination(),
  }),
  getters: {
    accountConnected(state): boolean {
      return state.account && !!state.account?.address;
    },
    hasAssets(state): boolean {
      return (
        !!state.search || state.loading || (Array.isArray(state.items) && state.items.length > 0)
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
        const { t } = useI18n();
        const { warning } = useMessage();
        warning(t('dashboard.service.assetHub.connect'));
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
        return await this.fetchAssets();
      }
      return this.items;
    },

    async getAsset(id: number): Promise<AssetInterface> {
      if (this.active?.id !== id || isCacheExpired(LsCacheKeys.ASSET)) {
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

      loadedAssets.forEach(async asset => {
        const id = Number(asset[0].toHuman()?.toLocaleString().replaceAll(',', ''));
        const metadata = await assetHubClient.getAssetMetadata(id);

        assets.push(
          Object.assign({ id }, asset[1].toHuman(), metadata.toHuman()) as AssetInterface
        );
      });

      this.loading = false;
      return assets;
    },

    async fetchAsset(assetId: number): Promise<AssetInterface> {
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
    debug: true,
  },
});
