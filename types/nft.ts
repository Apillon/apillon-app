export {};

declare global {
  /**
   * Collection
   */
  interface FormCollection {
    name: string;
    description: string;
  }

  interface CollectionInterface {}

  interface CollectionResponse extends GeneralResponse<CollectionInterface> {}
  interface CollectionUpdateResponse extends GeneralResponse<CollectionInterface> {}
  interface CollectionsResponse extends GeneralItemsResponse<CollectionInterface> {}
  interface CollectionQuotaResponse extends GeneralResponse<boolean> {}
}
