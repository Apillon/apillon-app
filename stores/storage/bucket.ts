import { defineStore } from 'pinia';

export const useBucketStore = defineStore('bucket', {
  state: () => ({
    allowFetch: true,
    active: {} as BucketInterface,
    destroyed: [] as BucketInterface[],
    items: [] as BucketInterface[],
    loading: false,
    selected: '',
    selectedItems: [] as BucketInterface[],
    total: 0,
    uploadActive: false,
    uploadFileList: [] as FileListItemType[],
    filter: {
      bucketType: null,
      search: '',
    },
    folder: {
      allowFetch: true,
      items: [] as BucketItemInterface[],
      loading: false,
      path: [] as Array<{ uuid: string; name: string }>,
      search: '',
      selected: '',
      selectedItems: [] as BucketItemInterface[],
      total: 0,
    },
  }),
  getters: {
    bucketUuid(state): string {
      return (
        state.active?.bucket_uuid ||
        (
          state.items.find((item: BucketInterface) => item.bucket_uuid === state.selected) ||
          ({} as BucketInterface)
        )?.bucket_uuid ||
        ''
      );
    },
    currentBucket(state): BucketInterface {
      return (
        state.items.find((item: BucketInterface) => item.bucket_uuid === state.selected) ||
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
        !!state.folder.selected ||
        state.folder.loading ||
        state.folder.search.length > 0
      );
    },
    hasDestroyedBuckets(state): boolean {
      return Array.isArray(state.destroyed) && state.destroyed.length > 0;
    },
    hasSelectedBucket(state): boolean {
      return state.items.some((bucket: BucketInterface) => bucket.bucket_uuid === state.selected);
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
      this.destroyed = [] as BucketInterface[];
      this.items = [] as BucketInterface[];
      this.filter.bucketType = null;
      this.filter.search = '';
      this.selected = '';
      this.total = 0;

      /** File/folder */
      this.resetFolder();

      /** Upload files to storage reset */
      this.resetUpload();
    },
    resetFolder() {
      this.folder.allowFetch = true;
      this.folder.items = [] as BucketItemInterface[];
      this.folder.loading = false;
      this.folder.path = [];
      this.folder.search = '';
      this.folder.selected = '';
      this.folder.selectedItems = [] as BucketItemInterface[];
      this.folder.total = 0;
    },
    resetUpload() {
      this.uploadActive = false;
      this.uploadFileList = [] as FileListItemType[];
    },

    setBucket(uuid: string) {
      if (this.selected !== uuid) {
        this.selected = uuid;
        this.uploadFileList = [] as FileListItemType[];
        this.folder.items = [] as BucketItemInterface[];
        this.folder.total = 0;
        this.folder.path = [];
        this.folder.selected = '';
        this.folderSearch();

        const ipnsStore = useIpnsStore();
        ipnsStore.resetData();
      }
    },

    folderSearch(search = '', fetch = false) {
      this.folder.allowFetch = fetch;
      this.folder.search = search;

      if (!fetch) {
        setTimeout(() => (this.folder.allowFetch = true), 1000);
      }
    },

    /**
     * Fetch wrappers
     */
    async getBuckets(statusDestroyed = false) {
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
    async getBucket(bucketUuid: string): Promise<BucketInterface> {
      if (this.active?.bucket_uuid !== bucketUuid || isCacheExpired(LsCacheKeys.BUCKET)) {
        return await this.fetchBucket(bucketUuid);
      }
      const bucket = this.items.find(item => item.bucket_uuid === bucketUuid);
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
    async fetchBuckets(statusDeleted = false) {
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }
      this.loading = true;

      try {
        const params: Record<string, string | number> = {
          project_uuid: dataStore.projectUuid,
          orderBy: 'createTime',
          desc: 'true',
          ...PARAMS_ALL_ITEMS,
        };
        if (statusDeleted) {
          params.status = 8;
        }
        const req = $api.get<BucketsResponse>(endpoints.buckets, params);
        dataStore.promises.buckets = req;
        const res = await req;

        if (statusDeleted) {
          this.destroyed = res.data.items;
        } else {
          this.items = res.data.items;
        }
        this.total = res.data.total;
        this.loading = false;
        this.filter.bucketType = null;
        this.filter.search = '';

        /** Save timestamp to SS */
        const cacheKey = statusDeleted ? LsCacheKeys.BUCKET_DESTROYED : LsCacheKeys.BUCKETS;
        sessionStorage.setItem(cacheKey, Date.now().toString());

        return res;
      } catch (error: any) {
        /** Clear promise */
        dataStore.promises.buckets = null;

        if (statusDeleted) {
          this.items = [] as BucketInterface[];
        } else {
          this.items = [] as BucketInterface[];
        }
        this.total = 0;
        this.loading = false;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },

    async fetchBucket(bucketUuid: string): Promise<BucketInterface> {
      try {
        const res = await $api.get<BucketResponse>(endpoints.bucket(bucketUuid));

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

    async fetchDirectoryContent(arg: FetchDirectoryParams = {}) {
      this.folder.loading = arg.loader !== undefined ? arg.loader : true;

      /** Fallback for bucketUuid */
      const bucket = arg.bucketUuid || this.bucketUuid;
      if (!bucket) {
        this.folder.loading = false;
        return;
      }

      /** Update current folderUuid */
      if (arg.folderUuid) {
        this.folder.selected = arg.folderUuid;
      }

      try {
        /** If subfolder is selected, search directory content in this subfolder */
        const params: Record<string, string | number> = {
          bucket_uuid: bucket,
        };

        /** Add additional parameters */
        if (this.folder.selected) {
          params.directory_uuid = this.folder.selected;
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
