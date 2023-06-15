export {};

export enum UserError {
  INVALID_SIGNATURE = 'invalid signature',
  JWT_TOKEN_EXPIRED = 'jwt expired',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  USER_INVALID_LOGIN = 'USER_INVALID_LOGIN',
  USER_DOES_NOT_EXISTS = 'USER_DOES_NOT_EXISTS',
}

/**
 * Lib error codes
 */
/**
 * Bad request error codes - 40000000.
 */
export enum LibBadRequestErrorCode {
  BAD_REQUEST = 40000000,
  INVALID_PATH = 40000001,
  INVALID_QUERY_PARAMETERS = 40000002,
  MISSING_AUTHORIZATION_HEADER = 40000003,
}

/**
 * Unauthorized error codes - 401000.
 */
export enum LibUnauthorizedErrorCodes {
  UNAUTHORIZED = 40100000,
  INVALID_TOKEN = 40100000,
}

export enum LibForbiddenErrorCodes {
  FORBIDDEN = 40300000,
}

/**
 * Validation error codes - 42200000.
 */
export enum LibValidatorErrorCode {
  DEFAULT_VALIDATOR_ERROR_CODE = 42200000,
  BUCKET_PROJECT_UUID_NOT_PRESENT = 42200001,
  BUCKET_STORAGE_PLAN_ID_NOT_PRESENT = 42200002,
  BUCKET_NAME_NOT_PRESENT = 42200003,
  DIRECTORY_BUCKET_ID_NOT_PRESENT = 42200004,
  DIRECTORY_NAME_NOT_PRESENT = 42200005,
  BUCKET_UUID_NOT_PRESENT = 42200006,
  PATH_NOT_PRESENT = 42200007,
  FILE_NAME_NOT_PRESENT = 42200008,
  CONTENT_TYPE_NOT_PRESENT = 42200009,
  SESSION_UUID_NOT_PRESENT = 42200010,
  BUCKET_TYPE_NOT_PRESENT = 42200011,
  CREATE_API_KEY_PROJECT_UUID_NOT_PRESENT = 42200012,
  PROJECT_UUID_QUERY_PARAM_NOT_PRESENT = 42200013,
  API_KEY_ROLE_API_KEY_ID_NOT_PRESENT = 42200014,
  API_KEY_ROLE_ROLE_ID_NOT_PRESENT = 42200015,
  API_KEY_ROLE_PROJECT_UUID_NOT_PRESENT = 42200016,
  API_KEY_ROLE_SERVICE_UUID_NOT_PRESENT = 42200017,
  API_KEY_ROLE_ROLE_ID_NOT_VALID = 42200018,
}

/**
 * System Error codes - 500000.
 */
export enum LibErrorCode {
  STATUS_NOT_PRESENT = 42200100,
  INVALID_STATUS = 42200101,
  ERROR_WRITING_TO_DATABASE = 50000001,
  ERROR_READING_FROM_DATABASE = 50000002,
  SERVICE_ERROR = 50000100,
}

/**
 * System Error codes - 500000.
 */
export enum LibSystemErrorCode {
  DEFAULT_SYSTEM_ERROR = 500000,
  UNHANDLED_SYSTEM_ERROR = 500001,
  SQL_SYSTEM_ERROR = 500002,
  AWS_SYSTEM_ERROR = 500003,
  MICROSERVICE_SYSTEM_ERROR = 500004,
}

/**
 * Dev console API
 */
/**
 * Validation error codes - 42204000.
 */
export enum DevConsoleerror {
  DEFAULT_VALIDATION_ERROR = 42204000,
  TOKEN_NOT_PRESENT = 42204001,
  USER_UUID_NOT_PRESENT = 42204102,
  USER_EMAIL_NOT_PRESENT = 42204103,
  USER_EMAIL_NOT_VALID = 42204104,
  USER_EMAIL_ALREADY_TAKEN = 42204105,
  USER_PASSWORD_NOT_PRESENT = 42204106,
  USER_INVALID_LOGIN = 42204107,
  PROJECT_NAME_NOT_PRESENT = 42204201,
  PROJECT_UUID_NOT_PRESENT = 42204202,
  PROJECT_ID_NOT_PRESENT = 42204203,
  SERVICE_NAME_NOT_PRESENT = 42204301,
  SERVICE_TYPE_NOT_PRESENT = 42204302,
  SERVICE_UUID_NOT_PRESENT = 42204303,
  SERVICE_PROJECT_ID_NOT_PRESENT = 42204304,
  FILE_NAME_NOT_PRESENT = 42204401,
  FILE_EXTENSION_NOT_PRESENT = 42204402,
  FILE_CONTENT_TYPE_NOT_PRESENT = 42204403,
  FILE_VERSION_NOT_PRESENT = 42204404,
  FILE_BODY_NOT_PRESENT = 42204405,
  INSTRUCTION_NAME_NOT_PRESENT = 42204501,
  INSTRUCTION_ENUM_NOT_PRESENT = 42204502,
  INSTRUCTION_FORROUTE_NOT_PRESENT = 42204503,
  INSTRUCTION_ENUM_EXISTS = 42204504,
  INSTRUCTION_TYPE_NOT_PRESENT = 42204505,
  INSTRUCTION_HTML_CONTENT_NOT_PRESENT = 42204506,
  PROJECT_USER_USER_ID_NOT_PRESENT = 42204601,
  PROJECT_USER_PROJECT_ID_NOT_PRESENT = 42204602,
  PROJECT_USER_ACTION_NOT_PRESENT = 42204603,
  PROJECT_USER_INVALID_ACTION = 42204604,
  PROJECT_USER_RELATION_EXISTS = 42204605,
  PROJECT_USER_EMAIL_NOT_PRESENT = 42204606,
  PROJECT_USER_ROLE_ID_NOT_PRESENT = 42204607,
  PROJECT_USER_ROLE_ID_NOT_VALID = 42204608,
  UPDATE_ROLE_ON_PROJECT_ROLE_ID_NOT_PRESENT = 42204611,
}

/**
 * Resource not found error codes - 40404000.
 */
export enum DevConsoleResourceNotFoundErrorCode {
  DEFAULT_RESOURCE_NOT_FOUND_ERROR = 40404000,
  USER_DOES_NOT_EXISTS = 40404001,
  PROJECT_DOES_NOT_EXISTS = 40404002,
  SERVICE_DOES_NOT_EXIST = 40404003,
  FILE_DOES_NOT_EXISTS = 40404004,
  FILE_DOES_NOT_EXISTS_IN_BUCKET = 40404005,
  INSTRUCTION_DOES_NOT_EXIST = 40404006,
  PROJECT_USER_DOES_NOT_EXIST = 40404007,
  USER_EMAIL_NOT_EXISTS = 40404008,
}

/**
 * Conflict error codes - 40904000.
 */
export enum DevConsoleConflictErrorCode {
  DEFAULT_CONFLICT_ERROR = 40904000,
  USER_ALREADY_ON_PROJECT = 40904001,
}

/**
 * Bad request error codes - 40004000.
 */
export enum DevConsoleBadRequestErrorCode {
  DEFAULT_BAD_REQUEST_ERROR = 40004000,
  CANNOT_MODIFY_PROJECT_OWNER = 40004001,
  ROLE_ON_PROJECT_ALREADY_ASSIGNED = 40004002,
}

/**
 * Apillon API
 */
/**
 * Validation error codes - 42205000.
 */
export enum ApillonValidatorErrorCode {
  DEFAULT_VALIDATION_ERROR = 42205000,
}

/**
 * Resource not found error codes - 404000.
 */
export enum ApillonResourceNotFoundErrorCode {
  DEFAULT_RESOURCE_NOT_FOUND_ERROR = 40405000,
}

/**
 * Authorization API
 */
/**
 * Validation error codes - 42207000.
 */
export enum AuthValidatorErrorCode {
  DEFAULT_VALIDATION_ERROR = 42207000,
}

/**
 * Resource not found error codes - 40407000.
 */
export enum AuthResourceNotFoundErrorCode {
  DEFAULT_RESOURCE_NOT_FOUND_ERROR = 40407000,
}

declare global {
  interface EntityErrorMessageInterface {
    message: string;
    property: string;
    statusCode: number;
  }

  interface ApiError {
    errors?: Array<EntityErrorMessageInterface>;
    code?: number;
    status?: number;
    message?: string;
    path?: string;
    timestamp?: string;
  }
}
