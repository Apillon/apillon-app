import { stat } from 'fs';
import { defineStore } from 'pinia';
import { AnyJson } from '@polkadot/types-codec/types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { ServiceType, ServiceTypeName, ServiceTypeNames } from '~~/types/service';

export const DataLsKeys = {
  CURRENT_PROJECT_ID: 'al_current_project_id',
  CURRENT_FOLDER_ID: 'al_current_folder_id',
};

export const useDataStore = defineStore('data', {
  state: () => ({
    bucket: {
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
    },
    crust: {} as Record<string, AnyJson>,
    currentProjectId: localStorage.getItem(DataLsKeys.CURRENT_PROJECT_ID)
      ? parseInt(`${localStorage.getItem(DataLsKeys.CURRENT_PROJECT_ID)}`)
      : 0,
    file: {
      items: {} as Record<string, FileDetailsInterface>,
      all: [] as Array<FileUploadInterface>,
      total: 0,
      trash: [] as Array<BucketItemInterface>,
    },
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
    instruction: {} as Record<string, InstructionInterface>,
    instructions: {} as Record<string, Array<InstructionInterface>>,
    project: {
      active: {} as ProjectInterface,
      items: [] as Array<ProjectInterface>,
      selected: 0,
      quotaReached: undefined as Boolean | undefined,
    },
    promises: {
      projects: null as any,
      buckets: null as any,
      webpages: null as any,
    },
    services: {
      authentication: [] as Array<ServiceInterface>,
      storage: [] as Array<ServiceInterface>,
      computing: [] as Array<ServiceInterface>,
    } as Record<ServiceTypeName, Array<ServiceInterface>>,
    webpage: {
      active: {} as WebpageInterface,
      items: [] as Array<WebpageInterface>,
      loading: false,
      search: '',
      selected: 0,
      quotaReached: undefined as Boolean | undefined,
      uploadActive: false,
    },
  }),
  getters: {
    currentProject(state) {
      if (!this.hasProjects) {
        return null;
      }
      /** Return project with currentProjectId, if this ID does not exists, return first project */
      const project = state.project.items.find(project => project.id === state.currentProjectId);
      if (project) {
        return project;
      }
      /** Select first project as fallback if currentProjectId is not available */
      this.currentProjectId = state.project.items[0].id;
      localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, `${this.currentProjectId}`);
      return state.project.items[0];
    },
    hasProjects(state) {
      return Array.isArray(state.project.items) && state.project.items.length > 0;
    },
    myRoleOnProject(state) {
      return state.project.active.myRole_id_onProject || DefaultUserRole.PROJECT_USER;
    },
    bucketUuid(state): string {
      return (
        state.bucket.active.bucket_uuid ||
        (
          state.bucket.items.find((item: BucketInterface) => item.id === state.bucket.selected) ||
          ({} as BucketInterface)
        )?.bucket_uuid ||
        ''
      );
    },
    currentBucket(state): BucketInterface {
      return (
        state.bucket.items.find((item: BucketInterface) => item.id === state.bucket.selected) ||
        ({} as BucketInterface)
      );
    },
    hasBuckets(state): boolean {
      if (Array.isArray(state.bucket.items) && state.bucket.items.length > 0) {
        return (
          state.bucket.items.find(
            (bucket: BucketInterface) => bucket.bucketType === BucketType.STORAGE
          ) !== undefined
        );
      }
      return false;
    },
    hasBucketItems(state): boolean {
      return (
        (Array.isArray(state.folder.items) && state.folder.items.length > 0) ||
        state.folder.selected > 0
      );
    },
    hasDestroyedBuckets(state): boolean {
      return Array.isArray(state.bucket.destroyed) && state.bucket.destroyed.length > 0;
    },
    hasSelectedBucket(state): boolean {
      return (
        state.bucket.items.find(
          (bucket: BucketInterface) => bucket.id === state.bucket.selected
        ) !== undefined
      );
    },
    hasWebpages(state): boolean {
      return Array.isArray(state.webpage.items) && state.webpage.items.length > 0;
    },
    hasWebpageItems(state): boolean {
      return (
        (Array.isArray(state.webpage.items) && state.webpage.items.length > 0) ||
        state.folder.selected > 0
      );
    },
    getFolderPath(state) {
      return state.folder.path.map(p => p.name).join('/') || '';
    },
    hasFileAll(state): boolean {
      return Array.isArray(state.file.all) && state.file.all.length > 0;
    },
    hasDeletedFiles(state): boolean {
      return Array.isArray(state.file.trash) && state.file.trash.length > 0;
    },
  },
  actions: {
    resetData() {
      /** Bucket */
      this.bucket.active = {} as BucketInterface;
      this.bucket.destroyed = [] as Array<BucketInterface>;
      this.bucket.items = [] as Array<BucketInterface>;
      this.bucket.quotaReached = undefined;
      this.bucket.search = '';
      this.bucket.selected = 0;
      this.bucket.total = 0;

      /** File/folder */
      this.file.items = {} as Record<string, FileDetailsInterface>;
      this.folder.items = [] as Array<BucketItemInterface>;

      /** Services */
      this.services.authentication = [] as Array<ServiceInterface>;
      this.services.storage = [] as Array<ServiceInterface>;
      this.services.computing = [] as Array<ServiceInterface>;
    },

    setCurrentProject(id: number) {
      /** Reset store data */
      this.resetData();

      this.currentProjectId = id;
      localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, `${id}`);
    },

    setBucketId(id: number) {
      if (this.bucket.selected !== id) {
        this.file.items = {} as Record<string, FileDetailsInterface>;
        this.folder.items = [] as Array<BucketItemInterface>;
        this.folder.total = 0;
        this.folder.path = [];
        this.folder.selected = 0;
        this.bucket.selected = id;
        this.folderSearch();
      }
    },

    setFolderId(id: number) {
      this.folder.selected = id;
      sessionStorage.setItem(DataLsKeys.CURRENT_FOLDER_ID, `${id}`);
    },

    setWebpageId(id: number) {
      if (this.webpage.selected !== id) {
        this.folder.items = [] as Array<BucketItemInterface>;
        this.folder.total = 0;
        this.folder.path = [];
        this.folder.selected = 0;
        this.webpage.selected = id;
        this.folderSearch();
      }
    },

    updateCurrentProject(project: ProjectInterface) {
      /** Find index of specific object using findIndex method. */
      const projectIndex = this.project.items.findIndex(item => item.id === project.id);

      /** Update current project, add value and label, which are used in header dropdown */
      this.project.items[projectIndex] = {
        ...project,
        value: project.id,
        label: project.name,
      };
    },

    hasServices(type: number) {
      const key: ServiceTypeName = ServiceTypeNames[type];
      return Array.isArray(this.services[key]) && this.services[key].length > 0;
    },

    folderSearch(search: string = '', fetch: boolean = false) {
      this.folder.allowFetch = fetch;
      this.folder.search = search;

      if (!fetch) {
        setTimeout(() => (this.folder.allowFetch = true), 1000);
      }
    },

    onBucketMounted(id: number) {
      this.setBucketId(id);

      if (!this.hasBuckets) {
        Promise.all(Object.values(this.promises)).then(_ => {
          this.promises.buckets = this.fetchBuckets();

          Promise.all(Object.values(this.promises)).then(_ => {
            this.checkIfBucketExistsElseRedirectHome();
          });
        });
      } else {
        this.checkIfBucketExistsElseRedirectHome();
      }
    },
    checkIfBucketExistsElseRedirectHome() {
      if (!this.hasSelectedBucket) {
        const router = useRouter();
        router.push({ name: 'dashboard' });
      }
    },

    hasInstructions(key: string) {
      return (
        key in this.instructions &&
        Array.isArray(this.instructions[key]) &&
        this.instructions[key].length > 0
      );
    },

    /**
     * Fetch wrappers
     */

    /** Services */
    async getAllServices() {
      const services = await this.fetchServices();

      Object.entries(ServiceTypeNames).forEach(([serviceType, typeName]) => {
        this.services[typeName] =
          services.filter(service => service.serviceType_id === parseInt(serviceType)) ||
          ([] as Array<ServiceInterface>);
      });
    },
    async getAuthServices() {
      this.services.authentication = await this.fetchServices(ServiceType.AUTHENTICATION);
    },
    async getStorageServices() {
      this.services.storage = await this.fetchServices(ServiceType.STORAGE);
    },
    async getComputingServices() {
      this.services.computing = await this.fetchServices(ServiceType.COPMUTING);
    },

    /** Buckets */
    async getBuckets(statusDestroyed: boolean = false) {
      if (
        (statusDestroyed &&
          (!this.hasDestroyedBuckets || isCacheExpired(LsCacheKeys.BUCKET_DESTROYED))) ||
        !this.hasBuckets ||
        isCacheExpired(LsCacheKeys.BUCKETS)
      ) {
        this.promises.buckets = await this.fetchBuckets(statusDestroyed);
      }
    },

    /** Find bucket by ID, if bucket doesn't exists in store, fetch it */
    async getBucket(bucketId: number): Promise<BucketInterface> {
      if (isCacheExpired(LsCacheKeys.BUCKET)) {
        return await this.fetchBucket(bucketId);
      }
      const bucket = this.bucket.items.find(item => item.id === bucketId);
      if (bucket !== undefined) {
        return bucket;
      }
      return await this.fetchBucket(bucketId);
    },

    /** Find bucket by ID, if bucket doesn't exists in store, fetch it */
    async getWebpage(webpageId: number): Promise<WebpageInterface> {
      if (this.webpage.active?.id === webpageId && !isCacheExpired(LsCacheKeys.WEBPAGE)) {
        return this.webpage.active;
      }
      return await this.fetchWebpage(webpageId);
    },

    /**
     * API calls
     */

    /** Projects */
    async fetchProjects(redirectToDashboard: boolean = false) {
      const router = useRouter();
      try {
        const res = await $api.get<ProjectsResponse>(endpoints.projectsUserProjects);

        this.project.items = res.data.items.map((project: ProjectInterface) => {
          return {
            ...project,
            value: project.id,
            label: project.name,
          };
        });

        /* If current project is not selected, take first one */
        if (this.currentProjectId === 0 && this.hasProjects) {
          this.setCurrentProject(this.project.items[0].id);
        }

        /** If user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
        if (redirectToDashboard && !this.hasProjects) {
          router.push({ name: 'onboarding' });
        } else if (redirectToDashboard) {
          router.push({ name: 'dashboard' });
        }

        return res;
      } catch (error) {
        this.project.items = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },

    /** Users */
    async fetchProject() {
      try {
        const res = await $api.get<ProjectResponse>(endpoints.project(this.currentProjectId));
        this.project.active = res.data;
      } catch (error) {
        this.project.active = {} as ProjectInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    async fetchProjectsQuota() {
      try {
        const res = await $api.get<ProjectsQuotaResponse>(endpoints.projectsQuota);
        this.project.quotaReached = res.data;
      } catch (error: any) {
        this.project.quotaReached = undefined;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** Services */
    async fetchServices(type?: number) {
      if (!this.hasProjects) {
        await this.fetchProjects();
      }

      try {
        const params: Record<string, string | number> = {
          project_id: this.currentProjectId,
        };
        if (type) {
          params.serviceType_id = type;
        }
        const res = await $api.get<ServicesResponse>(endpoints.services, params);

        return res.data.items.map((service: ServiceInterface, key: number) => {
          return { key, ...service };
        });
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return [] as Array<ServiceInterface>;
    },

    /** Buckets */
    async fetchBuckets(statusDeleted: boolean = false) {
      if (!this.hasProjects) {
        await this.fetchProjects();
      }
      this.bucket.loading = true;

      try {
        const params: Record<string, string | number> = {
          project_uuid: this.currentProject?.project_uuid || '',
        };
        if (statusDeleted) {
          params.status = 8;
        }
        const res = await $api.get<BucketsResponse>(endpoints.buckets, params);

        const items = res.data.items
          .filter((bucket: BucketInterface) => bucket.bucketType === BucketType.STORAGE)
          .map((bucket: BucketInterface) => {
            return addBucketAdditionalData(bucket);
          });

        if (statusDeleted) {
          this.bucket.destroyed = items;
        } else {
          this.bucket.items = items;
        }
        this.bucket.total = res.data.total;
        this.bucket.loading = false;
        this.bucket.search = '';

        /** Save timestamp to SS */
        const cacheKey = statusDeleted ? LsCacheKeys.BUCKET_DESTROYED : LsCacheKeys.BUCKETS;
        sessionStorage.setItem(cacheKey, Date.now().toString());

        return res;
      } catch (error: any) {
        if (statusDeleted) {
          this.bucket.items = [] as Array<BucketInterface>;
        } else {
          this.bucket.items = [] as Array<BucketInterface>;
        }
        this.bucket.total = 0;
        this.bucket.loading = false;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },

    async fetchBucket(bucketId: number): Promise<BucketInterface> {
      try {
        const res = await $api.get<BucketResponse>(endpoints.bucket(bucketId));

        this.bucket.active = addBucketAdditionalData(res.data);

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.BUCKET, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.bucket.active = {} as BucketInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as BucketInterface;
    },

    async fetchBucketQuota(bucketType: number = BucketType.STORAGE) {
      if (!this.hasProjects) {
        await this.fetchProjects();
      }
      const params = {
        project_uuid: this.currentProject?.project_uuid || '',
        bucketType,
      };
      try {
        const res = await $api.get<BucketQuotaResponse>(endpoints.bucketsQuota, params);

        if (bucketType === BucketType.STORAGE) {
          this.bucket.quotaReached = res.data;
        } else {
          this.webpage.quotaReached = res.data;
        }
      } catch (error: any) {
        if (bucketType === BucketType.STORAGE) {
          this.bucket.quotaReached = undefined;
        } else {
          this.webpage.quotaReached = undefined;
        }

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    async fetchDirectoryContent(
      bucketUuid?: string,
      folderId?: number,
      page?: number,
      limit?: number,
      search?: string,
      orderBy?: string,
      order?: string
    ) {
      this.folder.loading = true;

      /** Fallback for bucketUuid */
      const bucket = bucketUuid || this.bucketUuid;

      /** Update current folderId */
      if (folderId) {
        this.setFolderId(folderId);
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
        if (search) {
          params.search = search;
        }
        if (page) {
          params.page = page;
          params.limit = limit || PAGINATION_LIMIT;
        }
        if (orderBy) {
          params.orderBy = orderBy;
        }
        if (order) {
          params.desc = order === 'descend' ? 'true' : 'false';
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
        const url = endpoints.storageFileDetails(this.bucketUuid, fileUuidOrCID);
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

    /** Webpage */
    async fetchWebpage(id: number): Promise<WebpageInterface> {
      if (!this.hasProjects) {
        await this.fetchProjects();
      }
      try {
        const res = await $api.get<WebpageResponse>(endpoints.webpages(id));

        this.webpage.active = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.WEBPAGE, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.webpage.active = {} as WebpageInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as WebpageInterface;
    },

    /** Webpage deploy */
    async deployWebpage(
      webpageId: number,
      env: number = DeploymentEnvironment.STAGING
    ): Promise<any> {
      try {
        const config = useRuntimeConfig();
        const params: Record<string, string | number | boolean | null> = {
          // directDeploy: config.public.ENV === AppEnv.LOCAL,
          environment: env,
        };
        const res = await $api.post<DeploymentResponse>(endpoints.webpageDeploy(webpageId), params);
        console.log(res);

        window.$message.success(window.$i18n.t('form.success.webpageDeployed'));
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /**
     * Instructions
     */
    async fetchInstruction(key: string) {
      try {
        const res = await $api.get<InstructionResponse>(endpoints.instructions(key));

        if (res.data) {
          this.instruction[key] = res.data;
        }
      } catch (error) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },
    async fetchInstructions(key: string) {
      try {
        const res = await $api.get<InstructionsResponse>(endpoints.instructions(), {
          forRoute: key,
        });

        if (res.data) {
          this.instructions[key] = res.data.items;
        } else {
          this.instructions[key] = [];
        }
      } catch (error) {
        this.instructions[key] = [];
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },
  },
});
