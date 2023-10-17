import {
  Composer,
  ComposerTranslation,
  UseI18nOptions,
} from '@nuxtjs/i18n/dist/runtime/composables';

import { PropType } from 'nuxt/dist/app/compat/capi';

export {};

declare global {
  type VuePropType<T> = PropType<T>;

  type KeyValue = {
    key: string | number;
    value: string | number;
  };

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
   * Window
   */
  interface Window {
    $message: NMessageApiInjection;
    $i18n: i18nType;
    _paq: Array<String[]>;
  }

  /**
   * General Interfaces
   */
  interface GeneralInterface {
    status: number;
  }
  interface BaseObjectInterface extends GeneralInterface {
    name: string;
    description: string | null;
    createTime: string;
    updateTime: string;
  }

  /**
   * Base responses
   */
  type GeneralResponse<T> = {
    data: T;
    id: string;
    status: number;
  };
  type GeneralItemsResponse<T> = {
    data: {
      items: Array<T>;
      total: number;
    };
    id: string;
    status: number;
  };
  interface DeleteResponse {
    data: boolean;
    status: number;
  }
}
