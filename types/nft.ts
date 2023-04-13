/** NFT Chains */
export enum Chains {
  MOONBEAM = 1,
  MOONBASE = 2,
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
  BEHAVIOUR = 2,
  DEPLOY = 3,
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
  }

  interface FormCollectionBehaviour {
    baseExtension: string;
    dropStart?: number;
    isDrop: boolean;
    maxSupply?: number | null;
    mintPrice?: number;
    reserve?: number;
    revocable?: number | null;
    soulbound?: number | null;
    supplyLimited?: number;
  }
  interface FormCollection extends FormCollectionName, FormCollectionBehaviour {
    baseUri: string;
    description?: string;
  }

  interface CollectionInterface {
    baseExtension: string;
    baseUri: string;
    bucket_uuid: string;
    collectionStatus: number;
    collection_uuid: string;
    contractAddress: string | null;
    description: string;
    dropStart: number;
    id: number;
    isDrop: boolean;
    isRevokable: boolean;
    isSoulbound: boolean;
    maxSupply: number;
    mintPrice: number;
    minted: number;
    name: string;
    reserve: number;
    royaltiesAddress: string;
    royaltiesFees: number;
    status: number;
    symbol: string;
    transactionHash: string | null;
    updateTime: string;
  }

  interface CollectionResponse extends GeneralResponse<CollectionInterface> {}
  interface CollectionUpdateResponse extends GeneralResponse<CollectionInterface> {}
  interface CollectionsResponse extends GeneralItemsResponse<CollectionInterface> {}
  interface CollectionQuotaResponse extends GeneralResponse<boolean> {}

  /**
   * NFT
   */
  interface FormNftMint {
    receivingAddress: string;
    quantity: number | null;
  }
  interface FormNftTransfer {
    address: string;
  }
  interface TransactionInterface {
    chainId: number;
    id: number;
    status: number;
    transactionHash: string | null;
    transactionStatus: number;
    transactionType: number;
    updateTime: string;
  }

  interface TransactionResponse extends GeneralItemsResponse<TransactionInterface> {}
}
