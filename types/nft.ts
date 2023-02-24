/** NFT Collection status */
export enum CollectionStatus {
  PENDING = 0,
  DEPLOYED = 1,
  TRANSFERED = 2,
}

/** NFT Transaction status */
export enum TransactionStatus {
  REQUESTED = 0,
  PENDING = 1,
  FINISHED = 2,
  VERIFIED = 3,
  FAILED = 4,
}

declare global {
  /**
   * Collection
   */
  interface FormCollection {
    symbol: string;
    name: string;
    mintPrice?: number;
    maxSupply?: number | null;
    baseUri: string;
    baseExtension: string;
    isDrop: boolean;
    dropStart?: number;
    reserve?: number;
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
    quantity?: number | null;
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
