/** NFT Chains */
export enum Chains {
  MOONBEAM = 1284,
  MOONBASE = 1287,
  ASTAR_SHIBUYA = 81, // testnet
  ASTAR = 592,
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

/** Mint steps */
export enum NftMintTab {
  METADATA = 1,
  UPLOAD = 2,
  IMAGES = 3,
  MINT = 4,
}
export enum NftUploadStep {
  FILE = 1,
  IMAGES = 2,
  PREVIEW = 3,
}
export enum NftDeployStep {
  NAME = 1,
  BEHAVIOR = 2,
  DEPLOY = 3,
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
  interface FormCollectionName {
    symbol: string;
    name: string;
    chain?: number;
    collectionType?: number;
  }

  interface FormCollectionBehavior {
    baseExtension: string | null;
    dropStart?: number;
    drop: boolean;
    maxSupply?: number | null;
    dropPrice?: number;
    dropReserve?: number;
    revocable?: boolean | null;
    soulbound?: boolean | null;
    supplyLimited?: number;
    royaltiesAddress?: string;
    royaltiesFees?: number;
  }
  interface FormCollection extends FormCollectionName, FormCollectionBehavior {
    baseUri: string | null;
    description?: string;
  }

  interface CollectionInterface extends BaseObjectInterface {
    baseExtension: string;
    baseUri: string;
    bucket_uuid: string;
    chain: number;
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
   * NFT
   */
  interface FormNftMint {
    receivingAddress: string;
    quantity: number | null;
  }
  interface FormNftNestMint {
    parentCollectionUuid: string | null;
    parentNftId: number | null;
    quantity: number | null;
  }
  interface FormNftBurn {
    collectionUuid: string;
    tokenId: number | null;
  }
  interface FormNftTransfer {
    address: string;
  }
  interface TransactionInterface {
    id: number;
    status: number;
    chainId: number;
    transactionType: number;
    refTable: string;
    refId: number;
    transactionStatus: number;
    transactionHash: string | null;
  }

  interface TransactionResponse extends GeneralItemsResponse<TransactionInterface> {}
}
