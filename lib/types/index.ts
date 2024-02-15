import {
  Composer,
  ComposerTranslation,
  UseI18nOptions,
} from '@nuxtjs/i18n/dist/runtime/composables';
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';

export {};

declare global {
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
    $message: MessageApiInjection;
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
  type SuccessResponse = GeneralResponse<{ success: boolean }>;

  interface DeleteResponse {
    data: boolean;
    status: number;
  }

  type FetchParams = {
    page?: number;
    limit?: number;
    search?: string;
    orderBy?: string;
    order?: string;
    loader?: boolean;
  };
}
