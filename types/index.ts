import { Composer, UseI18nOptions } from 'vue-i18n';

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
   * i18n
   */
  interface Options extends UseI18nOptions {}
  type i18nType = Composer<
    NonNullable<Options['messages']>,
    NonNullable<Options['datetimeFormats']>,
    NonNullable<Options['numberFormats']>,
    NonNullable<Options['locale']>
  >;

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
