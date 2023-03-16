export default function useHosting() {
  const router = useRouter();
  const { params } = useRoute();
  const dataStore = useDataStore();
  const bucketStore = useBucketStore();
  const websiteStore = useWebsiteStore();
  const deploymentStore = useDeploymentStore();
  const pageLoading = ref<boolean>(true);
  let deploymentInterval: any = null as any;

  /** Website ID from route */
  const websiteId = ref<number>(parseInt(`${params?.id}`) || parseInt(`${params?.slug}`) || 0);

  onUnmounted(() => {
    clearInterval(deploymentInterval);
  });

  function initWebsite(env: number = 0) {
    websiteStore.setWebsiteId(websiteId.value);

    setTimeout(() => {
      Promise.all(Object.values(dataStore.promises)).then(async _ => {
        const website = await websiteStore.getWebsite(websiteId.value);

        /** Check of website exists */
        if (!website?.id) {
          router.push({ name: 'dashboard-service-hosting' });
          return;
        }
        /** Get deployments for this website */
        if (env > 0) {
          await deploymentStore.getDeployments(websiteId.value, env);
        }

        if (env === DeploymentEnvironment.PRODUCTION) {
          /** Show files from production bucket */
          bucketStore.active = website.productionBucket;
          bucketStore.setBucketId(website.productionBucket.id);

          /** Deployments polling */
          checkUnfinishedDeployments(deploymentStore.production, env);
        } else if (env === DeploymentEnvironment.STAGING) {
          /** Show files from staging bucket */
          bucketStore.active = website.stagingBucket;
          bucketStore.setBucketId(website.stagingBucket.id);

          /** Deployments polling */
          checkUnfinishedDeployments(deploymentStore.staging, env);
        } else {
          /** Show files from main bucket */
          bucketStore.active = website.bucket;
          bucketStore.setBucketId(website.bucket.id);
        }

        /** Fetch directory content for bucket */
        bucketStore.fetchDirectoryContent({ bucketUuid: bucketStore.active.bucket_uuid });

        if (website.bucket.uploadedSize === 0) {
          bucketStore.uploadActive = true;
        }
        pageLoading.value = false;
      });
    }, 100);
  }

  function checkUnfinishedDeployments(deployments: Array<DeploymentInterface>, env: number) {
    const unfinishedDeployment = deployments.find(
      deployment => deployment.deploymentStatus < DeploymentStatus.SUCCESSFUL
    );
    if (unfinishedDeployment === undefined) {
      return;
    }

    deploymentInterval = setInterval(async () => {
      const deployment = await deploymentStore.fetchDeployment(
        websiteStore.active.id,
        unfinishedDeployment.id
      );
      if (unfinishedDeployment.deploymentStatus !== deployment.deploymentStatus) {
        unfinishedDeployment.deploymentStatus = deployment.deploymentStatus;
      }
      if (deployment.deploymentStatus >= DeploymentStatus.SUCCESSFUL) {
        unfinishedDeployment.size = deployment.size;

        refreshWebpage(env);
        clearInterval(deploymentInterval);
      }
    }, 10000);
  }

  async function refreshWebpage(env: number) {
    /** On tab stg/prod refresh also website and deployments */
    if (env === DeploymentEnvironment.STAGING || env === DeploymentEnvironment.PRODUCTION) {
      /** Refresh deyployments */
      deploymentStore.fetchDeployments(websiteId.value, env);

      /** Refresh active website data */
      const website = await websiteStore.fetchWebsite(websiteId.value);

      /** Show files from staging bucket */
      if (env === DeploymentEnvironment.STAGING) {
        bucketStore.active = website.stagingBucket;
        bucketStore.setBucketId(website.stagingBucket.id);
      } else {
        bucketStore.active = website.productionBucket;
        bucketStore.setBucketId(website.productionBucket.id);
      }
    }

    /** Refresh hosting files */
    bucketStore.fetchDirectoryContent();
  }

  return {
    pageLoading,
    websiteId,
    initWebsite,
    refreshWebpage,
  };
}
