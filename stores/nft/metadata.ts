import { defineStore } from 'pinia';
import { NftMetadataStep, type FormSingleNft } from '~/lib/types/nft';

export const useMetadataStore = defineStore('metadata', {
  state: () => ({
    columns: [] as KeyTitle[],
    csvAttributes: [] as Array<MetadataAttributes>,
    csvData: [] as Array<Record<string, string>>,
    csvFile: {} as FileListItemType,
    csvSelectedAttributes: [] as Array<string>,
    filesMetadata: [] as FileListItemType[],
    gridView: false,
    images: [] as FileListItemType[],
    loading: false,
    metadata: [] as MetadataItem[],
    stepCollectionCreate: CollectionCreateStep.SMART_CONTRACT,
    stepMetadata: NftMetadataStep.CHAIN,
    form: {
      single: {
        image: '',
        id: 1,
        collectionUuid: '',
        name: '',
        description: '',
        copies: 1,
        attributes: [] as AttributesInterface,
      } as FormSingleNft,
      smartContract: {
        adminAddress: null as string | null,
        chain: undefined as number | undefined,
        chainType: ChainType.EVM,
        collectionType: NFTCollectionType.GENERIC,
        useApillonIpfsGateway: false,
        useIpns: undefined as boolean | undefined,
        baseUri: '',
        baseExtension: '.json',
        dropStart: Date.now() + 3600000,
        drop: false,
        dropPrice: 0,
        dropReserve: 0,
        isAutoIncrement: true as boolean | null,
        maxSupply: 0,
        name: '',
        revocable: false as boolean | null,
        royaltiesAddress: null,
        royaltiesFees: 0,
        soulbound: false as boolean | null,
        supplyLimited: 0,
        symbol: '',
      },
      visual: {
        coverImage: null as FileListItemType | null,
        logo: null as FileListItemType | null,
      },
    },
  }),
  getters: {
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
      this.resetMetadata();
    },
    resetMetadata() {
      this.resetFile();
      this.resetImages();
      this.resetForms();
    },
    resetFile() {
      this.csvAttributes = [] as MetadataAttributes[];
      this.columns = [] as KeyTitle[];
      this.csvData = [] as Array<Record<string, string>>;
      this.csvFile = {} as FileListItemType;
      this.csvSelectedAttributes = [] as Array<string>;
      this.filesMetadata = [] as FileListItemType[];
      this.metadata = [] as MetadataItem[];
    },
    resetImages() {
      while (this.images.length > 0) {
        this.images.pop();
      }
    },
    resetForms() {
      this.resetFormSmartContract();
      this.resetFormVisual();
      this.resetSingleFormData();
    },
    resetFormVisual() {
      this.form.visual.logo = null;
      this.form.visual.coverImage = null;
    },
    resetFormSmartContract() {
      this.form.smartContract.adminAddress = null;
      this.form.smartContract.chain = undefined;
      this.form.smartContract.chainType = ChainType.EVM;
      this.form.smartContract.collectionType = NFTCollectionType.GENERIC;
      this.form.smartContract.useApillonIpfsGateway = false;
      this.form.smartContract.useIpns = undefined;
      this.form.smartContract.baseUri = '';
      this.form.smartContract.baseExtension = '.json';
      this.form.smartContract.dropStart = Date.now() + 3600000;
      this.form.smartContract.drop = false;
      this.form.smartContract.dropPrice = 0;
      this.form.smartContract.dropReserve = 0;
      this.form.smartContract.isAutoIncrement = true;
      this.form.smartContract.maxSupply = 0;
      this.form.smartContract.name = '';
      this.form.smartContract.revocable = false;
      this.form.smartContract.soulbound = false;
      this.form.smartContract.supplyLimited = 0;
      this.form.smartContract.symbol = '';
    },
    resetSingleFormData(clear = true) {
      this.form.single.copies = 1;
      this.form.single.description = '';
      this.form.single.image = '';
      this.form.single.name = '';

      if (clear) {
        this.form.single.attributes = [];
        this.form.single.id = 1;
      } else {
        this.form.single.attributes.forEach(attr => (attr.value = ''));
      }
    },
    resetCache() {
      sessionStorage.removeItem(LsCacheKeys.COLLECTION);
      sessionStorage.removeItem(LsCacheKeys.COLLECTIONS);
      sessionStorage.removeItem(LsCacheKeys.COLLECTION_TRANSACTIONS);
      sessionStorage.removeItem(LsCacheKeys.COLLECTION_QUOTA);
    },
  },
});
