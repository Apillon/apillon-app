import { defineStore } from 'pinia';
import type { AnyJson } from '@polkadot/types-codec/types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';

export const useFileStore = defineStore('file', {
  state: () => ({
    all: [] as Array<FileUploadSessionInterface>,
    crust: {} as Record<string, AnyJson>,
    currentBlockId: 0,
    items: {} as Record<string, FileInterface>,
    loading: false,
    search: '',
    total: 0,
    trash: {
      items: [] as Array<BucketItemInterface>,
      loading: false,
      search: '',
      pagination: {
        page: 1,
        pageSize: PAGINATION_LIMIT,
        itemCount: 0,
      },
    },
  }),
  getters: {
    hasAllFiles(state): boolean {
      return Array.isArray(state.all) && state.all.length > 0;
    },
    hasDeletedFiles(state): boolean {
      return Array.isArray(state.trash.items) && state.trash.items.length > 0;
    },
  },
  actions: {
    resetData() {
      this.all = [] as Array<FileUploadSessionInterface>;
      this.items = {} as Record<string, FileInterface>;
      this.loading = false;
      this.total = 0;
      this.trash.items = [] as Array<BucketItemInterface>;
      this.trash.pagination.itemCount = 0;
    },

    /**
     * Fetch wrappers
     */
    async getAllFiles() {
      if (!this.hasAllFiles || isCacheExpired(LsCacheKeys.FILE_ALL)) {
        await this.fetchAllFiles();
      }
    },
    async getDeletedFiles(page = 1) {
      if (
        this.trash.pagination.page !== page ||
        !this.hasDeletedFiles ||
        isCacheExpired(LsCacheKeys.FILE_DELETED)
      ) {
        await this.fetchDeletedFiles();
      }
    },
    async getCurrentBlockFromCrust() {
      return this.currentBlockId && this.currentBlockId > 0
        ? this.currentBlockId
        : await this.fetchCurrentBlockFromCrust();
    },

    /**
     * API calls
     */
    async fetchFileInfo(fileId: number) {
      try {
        const res = await $api.get<FolderResponse>(endpoints.file(`${fileId}`));

        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },

    async fetchFileDetails(fileUuidOrCID: string): Promise<FileInterface> {
      const bucketStore = useBucketStore();
      try {
        const url = endpoints.storageFileDetails(bucketStore.bucketUuid, fileUuidOrCID);
        const res = await $api.get<FileDetailsResponse>(url);

        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as FileInterface;
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

    async fetchCurrentBlockFromCrust() {
      const api = new ApiPromise({
        provider: new WsProvider('wss://rpc.crust.network'),
        typesBundle: typesBundleForPolkadot,
      });

      try {
        await api.isReadyOrError;
        const blockId = await api.query.system.number();

        this.currentBlockId = blockId.toJSON() as number;
        await api.disconnect();
        return blockId.toJSON() as number;
      } catch (error) {
        await api.disconnect();
        this.currentBlockId = 0;
      }
      return 0;
    },

    async fetchAllFiles(fileStatus?: number | null, args: FetchParams = {}) {
      const bucketStore = useBucketStore();
      this.loading = args.loader !== undefined ? args.loader : true;

      try {
        const bucketUuid = bucketStore.bucketUuid;

        const params = parseArguments(args);
        params.bucket_uuid = bucketUuid;

        /** Add additional parameters */
        if (fileStatus) {
          params.fileStatus = fileStatus;
          params.sessionStatus = fileStatus;
        }

        const res = await $api.get<FileUploadSessionsResponse>(
          endpoints.storageFileUploadSessions(bucketUuid),
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
    async fetchDeletedFiles(args: FetchParams = {}) {
      const bucketStore = useBucketStore();
      this.trash.loading = true;

      try {
        const params = parseArguments(args);

        const res = await $api.get<FolderResponse>(
          endpoints.storageFilesTrashed(bucketStore.bucketUuid),
          params
        );

        this.trash.items = res.data.items;
        this.trash.pagination.itemCount = res.data.total;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.FILE_DELETED, Date.now().toString());
      } catch (error: any) {
        /** Reset data */
        this.trash.items = [];
        this.trash.pagination.itemCount = 0;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      this.trash.loading = false;
    },
  },
});
