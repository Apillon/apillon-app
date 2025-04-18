import type { Address } from 'viem';

export type Merge<T, K> = Omit<T, keyof K> & K;

export enum ChainType {
  SUBSTRATE = 1,
  EVM = 2,
}

export enum NftWebsiteType {
  PLAIN_JS = 1,
  REACT = 2,
  VUE = 3,
}

/** NFT Chains */
export enum EvmChainMainnet {
  ETHEREUM = 1,
  MOONBEAM = 1284,
  ASTAR = 592,
  // OASIS = 42262,
  CELO = 42220,
  BASE = 8453,
  ARBITRUM_ONE = 42161,
  AVALANCHE = 43114,
  OPTIMISM = 10,
  POLYGON = 137,
}
export enum EvmChainTestnet {
  SEPOLIA = 11155111,
  MOONBASE = 1287,
  // ASTAR_SHIBUYA = 81, // testnet
  // OASIS_SAPPHIRE = 23294,
  ALFAJORES = 44787, // Celo testnet
  BASE_SEPOLIA = 84532,
  ARBITRUM_ONE_SEPOLIA = 421614,
  AVALANCHE_FUJI = 43113,
  OPTIMISM_SEPOLIA = 11155420,
  POLYGON_AMOY = 80002,
}

export const EvmChain = mergeObjects(EvmChainMainnet, EvmChainTestnet);

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

/** NFT Transaction status */
export enum TransactionStatus {
  PENDING = 1,
  CONFIRMED = 2,
  FAILED = 3,
  ERROR = 4,
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
  ATTRIBUTES = 4,
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
    adminAddress: string | null;
    baseExtension: string;
    baseUri: string;
    bucket_uuid: string;
    chain: number;
    chainType: number;
    cid: string;
    collectionType: number;
    collectionStatus: number;
    collection_uuid: string;
    contractAddress: Address | null;
    dropStart: number;
    drop: boolean;
    ipns_uuid: string;
    isRevokable: boolean;
    isSoulbound: boolean;
    isAutoIncrement: boolean;
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
    websiteUuid: string | null;
  }

  interface CollectionResponse extends GeneralResponse<CollectionInterface> {}
  interface CollectionUpdateResponse extends GeneralResponse<CollectionInterface> {}
  interface CollectionsResponse extends GeneralItemsResponse<CollectionInterface> {}

  interface WebsiteDeployForm {
    apiKey: string;
    apiSecret: string;
    type: NftWebsiteType;
  }

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

  interface MintInterface {
    success: boolean;
    transactionHash: string | null;
  }
  interface MintResponse extends GeneralResponse<MintInterface> {}

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
