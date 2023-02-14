export default function useScreen() {
  const router = useRouter();
  const { params } = useRoute();
  const dataStore = useDataStore();
  const bucketStore = useBucketStore();
  const webpageStore = useWebpageStore();
  const deploymentStore = useDeploymentStore();
  const pageLoading = ref<boolean>(true);
  let deploymentInterval: any = null as any;

  onUnmounted(() => {
    clearInterval(deploymentInterval);
  });

  function initWebpage(env: number = 0) {
    /** Webpage ID from route, then load buckets */
    const paramId = params?.id || params?.slug;
    const webpageId = parseInt(`${paramId}`);
    webpageStore.setWebpageId(webpageId);

    setTimeout(() => {
      Promise.all(Object.values(dataStore.promises)).then(async _ => {
        const webpage = await webpageStore.getWebpage(webpageId);

        /** Check of webpage exists */
        if (!webpage?.id) {
          router.push({ name: 'dashboard-service-hosting' });
          return;
        }
        /** Get deployments for this webpage */
        if (env > 0) {
          await deploymentStore.getDeployments(webpageId, env);
        }

        if (env === DeploymentEnvironment.PRODUCTION) {
          /** Show files from production bucket */
          bucketStore.active = webpage.productionBucket;
          bucketStore.setBucketId(webpage.productionBucket.id);

          /** Deployments pooling */
          checkUnfinishedDeployments(deploymentStore.production);
        } else if (env === DeploymentEnvironment.STAGING) {
          /** Show files from staging bucket */
          bucketStore.active = webpage.stagingBucket;
          bucketStore.setBucketId(webpage.stagingBucket.id);

          /** Deployments pooling */
          checkUnfinishedDeployments(deploymentStore.staging);
        } else {
          /** Show files from main bucket */
          bucketStore.active = webpage.bucket;
          bucketStore.setBucketId(webpage.bucket.id);
        }

        /** Fetch directory content for bucket */
        bucketStore.fetchDirectoryContent(bucketStore.active.bucket_uuid);

        if (webpage.bucket.uploadedSize === 0) {
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
        webpageStore.active.id,
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
    initWebpage,
  };
}
