export {};

declare global {
  interface Window {
    $message: any;
  }

  /**
   * Base responses
   */
  type GeneralResponse<T> = {
    data: T;
    status: number;
  };
  type GeneralItemsResponse<T> = {
    data: {
      items: Array<T>;
      total: number;
    };
    status: number;
  };
  interface DeleteResponse {
    data: boolean;
    status: number;
  }
}
