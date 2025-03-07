export default function useHosting() {
  const router = useRouter();
  const { params } = useRoute();
  const dataStore = useDataStore();
  const bucketStore = useBucketStore();
  const websiteStore = useWebsiteStore();
  const deploymentStore = useDeploymentStore();
  const pageLoading = ref<boolean>(true);

  let deploymentInterval: any = null as any;
  let websiteInterval: any = null as any;

  /** Website ID from route */
  const websiteUuid = ref<string>(params.id ? `${params?.id}` : `${params?.slug}`);

  onUnmounted(() => {
    clearInterval(deploymentInterval);
    clearInterval(websiteInterval);
  });

  async function initWebsite(env: number = 0, fetchBuilds: boolean = false, fetchVariables: boolean = false) {
    websiteUuid.value = params.id ? `${params?.id}` : `${params?.slug}`;
    websiteStore.setWebsite(websiteUuid.value);

    await dataStore.waitOnPromises();
    const website = await websiteStore.getWebsite(websiteUuid.value);

    /** Check of website exists */
    if (!website?.website_uuid) {
      router.push({ name: 'dashboard-service-hosting' });
      return;
    }

    if (fetchBuilds) {
      await deploymentStore.getBuilds(websiteUuid.value);
    }

    if (fetchVariables && website.deploymentConfig_id) {
      await deploymentStore.getVariables(website.deploymentConfig_id);
    }
    /** Get deployments for this website */
    if (env > 0) {
      await deploymentStore.getDeployments(websiteUuid.value, env);
    }

    if (env === DeploymentEnvironment.PRODUCTION) {
      /** Show files from production bucket */
      bucketStore.active = website.productionBucket;
      bucketStore.setBucket(website.productionBucket.bucket_uuid);

      /** Deployments polling */
      checkUnfinishedDeployments(deploymentStore.production, env);
    } else if (env === DeploymentEnvironment.STAGING) {
      /** Show files from staging bucket */
      bucketStore.active = website.stagingBucket;
      bucketStore.setBucket(website.stagingBucket.bucket_uuid);

      /** Deployments polling */
      checkUnfinishedDeployments(deploymentStore.staging, env);
    } else {
      /** Show files from main bucket */
      bucketStore.active = website.bucket;
      bucketStore.setBucket(website.bucket.bucket_uuid);
    }

    /** Fetch directory content for bucket */
    await bucketStore.fetchDirectoryContent({ bucketUuid: bucketStore.active.bucket_uuid });

    if (website.bucket.size === 0) {
      bucketStore.uploadActive = true;
    }
    pageLoading.value = false;
  }

  function checkUnfinishedWebsite(unfinishedWebsite: WebsiteInterface) {
    if (!!unfinishedWebsite?.ipnsProduction) return;

    websiteInterval = setInterval(async () => {
      const website = await websiteStore.fetchWebsite(websiteStore.active.website_uuid);

      if (!!website?.ipnsProduction) {
        clearInterval(websiteInterval);
      }
    }, 10000);
  }

  function checkUnfinishedDeployments(deployments: Array<DeploymentInterface>, env: number) {
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

  async function refreshWebpage(env: number) {
    /** On tab stg/prod refresh also website and deployments */
    if (env === DeploymentEnvironment.STAGING || env === DeploymentEnvironment.PRODUCTION) {
      /** Refresh deployments */
      deploymentStore.fetchDeployments(websiteUuid.value, env);

      /** Refresh active website data */
      const website = await websiteStore.fetchWebsite(websiteUuid.value);

      /** Show files from staging bucket */
      if (env === DeploymentEnvironment.STAGING) {
        bucketStore.active = website.stagingBucket;
        bucketStore.setBucket(website.stagingBucket.bucket_uuid);
      } else {
        bucketStore.active = website.productionBucket;
        bucketStore.setBucket(website.productionBucket.bucket_uuid);
      }
    }

    /** Refresh hosting files */
    bucketStore.fetchDirectoryContent();
  }

  return {
    pageLoading,
    websiteUuid,
    checkUnfinishedWebsite,
    initWebsite,
    refreshWebpage,
  };
}
