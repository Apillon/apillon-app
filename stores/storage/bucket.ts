import { defineStore } from 'pinia';

const dataStore = useDataStore();
const ipnsStore = useIpnsStore();

export const useBucketStore = defineStore('bucket', {
  state: () => ({
    allowFetch: true,
    active: {} as BucketInterface,
    destroyed: [] as Array<BucketInterface>,
    items: [] as Array<BucketInterface>,
    loading: false,
    quotaReached: undefined as Boolean | undefined,
    search: '',
    selected: 0,
    selectedItems: [] as Array<BucketInterface>,
    total: 0,
    uploadActive: false,
    uploadFileList: [] as Array<FileListItemType>,
    folder: {
      allowFetch: true,
      items: [] as Array<BucketItemInterface>,
      loading: false,
      path: [] as Array<{ id: number; name: string }>,
      search: '',
      selected: 0,
      selectedItems: [] as Array<BucketItemInterface>,
      total: 0,
    },
  }),
  getters: {
    bucketUuid(state): string {
      return (
        state.active?.bucket_uuid ||
        (
          state.items.find((item: BucketInterface) => item.id === state.selected) ||
          ({} as BucketInterface)
        )?.bucket_uuid ||
        ''
      );
    },
    currentBucket(state): BucketInterface {
      return (
        state.items.find((item: BucketInterface) => item.id === state.selected) ||
        ({} as BucketInterface)
      );
    },
    hasBuckets(state): boolean {
      if (Array.isArray(state.items) && state.items.length > 0) {
        return state.items.some(
          (bucket: BucketInterface) =>
            bucket.bucketType === BucketType.STORAGE ||
            bucket.bucketType === BucketType.NFT_METADATA
        );
      }
      return false;
    },
    hasBucketItems(state): boolean {
      return (
        (Array.isArray(state.folder.items) && state.folder.items.length > 0) ||
        state.folder.selected > 0 ||
        state.folder.loading ||
        state.folder.search.length > 0
      );
    },
    hasDestroyedBuckets(state): boolean {
      return Array.isArray(state.destroyed) && state.destroyed.length > 0;
    },
    hasSelectedBucket(state): boolean {
      return state.items.some((bucket: BucketInterface) => bucket.id === state.selected);
    },
    getFolderPath(state) {
      const path = state.folder.path.map(p => p.name).join('/');
      return path ? path + '/' : '';
    },
  },
  actions: {
    resetData() {
      /** Bucket */
      this.active = {} as BucketInterface;
      this.destroyed = [] as Array<BucketInterface>;
      this.items = [] as Array<BucketInterface>;
      this.quotaReached = undefined;
      this.search = '';
      this.selected = 0;
      this.total = 0;
      this.uploadFileList = [] as Array<FileListItemType>;

      /** File/folder */
      this.folder.items = [] as Array<BucketItemInterface>;
      this.folder.path = [];
      this.folder.selected = 0;
    },

    setBucketId(id: number) {
      if (this.selected !== id) {
        this.selected = id;
        this.uploadFileList = [] as Array<FileListItemType>;
        this.folder.items = [] as Array<BucketItemInterface>;
        this.folder.total = 0;
        this.folder.path = [];
        this.folder.selected = 0;
        this.folderSearch();
        ipnsStore.resetData();
      }
    },

    folderSearch(search: string = '', fetch: boolean = false) {
      this.folder.allowFetch = fetch;
      this.folder.search = search;

      if (!fetch) {
        setTimeout(() => (this.folder.allowFetch = true), 1000);
      }
    },

    /**
     * Fetch wrappers
     */
    async getBuckets(statusDestroyed: boolean = false) {
      if (
        (statusDestroyed &&
          (!this.hasDestroyedBuckets || isCacheExpired(LsCacheKeys.BUCKET_DESTROYED))) ||
        !this.hasBuckets ||
        isCacheExpired(LsCacheKeys.BUCKETS)
      ) {
        return await this.fetchBuckets(statusDestroyed);
      }
      return this.items;
    },

    /** Find bucket by ID, if bucket doesn't exists in store, fetch it */
    async getBucket(bucketId: number): Promise<BucketInterface> {
      if (this.active?.id !== bucketId || isCacheExpired(LsCacheKeys.BUCKET)) {
        return await this.fetchBucket(bucketId);
      }
      const bucket = this.items.find(item => item.id === bucketId);
      if (bucket !== undefined && !isCacheExpired(LsCacheKeys.BUCKETS)) {
        return bucket;
      }
      return this.active;
    },

    async getDirectoryContent() {
      if (!this.hasBucketItems || isCacheExpired(LsCacheKeys.BUCKET_ITEMS)) {
        await this.fetchDirectoryContent();
      }
      return this.folder.items;
    },

    /**
     * API calls
     */
    async fetchBuckets(statusDeleted: boolean = false) {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }
      this.loading = true;

      try {
        const params: Record<string, string | number> = {
          project_uuid: dataStore.projectUuid,
          ...PARAMS_ALL_ITEMS,
        };
        if (statusDeleted) {
          params.status = 8;
        }
        const req = $api.get<BucketsResponse>(endpoints.buckets, params);
        dataStore.promises.buckets = req;
        const res = await req;

        const items = res.data.items.map((bucket: BucketInterface) => {
          return addBucketAdditionalData(bucket);
        });

        if (statusDeleted) {
          this.destroyed = items;
        } else {
          this.items = items;
        }
        this.total = res.data.total;
        this.loading = false;
        this.search = '';

        /** Save timestamp to SS */
        const cacheKey = statusDeleted ? LsCacheKeys.BUCKET_DESTROYED : LsCacheKeys.BUCKETS;
        sessionStorage.setItem(cacheKey, Date.now().toString());

        return res;
      } catch (error: any) {
        /** Clear promise */
        dataStore.promises.buckets = null;

        if (statusDeleted) {
          this.items = [] as Array<BucketInterface>;
        } else {
          this.items = [] as Array<BucketInterface>;
        }
        this.total = 0;
        this.loading = false;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },

    async fetchBucket(bucketId: number | string): Promise<BucketInterface> {
      try {
        const res = await $api.get<BucketResponse>(endpoints.bucket(bucketId));

        this.active = addBucketAdditionalData(res.data);

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.BUCKET, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as BucketInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as BucketInterface;
    },

    async fetchBucketQuota() {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }
      const params = {
        project_uuid: dataStore.projectUuid,
        bucketType: BucketType.STORAGE,
      };
      try {
        const res = await $api.get<BucketQuotaResponse>(endpoints.bucketsQuota, params);

        this.quotaReached = res.data;
      } catch (error: any) {
        this.quotaReached = undefined;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    async fetchDirectoryContent(arg: FetchDirectoryParams = {}) {
      this.folder.loading = arg.loader !== undefined ? arg.loader : true;

      /** Fallback for bucketUuid */
      const bucket = arg.bucketUuid || this.bucketUuid;

      /** Update current folderId */
      if (arg.folderId) {
        this.folder.selected = arg.folderId;
      }

      try {
        /** If subfolder is selected, search directory content in this sibfolder */
        const params: Record<string, string | number> = {
          bucket_uuid: bucket,
        };

        /** Add additional parameters */
        if (this.folder.selected > 0) {
          params.directory_id = this.folder.selected;
        }
        if (arg.search) {
          params.search = arg.search;
        }
        if (arg.page) {
          params.page = arg.page;
          params.limit = arg.limit || PAGINATION_LIMIT;
        }
        if (arg.orderBy) {
          params.orderBy = arg.orderBy;
        }
        if (arg.order) {
          params.desc = arg.order === 'descend' ? 'true' : 'false';
        }
        if (arg.markedForDeletion) {
          params.markedForDeletion = arg.markedForDeletion ? 1 : 0;
        }

        const res = await $api.get<FolderResponse>(endpoints.directoryContent, params);

        this.folder.items = res.data.items;
        this.folder.total = res.data.total;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.BUCKET_ITEMS, Date.now().toString());
      } catch (error: any) {
        /** Reset data */
        this.folder.items = [];
        this.folder.total = 0;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }

      this.folder.loading = false;
    },
  },
});
