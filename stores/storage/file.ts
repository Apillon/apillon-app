import { defineStore } from 'pinia';
import { AnyJson } from '@polkadot/types-codec/types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';

const bucketStore = useBucketStore();

export const useFileStore = defineStore('file', {
  state: () => ({
    all: [] as Array<FileUploadInterface>,
    crust: {} as Record<string, AnyJson>,
    items: {} as Record<string, FileDetailsInterface>,
    loading: false,
    search: '',
    total: 0,
    trash: [] as Array<BucketItemInterface>,
  }),
  getters: {
    hasAllFiles(state): boolean {
      return Array.isArray(state.all) && state.all.length > 0;
    },
    hasDeletedFiles(state): boolean {
      return Array.isArray(state.trash) && state.trash.length > 0;
    },
  },
  actions: {
    resetData() {
      this.all = [] as Array<FileUploadInterface>;
      this.items = {} as Record<string, FileDetailsInterface>;
      this.loading = false;
      this.total = 0;
      this.trash = [] as Array<BucketItemInterface>;
    },

    /**
     * Fetch wrappers
     */
    async getAllFiles() {
      if (!this.hasAllFiles || isCacheExpired(LsCacheKeys.FILE_ALL)) {
        await this.fetchAllFiles();
      }
    },
    async getDeletedFiles() {
      if (!this.hasDeletedFiles || isCacheExpired(LsCacheKeys.FILE_DELETED)) {
        await this.fetchDeletedFiles();
      }
    },

    /**
     * API calls
     */
    async fetchFileInfo(fileId: number) {
      try {
        const res = await $api.get<FolderResponse>(endpoints.file(fileId));

        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },

    async fetchFileDetails(fileUuidOrCID: string): Promise<FileDetailsInterface> {
      try {
        const url = endpoints.storageFileDetails(bucketStore.bucketUuid, fileUuidOrCID);
        const res = await $api.get<FileDetailsResponse>(url);

        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as FileDetailsInterface;
    },

    async fetchFileDetailsFromCrust(cid: string) {
      const api = new ApiPromise({
        provider: new WsProvider('wss://rpc.crust.network'),
        typesBundle: typesBundleForPolkadot,
      });

      await api.isReadyOrError;
      const fileInfo = await api.query.market.filesV2(cid);
      await api.disconnect();
      return fileInfo.toJSON();
    },

    async fetchAllFiles(fileStatus?: number, page?: number, limit?: number) {
      this.loading = true;

      try {
        const bucketUuid = bucketStore.bucketUuid;

        const params: Record<string, string | number> = {
          bucket_uuid: bucketUuid,
        };

        /** Add additional parameters */
        if (this.search) {
          params.search = this.search;
        }
        if (fileStatus) {
          params.fileStatus = fileStatus;
        }
        if (page) {
          params.page = page;
          params.limit = limit || PAGINATION_LIMIT;
        }

        const res = await $api.get<FileUploadsResponse>(
          endpoints.storageFileUploads(bucketUuid),
          params
        );
        this.loading = false;

        this.all = res.data.items;
        this.total = res.data.total;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.FILE_ALL, Date.now().toString());
      } catch (error: any) {
        /** Reset data */
        this.all = [];
        this.total = 0;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
    },

    /** Fetch deleted files */
    async fetchDeletedFiles() {
      this.loading = true;

      try {
        const res = await $api.get<FolderResponse>(
          endpoints.storageFilesTrashed(bucketStore.bucketUuid),
          PARAMS_ALL_ITEMS
        );

        this.trash = res.data.items;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.FILE_DELETED, Date.now().toString());
      } catch (error: any) {
        /** Reset data */
        this.trash = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }

      this.search = '';
      this.loading = false;
    },
  },
});