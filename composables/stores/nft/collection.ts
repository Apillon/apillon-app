import type { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { defineStore } from 'pinia';

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    active: {} as CollectionInterface,
    attribute: {} as AttributeInterface,
    columns: [] as TableColumns<KeyTitle>,
    csvAttributes: [] as Array<MetadataAttributes>,
    csvData: [] as Array<Record<string, string>>,
    csvFile: {} as FileListItemType,
    csvSelectedAttributes: [] as Array<string>,
    filesMetadata: [] as FileListItemType[],
    gridView: false,
    images: [] as FileListItemType[],
    items: [] as CollectionInterface[],
    loading: false,
    metadata: [] as Array<Record<string, any>>,
    metadataStored: true as Boolean | null,
    mintTab: NftCreateTab.METADATA,
    search: '',
    step: CollectionStep.ENVIRONMENT,
    nftStep: NftCreateStep.AMOUNT,
    amount: 0,
    stepDeploy: NftDeployStep.NAME,
    stepCollectionDeploy: CollectionStatus.CREATED,
    stepUpload: NftUploadStep.FILE,
    total: 0,
    transaction: [] as TransactionInterface[],
    uploadActive: false,
    form: {
      base: {
        logo: null as FileListItemType | null,
        coverImage: null as FileListItemType | null,
        name: '',
        symbol: '',
        chain: Chains.MOONBASE,
        collectionType: NFTCollectionType.GENERIC,
        useApillonIpfsGateway: true,
      },
      behavior: {
        baseUri: '',
        baseExtension: '.json',
        dropStart: Date.now() + 3600000,
        drop: false,
        maxSupply: 0,
        dropPrice: 0,
        dropReserve: 0,
        revocable: false as Boolean | null,
        soulbound: false as Boolean | null,
        supplyLimited: 0,
        royaltiesAddress: null,
        royaltiesFees: 0,
      },
      single: {
        image: '',
        id: '',
        collectionUuid: '',
        name: '',
        description: '',
        copies: 1,
        attributes: [] as AttributesInterface,
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
      this.search = '';
      this.transaction = [] as TransactionInterface[];
      this.resetMetadata();
    },
    resetMetadata() {
      this.resetFile();
      this.resetImages();
      this.mintTab = NftCreateTab.METADATA;
      this.step = CollectionStep.ENVIRONMENT;
      this.nftStep = NftCreateStep.AMOUNT;
      this.stepDeploy = NftDeployStep.NAME;
      this.stepCollectionDeploy = CollectionStatus.CREATED;
    },
    resetFile() {
      this.csvAttributes = [] as MetadataAttributes[];
      this.columns = [] as NTableColumns<KeyTitle>;
      this.csvData = [] as Array<Record<string, string>>;
      this.csvFile = {} as FileListItemType;
      this.csvSelectedAttributes = [] as Array<string>;
      this.filesMetadata = [] as FileListItemType[];
      this.metadata = [] as Array<Record<string, any>>;
    },
    resetImages() {
      this.images.forEach(img => img.onError());
      while (this.images.length > 0) {
        this.images.pop();
      }
    },
    resetSingleFormData() {
      this.form.single.image = '';
      this.form.single.id = '';
      this.form.single.collectionUuid = this.active?.collection_uuid;
      this.form.single.name = '';
      this.form.single.description = '';
      this.form.single.copies = 1;
      this.form.single.attributes = [];
    },
    resetForms() {
      this.form.base.logo = null;
      this.form.base.coverImage = null;
      this.form.base.name = '';
      this.form.base.symbol = '';
      this.form.base.chain = Chains.MOONBASE;
      this.form.base.collectionType = NFTCollectionType.GENERIC;
      this.form.base.useApillonIpfsGateway = true;

      this.form.behavior.baseUri = '';
      this.form.behavior.baseExtension = '.json';
      this.form.behavior.dropStart = Date.now() + 3600000;
      this.form.behavior.drop = false;
      this.form.behavior.maxSupply = 0;
      this.form.behavior.dropPrice = 0;
      this.form.behavior.dropReserve = 0;
      this.form.behavior.revocable = false;
      this.form.behavior.soulbound = false;
      this.form.behavior.supplyLimited = 0;

      this.resetSingleFormData();
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

    async getCollection(collectionUuid: string): Promise<CollectionInterface | null> {
      if (
        this.active?.collection_uuid === collectionUuid &&
        this.active?.collectionStatus >= CollectionStatus.DEPLOYED &&
        !isCacheExpired(LsCacheKeys.COLLECTION)
      ) {
        return this.active;
      }
      return await this.fetchCollection(collectionUuid);
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

    /**
     * API calls
     */
    async fetchCollections(showLoader = true): Promise<CollectionInterface[]> {
      this.loading = showLoader;

      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const params: Record<string, string | number> = {
          project_uuid: dataStore.projectUuid,
          orderBy: 'createTime',
          desc: 'true',
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

    async fetchCollection(uuid: string): Promise<CollectionInterface | null> {
      if (!uuid) return null;
      try {
        const res = await $api.get<CollectionResponse>(endpoints.collections(uuid));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.COLLECTION, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as CollectionInterface;
      }
      return null;
    },

    async fetchCollectionTransactions(
      collectionUuid: string,
      showLoader = true
    ): Promise<TransactionInterface[]> {
      this.loading = showLoader;
      try {
        const params: Record<string, string | number> = {
          ...PARAMS_ALL_ITEMS,
        };
        const res = await $api.get<TransactionResponse>(
          endpoints.collectionTransactions(collectionUuid),
          params
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
  },
});
