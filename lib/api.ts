import { stringify } from 'query-string';
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

  async get<T>(path: string, query?: { [k: string]: string | number | Array<string | number> }) {
    const q = !query ? '' : '?' + stringify(query, { arrayFormat: 'bracket' });
    const response = await fetch(
      APISettings.basePath + path + q,
      this.onRequest({
        method: 'GET',
      })
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

  async delete(path: string) {
    const response = await fetch(
      APISettings.basePath + path,
      this.onRequest({
        method: 'DELETE',
        headers: APISettings.headers,
      })
    );
    return this.onResponse(response);
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

  onRequest(request: Request | any) {
    const modifiedRequest = { ...request };

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
        (response.status === 500 && error.message === UserError.JWT_TOKEN_EXPIRED)
      ) {
        // this.backToLogin();
      } else if (response.status === 403) {
        this.preventForbiddenAccess();
      }

      throw error;
    }

    return (await response.json()) as T;
  }
}

export const $api = new Api();
