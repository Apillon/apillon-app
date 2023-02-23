/** Hosting Collection status */
export enum CollectionStatus {
  PENDING = 0,
  DEPLOYED = 1,
  TRANSFERED = 2,
}

declare global {
  /**
   * Collection
   */
  interface FormCollection {
    symbol: string;
    name: string;
    mintPrice: number;
    maxSupply?: number | null;
    baseUri: string;
    baseExtension: string;
    isDrop: boolean;
    dropStart?: boolean;
    reserve?: boolean;
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
    dropStart: boolean;
    id: number;
    isDrop: boolean;
    isRevokable: boolean;
    isSoulbound: boolean;
    maxSupply: number;
    mintPrice: number;
    name: string;
    reserve: boolean;
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
}
