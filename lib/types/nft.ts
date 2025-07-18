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

/** NFT create collection step */
export enum CollectionCreateStep {
  METADATA = 1,
  SMART_CONTRACT = 2,
  VISUAL = 3,
  REVIEW = 4,
  DEPLOYING = 5,
  DEPLOYED = 6,
}

export enum CollectionFormStep {
  BASE = 1,
  BEHAVIOR = 2,
  ROYALTIES = 3,
  DROP = 4,
}

/** NFT Metadata steps */
export enum NftMetadataStep {
  CHAIN = 1,
  METADATA = 2,
  NEW = 3,
  SINGLE = 4,
  SINGLE_PREVIEW = 5,
  CSV = 6,
  CSV_PREVIEW = 7,
  ENDPOINT = 8,
  ENDPOINT_PREVIEW = 9,
  JSON = 10,
  JSON_PREVIEW = 11,
  DEPLOYING = 99,
  DEPLOYED = 100,
}

/** NFTs metadata field */
export enum MetadataFieldRequired {
  NAME = 'name',
  DESCRIPTION = 'description',
  IMAGE = 'image',
}
export enum MetadataProperties {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
  EXTERNAL_URL = 'external_url',
  IMAGE = 'image',
  IMAGE_DATA = 'image_data',
  ATTRIBUTES = 'attributes',
  BACKGROUND_COLOR = 'background_color',
  ANIMATION_URL = 'animation_url',
  YOUTUBE_URL = 'youtube_url',
}

export enum TraitTypes {
  STRING = 'string',
  DATE = 'date',
  NUMBER = 'number',
  BOOST_NUMBER = 'boost_number',
  BOOST_PERCENTAGE = 'boost_percentage',
}

export enum MetadataDeployStatus {
  UPLOAD_IMAGES_TO_IPFS = 1,
  UPDATE_JSONS_ON_S3 = 2,
  UPLOAD_METADATA_TO_IPFS = 3,
  PUBLISH_TO_IPNS = 4,
  METADATA_SUCCESSFULLY_PREPARED = 10,
}

export type FormSingleNft = {
  image: string;
  id: number;
  collectionUuid: string;
  name: string;
  description: string;
  copies: number;
  attributes: AttributeInterface[];
};

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
    adminAddress: Optional<string>;
    bannerUrl: Optional<string>;
    baseExtension: string;
    baseUri: Optional<string>;
    bucket_uuid: string;
    chain: number;
    chainType: number;
    cid: string;
    collectionType: number;
    collectionStatus: number;
    collection_uuid: string;
    contractAddress: Optional<Address>;
    dropStart: number;
    drop: boolean;
    ipns_uuid: Optional<string>;
    isRevokable: boolean;
    isSoulbound: boolean;
    isAutoIncrement: boolean;
    logoUrl: Optional<string>;
    maxSupply: number;
    dropPrice: number;
    dropReserve: number;
    project_uuid: string;
    royaltiesAddress: Optional<string>;
    royaltiesFees: number;
    symbol: string;
    transactionHash: Optional<string>;
    useApillonIpfsGateway: boolean;
    useIpns: boolean;
    websiteUuid: Optional<string>;
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
    transactionHash: Optional<string>;
    transactionStatus: number;
    transactionType: number;
  }

  interface TransactionResponse extends GeneralItemsResponse<TransactionInterface> {}

  interface MintInterface {
    success: boolean;
    transactionHash: Optional<string>;
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
    lastError: Optional<string>;
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
    display_type: Optional<string>;
  }

  interface AttributesInterface extends Array<AttributeInterface> {}

  type MetadataItem = Record<string | MetadataProperties, string | number> & { attributes?: AttributeInterface[] };
}
