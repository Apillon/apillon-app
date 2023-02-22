/** Hosting Collection status */
export enum CollectionStatus {
  INITIATED = 0,
  IN_PROGRESS = 1,
  SUCCESSFUL = 5,
  FAILED = 100,
}

declare global {
  /**
   * Collection
   */
  interface FormCollection {
    symbol: string;
    name: string;
    mintPrice: number;
    maxSupply: number;
    description?: string;
  }

  interface CollectionInterface {
    id: number;
    status: number;
    collection_uuid: string;
    symbol: string;
    name: string;
    description: string;
    maxSupply: number;
    mintPrice: number;
    bucket_uuid: string;
    baseUri: string | null;
    contractAddress: string | null;
    transactionHash: string | null;
    updateTime: string;
  }

  interface CollectionResponse extends GeneralResponse<CollectionInterface> {}
  interface CollectionUpdateResponse extends GeneralResponse<CollectionInterface> {}
  interface CollectionsResponse extends GeneralItemsResponse<CollectionInterface> {}
  interface CollectionQuotaResponse extends GeneralResponse<boolean> {}
}
