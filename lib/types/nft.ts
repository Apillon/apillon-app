export enum ChainType {
  SUBSTRATE = 1,
  EVM = 2,
}

/** NFT Chains */
export enum Chains {
  MOONBASE = 1287,
  MOONBEAM = 1284,
  ASTAR_SHIBUYA = 81,
  ASTAR = 592,
}
export enum SubstrateChain {
  CRUST = 1,
  KILT = 2,
  PHALA = 4,
  POLKADOT = 5,
  SUBSOCIAL = 6,
  XSOCIAL = 7,
  ASTAR = 8,
}
export enum SubstrateChainPrefix {
  ASTAR = 5,
  PHALA = 30,
}

/** NFT Collection type */
export enum NFTCollectionType {
  GENERIC = 1,
  NESTABLE = 2,
}

/** NFT Collection status */
export enum CollectionStatus {
  CREATED = 0,
  DEPLOY_INITIATED = 1,
  DEPLOYING = 2,
  DEPLOYED = 3,
  TRANSFERRED = 4,
  FAILED = 5,
}

/** NFT Collection create step */
export enum CollectionStep {
  STORAGE_TYPE = 0,
  ENVIRONMENT = 1,
  METADATA = 2,
  BEHAVIOR = 3,
}

/** NFT Transaction status */
export enum TransactionStatus {
  REQUESTED = 0,
  PENDING = 1,
  FINISHED = 2,
  VERIFIED = 3,
  FAILED = 4,
}

/** NFT Transaction type */
export enum TransactionType {
  DEPLOY_CONTRACT = 1,
  TRANSFER_CONTRACT_OWNERSHIP = 2,
  MINT_NFT = 3,
  SET_COLLECTION_BASE_URI = 4,
  BURN_NFT = 5,
  NEST_MINT_NFT = 6,
}

/** NFT create steps */
export enum NftAmount {
  SINGLE = 1,
  MULTIPLE = 2,
}
/** Mint steps */
export enum NftCreateTab {
  METADATA = 1,
  PREVIEW = 2,
  IMAGES = 3,
  DEPLOY = 4,
}
/** NFT create steps */
export enum NftCreateStep {
  AMOUNT = 1,
  SINGLE = 2,
  MULTIPLE = 3,
  PREVIEW = 4,
  DEPLOY = 5,
}
/** Multiple NFTs upload steps */
export enum NftUploadStep {
  FILE = 1,
  IMAGES = 2,
  PREVIEW = 3,
}

/** NFT Collection deploy status */
export enum NftDeployStatus {
  IDLE = 0,
  CREATING = 1,
  UPLOADING = 2,
  DEPLOYING = 3,
  DEPLOYED = 4,
}

declare global {
  /** Papa parser */
  type CsvFileData = {
    data: Array<any>;
    errors: Array<any>;
    meta: {
      aborted: boolean;
      cursor: number;
      delimeter: string;
      fields: Array<string>;
      linebreak: string;
      truncated: boolean;
    };
  };

  /**
   * Collection
   */
  interface CollectionInterface extends BaseObjectInterface {
    baseExtension: string;
    baseUri: string;
    bucket_uuid: string;
    chain: number;
    chainType: number;
    collectionType: number;
    collectionStatus: number;
    collection_uuid: string;
    contractAddress: string | null;
    dropStart: number;
    drop: boolean;
    isRevokable: boolean;
    isSoulbound: boolean;
    maxSupply: number;
    dropPrice: number;
    dropReserve: number;
    royaltiesAddress: string;
    royaltiesFees: number;
    symbol: string;
    transactionHash: string | null;
    updateTime: string;
  }

  interface CollectionResponse extends GeneralResponse<CollectionInterface> {}
  interface CollectionUpdateResponse extends GeneralResponse<CollectionInterface> {}
  interface CollectionsResponse extends GeneralItemsResponse<CollectionInterface> {}

  /**
   * Transaction
   */
  interface TransactionInterface extends GeneralInterface {
    contract_id: number;
    id: number;
    transactionHash: string | null;
    transactionStatus: number;
    transactionStatusMessage: string | null;
    transactionType: number;
    walletAddress: string;
  }

  interface TransactionResponse extends GeneralItemsResponse<TransactionInterface> {}

  /**
   * Attributes
   */

  interface AttributeInterface {
    trait_type: string;
    value: string;
    display_type: string;
  }

  interface AttributesInterface extends Array<AttributeInterface> {}
}
