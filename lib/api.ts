import { useMessage } from 'naive-ui';
import { stringify } from 'query-string';
import { ERROR, ERROR_CODE } from '~~/types/error';

export const APISettings = {
  headers: new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }),
  basePath: '',
};

export interface ApiErrorResponse {
  code?: number;
  message: string;
  path?: string;
  status: number;
  error: any;
  timestamp?: string;
}

export const $api = {
  async post<T>(path: string, data?: any) {
    const response = await fetch(APISettings.basePath + path, {
      method: 'POST',
      headers: APISettings.headers,
      body: data ? JSON.stringify(data) : null,
    });

    if (response.status > 250) {
      const error: ApiErrorResponse = await response.json();
      if (
        error?.code === ERROR_CODE.FORBIDDEN_RESOURCE ||
        error?.message === ERROR.INVALID_SIGNATURE
      ) {
        $api.backToLogin();
        return {
          response,
        };
      } else {
        return {
          error,
          response,
        };
      }
    }

    return {
      response,
      data: (await response.json()) as T,
    };
  },
  async get<T>(
    path: string,
    query?: { [k: string]: string | number | Array<string | number> }
  ): Promise<any> {
    const q = !query ? '' : '?' + stringify(query, { arrayFormat: 'bracket' });
    const response = await fetch(APISettings.basePath + path + q, {
      method: 'GET',
      headers: APISettings.headers,
    });
    if (response.status > 250) {
      const error: ApiErrorResponse = await response.json();
      if (
        error?.code === ERROR_CODE.FORBIDDEN_RESOURCE ||
        error?.message === ERROR.INVALID_SIGNATURE
      ) {
        $api.backToLogin();
        return {
          response,
        };
      } else {
        return {
          error,
          response,
        };
      }
    }

    return {
      response,
      data: (await response.json()) as T,
    };
  },

  async put<T>(path: string, data?: any) {
    const response = await fetch(APISettings.basePath + path, {
      method: 'PUT',
      headers: APISettings.headers,
      body: data ? JSON.stringify(data) : null,
    });
    if (response.status > 250) {
      const error: ApiErrorResponse = await response.json();
      if (
        error?.code === ERROR_CODE.FORBIDDEN_RESOURCE ||
        error?.message === ERROR.INVALID_SIGNATURE
      ) {
        $api.backToLogin();
        return {
          response,
        };
      } else {
        return {
          error,
          response,
        };
      }
    }

    return {
      response,
      data: (await response.json()) as T,
    };
  },

  async patch<T>(path: string, data?: any) {
    const response = await fetch(APISettings.basePath + path, {
      method: 'PATCH',
      headers: APISettings.headers,
      body: data ? JSON.stringify(data) : null,
    });
    if (response.status > 250) {
      const error: ApiErrorResponse = await response.json();
      if (
        error?.code === ERROR_CODE.FORBIDDEN_RESOURCE ||
        error?.message === ERROR.INVALID_SIGNATURE
      ) {
        $api.backToLogin();
        return {
          response,
        };
      } else {
        return {
          error,
          response,
        };
      }
    }

    return {
      response,
      data: (await response.json()) as T,
    };
  },

  async delete(path: string) {
    const response = await fetch(APISettings.basePath + path, {
      method: 'DELETE',
      headers: APISettings.headers,
    });
    if (response.status > 250) {
      const error: ApiErrorResponse = await response.json();
      if (
        error?.code === ERROR_CODE.FORBIDDEN_RESOURCE ||
        error?.message === ERROR.INVALID_SIGNATURE
      ) {
        $api.backToLogin();
        return {
          response,
        };
      } else {
        return {
          error,
          response,
        };
      }
    }

    return {
      response,
    };
  },

  setBaseUrl(baseUrl: string) {
    APISettings.basePath = baseUrl;
  },

  setToken(token: string) {
    APISettings.headers.set('Authorization', 'Bearer ' + token);
  },

  clearToken() {
    APISettings.headers.delete('Authorization');
  },

  backToLogin() {
    const router = useRouter();

    const authStore = useAuthStore();
    authStore.logout();

    // const { $alert } = useAlerts();
    // await $alert.error({
    //   title: 'Your login token has expired, please login again.',
    // });
    router.push('/login');
  },
};
