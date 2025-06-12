import { WebsiteSource } from '~/lib/types/hosting';

const activeTab = ref();
export default function useHosting() {
  const { t } = useI18n();
  const router = useRouter();
  const message = useMessage();
  const { params } = useRoute();

  const dataStore = useDataStore();
  const bucketStore = useBucketStore();
  const websiteStore = useWebsiteStore();
  const deploymentStore = useDeploymentStore();

  const loading = ref<boolean>(false);
  const pageLoading = ref<boolean>(true);

  let buildInterval: any = null as any;
  let deploymentInterval: any = null as any;
  let websiteInterval: any = null as any;

  const tabs = {
    UPLOAD: t('hosting.menu.preview'),
    DEPLOYMENTS: t('hosting.menu.deployments'),
    PRODUCTION: t('hosting.menu.production'),
    VARIABLES: t('hosting.menu.envVars'),
  };

  /** Website ID from route */
  const websiteUuid = ref<string>(params.id ? `${params?.id}` : `${params?.slug}`);

  const ruleApiKey = (form: Record<string, any>) => ({
    validator: (_, value) => validateApiKey(value, form?.apiSecret),
    message: t('validation.apiKeyRequired'),
    trigger: 'blur',
  });
  const ruleApiSecret = (form: Record<string, any>) => ({
    validator: (_, value) => validateApiSecret(value, form?.apiKey),
    message: t('validation.apiSecretRequired'),
    trigger: 'blur',
  });

  /** Website rules */
  const rulesWebsite: NFormRules = {
    name: [ruleRequired(t('validation.website.nameRequired'))],
    description: [ruleDescription(t('validation.descriptionTooLong'))],
    repoId: [ruleRequired(t('validation.hosting.repoRequired'))],
    branchName: [ruleRequired(t('validation.hosting.branchNameRequired'))],
    buildDirectory: [ruleRequired(t('validation.hosting.buildDirectoryRequired'))],
    apiKey: ruleApiKey(websiteStore.form),
    apiSecret: ruleApiSecret(websiteStore.form),
  };

  onUnmounted(() => {
    clearInterval(deploymentInterval);
    clearInterval(websiteInterval);
  });

  async function initWebsite(env: number = 0, uuid?: string) {
    websiteUuid.value = uuid ? uuid : params.id ? `${params?.id}` : `${params?.slug}`;
    if (websiteStore.active.website_uuid !== websiteUuid.value) {
      deploymentStore.resetData();
    }

    websiteStore.resetForm();
    websiteStore.setWebsite(websiteUuid.value);

    await dataStore.waitOnPromises();
    const website = await websiteStore.getWebsite(websiteUuid.value);

    /** Check of website exists */
    if (!website?.website_uuid) {
      router.push({ name: 'dashboard-service-hosting' });
      return;
    }
    activeTab.value = websiteStore.isActiveWebsiteStatic ? tabs.UPLOAD : tabs.DEPLOYMENTS;

    if (website.source === WebsiteSource.GITHUB) {
      await deploymentStore.getDeploymentConfig(website.website_uuid);
      deploymentStore.getBuilds(websiteUuid.value);

      if (deploymentStore.deploymentConfig?.id) {
        await deploymentStore.getVariables(deploymentStore.deploymentConfig?.id);
      }
    } else if (website.nftCollectionUuid) {
      deploymentStore.getBuilds(websiteUuid.value);
    }

    await changeEnv(env);

    if (website.bucket.size === 0) {
      bucketStore.uploadActive = true;
    }
    pageLoading.value = false;
  }

  async function changeEnv(env: number = 0) {
    if (env < 0) return;

    /** Get deployments for this website */
    if (env > 0) {
      await deploymentStore.getDeployments(websiteUuid.value, env);

      /** Deployments polling */
      const deployments = env === DeploymentEnvironment.STAGING ? deploymentStore.staging : deploymentStore.production;
      checkUnfinishedDeployments(deployments, env);
    }

    /** Set active bucket */
    bucketStore.active =
      env === DeploymentEnvironment.PRODUCTION
        ? websiteStore.active.productionBucket
        : env === DeploymentEnvironment.STAGING
          ? websiteStore.active.stagingBucket
          : websiteStore.active.bucket;
    bucketStore.setBucket(bucketStore.active.bucket_uuid);

    /** Fetch directory content for bucket */
    await bucketStore.fetchDirectoryContent({ bucketUuid: bucketStore.active.bucket_uuid });
  }

  function checkUnfinishedWebsite(unfinishedWebsite: WebsiteInterface) {
    if (unfinishedWebsite?.ipnsProduction) return;

    websiteInterval = setInterval(async () => {
      const website = await websiteStore.fetchWebsite(websiteStore.active.website_uuid);

      if (website?.ipnsProduction) {
        clearInterval(websiteInterval);
      }
    }, 10000);
  }

  function checkUnfinishedDeployments(deployments: DeploymentInterface[], env: number) {
    const unfinishedDeployment = deployments.find(
      deployment => deployment.deploymentStatus < DeploymentStatus.IN_REVIEW
    );
    if (unfinishedDeployment === undefined) {
      return;
    }

    deploymentInterval = setInterval(async () => {
      const deployment = await deploymentStore.fetchDeployment(
        websiteStore.active.website_uuid,
        unfinishedDeployment.deployment_uuid
      );
      if (unfinishedDeployment.deploymentStatus !== deployment.deploymentStatus) {
        unfinishedDeployment.deploymentStatus = deployment.deploymentStatus;
      }
      if (deployment.deploymentStatus >= DeploymentStatus.IN_REVIEW) {
        unfinishedDeployment.size = deployment.size;

        refreshWebpage(env);
        clearInterval(deploymentInterval);
      }
    }, 10000);
  }

  async function checkUnfinishedBuilds() {
    const builds = await deploymentStore.fetchBuilds(websiteStore.active.website_uuid);
    const unfinishedBuilds = builds.find(deployment => deployment.buildStatus < DeploymentBuildStatus.SUCCESS);
    if (unfinishedBuilds === undefined) {
      return;
    }

    buildInterval = setInterval(async () => {
      const refreshedBuilds = await deploymentStore.fetchBuilds(websiteStore.active.website_uuid, false);

      if (refreshedBuilds.find(deployment => deployment.buildStatus < DeploymentBuildStatus.SUCCESS) === undefined) {
        clearInterval(buildInterval);
      }
    }, 5000);
  }

  async function refreshWebpage(env: number = 0) {
    changeEnv(env);

    /** Refresh active website data */
    websiteStore.fetchWebsite(websiteUuid.value);

    /** On tab stg/prod refresh also website and deployments */
    if (env === DeploymentEnvironment.STAGING || env === DeploymentEnvironment.PRODUCTION) {
      /** Refresh deployments */
      deploymentStore.fetchDeployments(websiteUuid.value, env);
    }
    if (websiteStore.isActiveWebsiteGithubSource) {
      deploymentStore.fetchBuilds(websiteStore.active.website_uuid);
    }
  }

  async function createWebsite(): Promise<WebsiteInterface | null> {
    if (!dataStore.projectUuid) return null;

    loading.value = true;
    try {
      const bodyData: Record<string, string | number | object> = {
        name: websiteStore.form.name,
        description: websiteStore.form.description,
        project_uuid: dataStore.projectUuid,
      };
      if (websiteStore.form.type === WebsiteType.GITHUB) {
        bodyData.deploymentConfig = {
          branchName: websiteStore.form.branchName,
          buildCommand: websiteStore.form.buildCommand,
          buildDirectory: websiteStore.form.buildDirectory,
          installCommand: websiteStore.form.installCommand,
          repoUrl: websiteStore.form.repoUrl,
          apiKey: websiteStore.form.apiKey,
          apiSecret: websiteStore.form.apiSecret,
          repoId: websiteStore.form.repoId,
          repoName: websiteStore.form.repoName,
          repoOwnerName: websiteStore.form.repoOwnerName,
          projectUuid: dataStore.projectUuid,
        };
      }

      const { data } = await $api.post<WebsiteResponse>(endpoints.website, bodyData);
      websiteStore.active = data;

      /** On new website created add new website to list */
      websiteStore.items.unshift(data as WebsiteBaseInterface);

      message.success(t('form.success.created.website'));
      loading.value = false;
      return data;
    } catch (error) {
      message.error(userFriendlyMsg(error));
      loading.value = false;
    }
    return null;
  }

  async function updateWebsite(uuid: string): Promise<WebsiteInterface | null> {
    loading.value = true;

    try {
      const { data } = await $api.patch<WebsiteResponse>(endpoints.websites(uuid), websiteStore.form);

      message.success(t('form.success.updated.website'));

      /** On website updated refresh website data */
      websiteStore.items.forEach((item: WebsiteBaseInterface) => {
        if (item.website_uuid === uuid) {
          Object.assign(item, data);
        }
      });
      if (websiteStore.active.website_uuid === uuid) {
        Object.assign(websiteStore.active, data);
      }

      loading.value = false;
      return data;
    } catch (error) {
      message.error(userFriendlyMsg(error));
    }
    loading.value = false;
    return null;
  }
  async function onWebsiteDeleted(websitUuuid?: string) {
    if (websitUuuid) {
      websiteStore.items = websiteStore.items.filter(item => item.website_uuid !== websitUuuid);
    }
    sessionStorage.removeItem(LsCacheKeys.WEBSITE);
    sessionStorage.removeItem(LsCacheKeys.WEBSITE_ARCHIVE);

    router.push({ name: 'dashboard-service-hosting' });
  }

  return {
    activeTab,
    pageLoading,
    rulesWebsite,
    tabs,
    websiteUuid,
    checkUnfinishedBuilds,
    checkUnfinishedWebsite,
    createWebsite,
    changeEnv,
    initWebsite,
    onWebsiteDeleted,
    refreshWebpage,
    ruleApiKey,
    ruleApiSecret,
    updateWebsite,
  };
}
