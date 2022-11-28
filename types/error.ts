export {};

declare global {
  interface EntityErrorMessageInterface {
    message: string;
    property: string;
    statusCode: number;
  }

  interface ApiErrorResponse {
    errors?: Array<EntityErrorMessageInterface>;
    code?: number;
    status: number;
    message?: string;
    path?: string;
    timestamp?: string;
  }

  interface ApiOriginalError {
    message: string;
    statusCode?: number;
    code?: number;
    errors?: number[];
  }

  interface ApiError extends Error {
    code: number;
    data: ApiOriginalError;
  }
}
