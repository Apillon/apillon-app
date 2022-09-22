import { mande } from 'mande';
import { stringify } from 'query-string';
import { getAppConfig, removeLastSlash } from './utils';

const conn = mande(removeLastSlash(getAppConfig().apiUrl));

export const $api = {
  async get(path: string, query: { [k: string]: string | number | Array<string | number> }) {
    try {
      const q = !query ? '' : '?' + stringify(query, { arrayFormat: 'bracket' });
      await conn.get(path + q);
    } catch (e) {
      console.error(e);
    }
  },

  async post(path: string, data: any) {
    try {
      await conn.post(path, data);
    } catch (e) {
      console.error(e);
    }
  },

  async put(path: string, data: any) {
    try {
      await conn.put(path, data);
    } catch (e) {
      console.error(e);
    }
  },

  async delete(path: string) {
    try {
      await conn.delete(path);
    } catch (e) {
      console.error(e);
    }
  },

  setToken(token: string) {
    conn.options.headers.Authorization = `Bearer ${token}`;
  },

  clearToken() {
    delete conn.options.headers.Authorization;
  },
};
