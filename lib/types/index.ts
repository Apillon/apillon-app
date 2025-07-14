import type { Composer, ComposerTranslation, UseI18nOptions } from '@nuxtjs/i18n/dist/runtime/composables';
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';

export enum SqlModelStatus {
  DRAFT = 1,
  INCOMPLETE = 2,
  INACTIVE = 3,
  ACTIVE = 5,
  BLOCKED = 7,
  ARCHIVED = 8,
  DELETED = 9,
  REFUNDED = 100,
}

/**
 * Service Status Type Enum { Info, Error, Warning }
 */
export enum ServiceStatusType {
  INFO = 1,
  ERROR = 2,
  WARNING = 3,
}

declare global {
  type Optional<T> = null | T;

  type KeyValue = {
    key: string | number;
    value: string | number;
  };
  type EnvVar = {
    key: string | number;
    value?: string | number | null;
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
    _paq: Array<string[]>;
  }

  /**
   * General Interfaces
   */
  interface GeneralInterface {
    id: number;
    status: number;
  }
  interface BaseObjectInterface extends GeneralInterface {
    name: string;
    description: string | null;
    createTime: string;
    updateTime: string | null;
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
      page: number;
      limit: number;
    };
    id: string;
    status: number;
  };
  type BooleanResponse = GeneralResponse<boolean>;
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
    project_uuid?: string;
    status?: SqlModelStatus;
  };

  interface ServiceStatusInterface {
    id: number;
    message: string;
    status: number;
    type: number;
    url: string | null;
  }

  interface ServiceStatusResponse extends GeneralResponse<ServiceStatusInterface> {}
  interface ServiceStatusesResponse extends GeneralItemsResponse<ServiceStatusInterface> {}
}
