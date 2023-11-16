import queryString from 'query-string';
import { getAppConfig } from './utils';

export const APISettings = {
  headers: new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }),
  basePath: removeLastSlash(getAppConfig().apiUrl),
};

class Api {
  async post<T>(path: string, data?: any) {
    const response = await fetch(
      APISettings.basePath + path,
      this.onRequest({
        method: 'POST',
        body: data ? JSON.stringify(data) : null,
      })
    );
    return this.onResponse<T>(response);
  }

  async get<T>(
    path: string,
    query?: { [k: string]: string | number | Array<string | number> },
    requestOptions?: RequestInit
  ) {
    const q = !query ? '' : '?' + queryString.stringify(query, { arrayFormat: 'bracket' });
    const requestData = { method: 'GET', query: q };

    const response = await fetch(
      APISettings.basePath + path + q,
      this.onRequest(requestData, requestOptions)
    );
    return this.onResponse<T>(response);
  }

  async put<T>(path: string, data?: any) {
    const response = await fetch(
      APISettings.basePath + path,
      this.onRequest({
        method: 'PUT',
        body: data ? JSON.stringify(data) : null,
      })
    );
    return this.onResponse<T>(response);
  }

  async patch<T>(path: string, data?: any) {
    const response = await fetch(
      APISettings.basePath + path,
      this.onRequest({
        method: 'PATCH',
        body: data ? JSON.stringify(data) : null,
      })
    );
    return this.onResponse<T>(response);
  }

  async delete<T>(path: string, data?: any) {
    const response = await fetch(
      APISettings.basePath + path,
      this.onRequest({
        method: 'DELETE',
        body: data ? JSON.stringify(data) : null,
        headers: APISettings.headers,
      })
    );
    return this.onResponse<T>(response);
  }

  setBaseUrl(baseUrl: string) {
    APISettings.basePath = baseUrl;
  }

  setToken(token: string) {
    APISettings.headers.set('Authorization', 'Bearer ' + token);
  }

  clearToken() {
    APISettings.headers.delete('Authorization');
  }

  backToLogin() {
    const authStore = useAuthStore();
    authStore.logout();
    const router = useRouter();
    router.push({ name: 'login' });
  }

  preventForbiddenAccess() {
    const router = useRouter();
    router.push({ name: 'dashboard-error' });
  }

  onRequest(request: Request | any, requestOptions: RequestInit = {}) {
    const modifiedRequest = { ...request, ...requestOptions };

    modifiedRequest.headers = APISettings.headers;

    return modifiedRequest;
  }

  async onResponse<T>(response: Response) {
    if (response.status > 250) {
      const error: ApiError = await response.json();

      if (!error.code) {
        error.code = response.status;
      }

      /** Unauthorized or session expired */
      if (
        (response.status === 401 && error.message !== UserError.USER_INVALID_LOGIN) ||
        (response.status === 401 && error.message === UserError.AUTH_TOKEN_EXPIRED) ||
        (response.status === 500 && error.message === UserError.AUTH_TOKEN_EXPIRED) ||
        (response.status === 500 && error.message === UserError.INVALID_SIGNATURE) ||
        (response.status === 500 && error.message === UserError.JWT_TOKEN_EXPIRED) ||
        (response.status === 400 && error.message === UserError.USER_DOES_NOT_EXISTS)
      ) {
        setTimeout(() => {
          this.backToLogin();
        }, 2000);
      } else if (response.status === 403) {
        this.preventForbiddenAccess();
      }

      throw error;
    }

    return (await response.json()) as T;
  }
}

export const $api = new Api();
