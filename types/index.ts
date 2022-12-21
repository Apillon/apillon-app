export {};

declare global {
  interface Window {
    $message: any;
  }

  type Only<T, U> = {
    [P in keyof T]: T[P];
  } & {
    [P in keyof U]?: never;
  };

  type Either<T, U> = Only<T, U> | Only<U, T>;

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
