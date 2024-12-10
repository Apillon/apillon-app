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
export enum EvmChain {
  ETHEREUM = 1,
  SEPOLIA = 11155111,
  MOONBEAM = 1284,
  MOONBASE = 1287,
  ASTAR_SHIBUYA = 81, // testnet
  ASTAR = 592,
  OASIS = 42262,
  ALFAJORES = 44787, // Celo testnet
  CELO = 42220,
}
export enum SubstrateChain {
  CRUST = 1,
  KILT = 2,
  PHALA = 4,
  POLKADOT = 5,
  SUBSOCIAL = 6,
  XSOCIAL = 7,
  ASTAR = 8,
  ACURAST = 9,
  UNIQUE = 11,
  ASSET_HUB = 1000,
  WESTEND_ASSET_HUB = 1001,
}

export enum SubstrateChainPrefix {
  ASTAR = 5,
  PHALA = 30,
  HYDRATION = 63,
  UNIQUE = 7391,
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

export enum PrepareCollectionMetadataStep {
  UPLOAD_IMAGES_TO_IPFS = 1,
  UPDATE_JSONS_ON_S3 = 2,
  UPLOAD_METADATA_TO_IPFS = 3,
  PUBLISH_TO_IPNS = 4,
  METADATA_SUCCESSFULLY_PREPARED = 10,
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
    cid: string;
    collectionType: number;
    collectionStatus: number;
    collection_uuid: string;
    contractAddress: string | null;
    dropStart: number;
    drop: boolean;
    ipns_uuid: string;
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
    useApillonIpfsGateway: boolean;
    useIpns: boolean;
  }

  interface CollectionResponse extends GeneralResponse<CollectionInterface> {}
  interface CollectionUpdateResponse extends GeneralResponse<CollectionInterface> {}
  interface CollectionsResponse extends GeneralItemsResponse<CollectionInterface> {}

  /**
   * Transaction
   */
  interface TransactionInterface extends GeneralInterface {
    chainId: number;
    id: number;
    transactionHash: string | null;
    transactionStatus: number;
    transactionType: number;
  }

  interface TransactionResponse extends GeneralItemsResponse<TransactionInterface> {}

  /**
   * Metadata deploys
   */
  interface MetadataDeployInterface {
    bucket_uuid: string;
    createTime: string;
    currentStep: number;
    imagesSession: string;
    lastError: string | null;
    metadataSession: string;
    updateTime: string;
    useApillonIpfsGateway: number;
  }

  interface MetadataDeploysResponse extends GeneralItemsResponse<MetadataDeployInterface> {}

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
