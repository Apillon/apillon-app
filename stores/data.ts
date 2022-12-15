import { useMessage } from 'naive-ui';
import { defineStore } from 'pinia';
import { ServiceType, ServiceTypeName, ServiceTypeNames } from '~~/types/service';

export const DataLsKeys = {
  CURRENT_PROJECT_ID: 'al_current_project_id',
  CURRENT_FOLDER_ID: 'al_current_folder_id',
};

export const useDataStore = defineStore('data', {
  state: () => ({
    bucket: {
      items: [] as Array<BucketInterface>,
      selected: 0,
    },
    crust: {} as Record<string, Array<any>>,
    currentProjectId: localStorage.getItem(DataLsKeys.CURRENT_PROJECT_ID)
      ? parseInt(`${localStorage.getItem(DataLsKeys.CURRENT_PROJECT_ID)}`)
      : 0,
    folder: {
      allowFetch: true,
      items: [] as Array<FolderInterface>,
      loading: false,
      path: [] as Array<{ id: number; name: string }>,
      search: '',
      selected: 0,
      total: 0,
    },
    instruction: {} as Record<string, InstructionInterface>,
    instructions: {} as Record<string, Array<InstructionInterface>>,
    projects: [] as Array<ProjectInterface>,
    promises: {
      projects: null as any,
      buckets: null as any,
    },
    services: {
      authentication: [] as Array<ServiceInterface>,
      storage: [] as Array<ServiceInterface>,
      computing: [] as Array<ServiceInterface>,
    } as Record<ServiceTypeName, Array<ServiceInterface>>,
  }),
  getters: {
    currentProject(state) {
      if (!this.hasProjects) {
        return null;
      }
      /** Return project with currentProjectId, if this ID does not exists, return first project */
      const project = state.projects.find(project => project.id === state.currentProjectId);
      if (project) {
        return project;
      }
      /** Select first project as fallback if currentProjectId is not available */
      this.currentProjectId = state.projects[0].id;
      localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, `${this.currentProjectId}`);
      return state.projects[0];
    },
    hasProjects(state) {
      return Array.isArray(state.projects) && state.projects.length > 0;
    },
    currentBucket(state): BucketInterface {
      return (
        state.bucket.items.find((item: BucketInterface) => item.id === state.bucket.selected) ||
        ({} as BucketInterface)
      );
    },
    hasBuckets(state): boolean {
      return Array.isArray(state.bucket.items) && state.bucket.items.length > 0;
    },
    hasSelectedBucket(state): boolean {
      return (
        state.bucket.items.find(
          (bucket: BucketInterface) => bucket.id === state.bucket.selected
        ) !== undefined
      );
    },
    getFolderPath(state) {
      return state.folder.path.map(p => p.name).join('/') || '';
    },
  },
  actions: {
    resetData() {
      this.bucket.items = [] as Array<BucketInterface>;
      this.folder.items = [] as Array<FolderInterface>;
      this.services.authentication = [] as Array<ServiceInterface>;
      this.services.storage = [] as Array<ServiceInterface>;
      this.services.computing = [] as Array<ServiceInterface>;
    },

    setCurrentProject(id: number) {
      this.currentProjectId = id;
      localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, `${id}`);
    },

    setBucketId(id: number) {
      this.folder.items = [] as Array<FolderInterface>;
      this.folder.total = 0;
      this.folder.path = [];
      this.folder.selected = 0;
      this.bucket.selected = id;
      this.folderSearch();
    },

    setFolderId(id: number) {
      this.folder.selected = id;
      sessionStorage.setItem(DataLsKeys.CURRENT_FOLDER_ID, `${id}`);
    },

    updateCurrentProject(project: ProjectInterface) {
      /** Find index of specific object using findIndex method. */
      const projectIndex = this.projects.findIndex(item => item.id === project.id);

      /** Update current project, add value and label, which are used in header dropdown */
      this.projects[projectIndex] = {
        ...project,
        value: project.id,
        label: project.name,
      };
    },

    getInstruction(key: string) {
      if (key in this.instruction) {
        return this.instruction[key];
      }
      return null;
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

    /**
     * API calls
     */

    /** Projects */
    async fetchProjects(redirectToDashboard: boolean = false, $i18n: any = null) {
      const router = useRouter();
      try {
        const res = await $api.get<ProjectResponse>(endpoints.userProjects);

        this.projects = res.data.items.map((project: ProjectInterface) => {
          return {
            ...project,
            value: project.id,
            label: project.name,
          };
        });

        /* If current project is not selected, take first one */
        if (this.currentProjectId === 0 && this.hasProjects) {
          this.setCurrentProject(this.projects[0].id);
        }

        /** If user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
        if (redirectToDashboard && !this.hasProjects) {
          router.push({ name: 'onboarding' });
        } else if (redirectToDashboard) {
          router.push({ name: 'dashboard' });
        }

        return res;
      } catch (error) {
        this.projects = [];

        /** Show error message */
        const message = useMessage();
        message.error(userFriendlyMsg(error, $i18n));
      }
      return null;
    },

    /** Services */
    async fetchServices($i18n?: any, type?: number) {
      if (!this.hasProjects) {
        alert('Please create your first project');
        return [] as Array<ServiceInterface>;
      }

      try {
        let params: Record<string, string | number> = {
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
        const message = useMessage();
        message.error(userFriendlyMsg(error, $i18n));
      }
      return [] as Array<ServiceInterface>;
    },

    async getAllServices($i18n: any = null) {
      const services = await this.fetchServices($i18n);

      Object.entries(ServiceTypeNames).map(([serviceType, typeName]) => {
        this.services[typeName] =
          services.filter(service => service.serviceType_id === parseInt(serviceType)) ||
          ([] as Array<ServiceInterface>);
      });
    },
    async getAuthServices($i18n: any = null) {
      this.services.authentication = await this.fetchServices($i18n, ServiceType.AUTHENTICATION);
    },
    async getStorageServices($i18n: any = null) {
      this.services.storage = await this.fetchServices($i18n, ServiceType.STORAGE);
    },
    async getComputingServices($i18n: any = null) {
      this.services.computing = await this.fetchServices($i18n, ServiceType.COPMUTING);
    },

    /** Buckets */
    async fetchBuckets($i18n: any = null) {
      if (!this.hasProjects) {
        alert('Please create your first project');
        return;
      }

      try {
        const params = {
          project_uuid: this.currentProject?.project_uuid || '',
        };
        const res = await $api.get<BucketResponse>(endpoints.bucket, params);

        this.bucket.items = res.data.items.map((bucket: BucketInterface) => {
          return {
            ...bucket,
            sizeMb: kbToMb(bucket.size || 0),
            maxSizeMb: kbToMb(bucket.maxSize),
            percentage: storagePercantage(bucket.size || 0, bucket.maxSize),
          };
        });
        return res;
      } catch (error: any) {
        this.bucket.items = [];

        /** Show error message */
        const message = useMessage();
        message.error(userFriendlyMsg(error, $i18n));
      }
      return null;
    },

    async fetchDirectoryContent(
      $i18n: any,
      bucketUuid?: string,
      folderId?: number,
      page?: number,
      limit?: number,
      search?: string
    ) {
      this.folder.loading = true;

      /** Fallback for bucketUuid */
      const bucket = bucketUuid || this.currentBucket.bucket_uuid;

      /** Update current folderId */
      if (folderId) {
        this.setFolderId(folderId);
      }

      try {
        /** If subfolder is selected, search directory content in this sibfolder */
        let params: Record<string, string | number> = {
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

        const res = await $api.get<FolderResponse>(endpoints.directoryContent, params);

        this.folder.items = res.data.items;
        this.folder.total = res.data.total;
      } catch (error: any) {
        /** Reset data */
        this.folder.items = [];
        this.folder.total = 0;

        /** Show error message */
        const message = useMessage();
        message.error(userFriendlyMsg(error, $i18n));
      }

      this.folder.loading = false;
    },

    async fetchFileInfo(fileId: number, $i18n: any = null) {
      try {
        const res = await $api.get<FolderResponse>(`${endpoints.file}${fileId}`);

        return res.data;
      } catch (error: any) {
        /** Show error message */
        const message = useMessage();
        message.error(userFriendlyMsg(error, $i18n));
      }
      return null;
    },

    async fetchFileDetails(fileUuid: string, $i18n: any = null): Promise<FileDetailsInterface> {
      try {
        const url = `/storage/${this.currentBucket.bucket_uuid}/file/${fileUuid}/detail`;
        const res = await $api.get<FileDetailsResponse>(url);

        return res.data;
      } catch (error: any) {
        /** Show error message */
        const message = useMessage();
        message.error(userFriendlyMsg(error, $i18n));
      }
      return {} as FileDetailsInterface;
    },
  },
});
