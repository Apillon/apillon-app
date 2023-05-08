import { defineStore } from 'pinia';

const dataStore = useDataStore();

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    active: {} as CollectionInterface,
    bucketId: 0,
    csvAttributes: [] as Array<MetadataAttributes>,
    csvColumns: [] as NTableColumns<KeyTitle>,
    csvData: [] as Array<Record<string, string>>,
    csvFile: {} as FileListItemType,
    csvSelectedAttributes: [] as Array<string>,
    filesMetadata: [] as FileListItemType[],
    images: [] as FileListItemType[],
    items: [] as CollectionInterface[],
    loading: false,
    metadata: [] as Array<Record<string, any>>,
    metadataStored: null as Boolean | null,
    mintTab: NftMintTab.METADATA,
    quotaReached: undefined as Boolean | undefined,
    search: '',
    selected: 0,
    stepDeploy: NftDeployStep.NAME,
    stepUpload: NftUploadStep.FILE,
    total: 0,
    transaction: [] as TransactionInterface[],
    uploadActive: false,
    form: {
      base: {
        name: '',
        symbol: '',
        chain: Chains.MOONBEAM,
      },
      behaviour: {
        baseExtension: '.json',
        dropStart: Date.now() + 3600000,
        isDrop: false,
        maxSupply: 0,
        mintPrice: 0,
        reserve: 0,
        revocable: false as Boolean | null,
        soulbound: false as Boolean | null,
        supplyLimited: 0,
        royaltiesAddress: '',
        royaltiesFees: 0,
      },
    },
  }),
  getters: {
    hasCollections(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasCollectionTransactions(state): boolean {
      return Array.isArray(state.transaction) && state.transaction.length > 0;
    },
    hasCsvFile(state): boolean {
      return !!state.csvFile?.id && Array.isArray(state.csvData) && state.csvData.length > 0;
    },
    hasImages(state): boolean {
      return Array.isArray(state.images) && state.images.length > 0;
    },
    hasMetadata(state): boolean {
      return Array.isArray(state.metadata) && state.metadata.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as CollectionInterface;
      this.items = [] as CollectionInterface[];
      this.quotaReached = undefined;
      this.search = '';
      this.selected = 0;
      this.transaction = [] as TransactionInterface[];
      this.resetMetadata();
    },
    resetMetadata() {
      this.resetFile();
      this.resetImages();
      this.mintTab = NftMintTab.METADATA;
    },
    resetFile() {
      this.csvAttributes = [] as MetadataAttributes[];
      this.csvColumns = [] as NTableColumns<KeyTitle>;
      this.csvData = [] as Array<Record<string, string>>;
      this.csvFile = {} as FileListItemType;
      this.csvSelectedAttributes = [] as Array<string>;
      this.filesMetadata = [] as FileListItemType[];
      this.metadata = [] as Array<Record<string, any>>;
    },
    resetImages() {
      this.images = [] as FileListItemType[];
    },
    resetForms() {
      this.form.base.name = '';
      this.form.base.symbol = '';
      this.form.base.chain = Chains.MOONBEAM;

      this.form.behaviour.baseExtension = '.json';
      this.form.behaviour.dropStart = Date.now() + 3600000;
      this.form.behaviour.isDrop = false;
      this.form.behaviour.maxSupply = 0;
      this.form.behaviour.mintPrice = 0;
      this.form.behaviour.reserve = 0;
      this.form.behaviour.revocable = null;
      this.form.behaviour.soulbound = null;
      this.form.behaviour.supplyLimited = 0;
    },
    setCollectionId(id: number) {
      if (this.selected !== id) {
        this.selected = id;
      }
    },

    /**
     * Fetch wrappers
     */
    async getCollections(): Promise<CollectionInterface[]> {
      if (!this.hasCollections || isCacheExpired(LsCacheKeys.COLLECTIONS)) {
        return await this.fetchCollections();
      }
      return this.items;
    },

    async getCollection(collectionId: number): Promise<CollectionInterface> {
      if (
        this.active?.id === collectionId &&
        this.active?.collectionStatus >= CollectionStatus.DEPLOYED &&
        !isCacheExpired(LsCacheKeys.COLLECTION)
      ) {
        return this.active;
      }
      return await this.fetchCollection(collectionId);
    },

    async getCollectionTransactions(collectionUuid: string): Promise<any> {
      if (
        this.active?.collection_uuid !== collectionUuid ||
        !this.hasCollectionTransactions ||
        isCacheExpired(LsCacheKeys.COLLECTION_TRANSACTIONS)
      ) {
        return await this.fetchCollectionTransactions(collectionUuid);
      }
      return this.transaction;
    },

    async getCollectionQuota() {
      if (this.quotaReached === undefined) {
        await this.fetchCollectionQuota();
      }
    },

    /**
     * API calls
     */
    async fetchCollections(showLoader: boolean = true): Promise<CollectionInterface[]> {
      this.loading = showLoader;
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const params: Record<string, string | number> = {
          project_uuid: dataStore.projectUuid,
          ...PARAMS_ALL_ITEMS,
        };

        const req = $api.get<CollectionsResponse>(endpoints.collections(), params);
        dataStore.promises.collections = req;
        const res = await req;

        this.items = res.data.items;
        this.total = res.data.total;
        this.search = '';
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.COLLECTIONS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        console.log(error);
        /** Clear promise */
        dataStore.promises.collections = null;
        this.items = [] as Array<CollectionInterface>;
        this.total = 0;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      this.loading = false;
      return [];
    },

    async fetchCollection(id: number): Promise<CollectionInterface> {
      try {
        const res = await $api.get<CollectionResponse>(endpoints.collections(id));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.COLLECTION, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as CollectionInterface;
      }
      return {} as CollectionInterface;
    },

    async fetchCollectionTransactions(
      collectionUuid: string,
      showLoader: boolean = true
    ): Promise<TransactionInterface[]> {
      this.loading = showLoader;
      try {
        const res = await $api.get<TransactionResponse>(
          endpoints.collectionTransactions(collectionUuid)
        );
        this.transaction = res.data.items;
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.COLLECTION_TRANSACTIONS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        this.transaction = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
      return [];
    },

    async fetchCollectionQuota() {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<CollectionQuotaResponse>(endpoints.collectionQuota, {
          project_uuid: dataStore.projectUuid,
        });

        this.quotaReached = res.data;
      } catch (error: any) {
        this.quotaReached = undefined;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },
  },
});
