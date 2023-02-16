export default function useScreen() {
  const router = useRouter();
  const { params } = useRoute();
  const dataStore = useDataStore();
  const bucketStore = useBucketStore();
  const websiteStore = useWebsiteStore();
  const deploymentStore = useDeploymentStore();
  const pageLoading = ref<boolean>(true);
  let deploymentInterval: any = null as any;

  onUnmounted(() => {
    clearInterval(deploymentInterval);
  });

  function initWebsite(env: number = 0) {
    /** Website ID from route, then load buckets */
    const paramId = params?.id || params?.slug;
    const websiteId = parseInt(`${paramId}`);
    websiteStore.setWebsiteId(websiteId);

    setTimeout(() => {
      Promise.all(Object.values(dataStore.promises)).then(async _ => {
        const website = await websiteStore.getWebsite(websiteId);

        /** Check of website exists */
        if (!website?.id) {
          router.push({ name: 'dashboard-service-hosting' });
          return;
        }
        /** Get deployments for this website */
        if (env > 0) {
          await deploymentStore.getDeployments(websiteId, env);
        }

        if (env === DeploymentEnvironment.PRODUCTION) {
          /** Show files from production bucket */
          bucketStore.active = website.productionBucket;
          bucketStore.setBucketId(website.productionBucket.id);

          /** Deployments pooling */
          checkUnfinishedDeployments(deploymentStore.production);
        } else if (env === DeploymentEnvironment.STAGING) {
          /** Show files from staging bucket */
          bucketStore.active = website.stagingBucket;
          bucketStore.setBucketId(website.stagingBucket.id);

          /** Deployments pooling */
          checkUnfinishedDeployments(deploymentStore.staging);
        } else {
          /** Show files from main bucket */
          bucketStore.active = website.bucket;
          bucketStore.setBucketId(website.bucket.id);
        }

        /** Fetch directory content for bucket */
        bucketStore.fetchDirectoryContent(bucketStore.active.bucket_uuid);

        if (website.bucket.uploadedSize === 0) {
          bucketStore.uploadActive = true;
        }
        pageLoading.value = false;
      });
    }, 100);
  }

  function checkUnfinishedDeployments(deployments: Array<DeploymentInterface>) {
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
        clearInterval(deploymentInterval);
      }
    }, 10000);
  }

  return {
    pageLoading,
    initWebsite,
  };
}
