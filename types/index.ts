import {
  Composer,
  ComposerTranslation,
  UseI18nOptions,
} from '@nuxtjs/i18n/dist/runtime/composables';

export {};

declare global {
  interface Window {
    $message: NMessageApiInjection;
  }

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
  type i18nT = ComposerTranslation;

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
