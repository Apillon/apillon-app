export default function useScreen() {
  const router = useRouter();
  const { name, params } = useRoute();
  const dataStore = useDataStore();
  const bucketStore = useBucketStore();
  const fileStore = useFileStore();
  const ipnsStore = useIpnsStore();
  const pageLoading = ref<boolean>(true);

  function initBucket(isBucketUpload: boolean = false) {
    /** Website ID from route, then load buckets */
    const routeName = name?.toString() || '';
    const paramId = params?.id || params?.slug;
    const bucketId = parseInt(`${paramId}`);
    bucketStore.setBucketId(bucketId);

    setTimeout(() => {
      Promise.all(Object.values(dataStore.promises)).then(async _ => {
        bucketStore.active = await bucketStore.getBucket(bucketId);

        /** Check of website exists */
        if (!bucketStore.active?.id) {
          router.push({ name: 'dashboard-service-storage' });
          return;
        }

        if (isBucketUpload) {
          /** Fetch directory content for bucket */
          bucketStore.getDirectoryContent();

          if (bucketStore.active.uploadedSize === 0) {
            bucketStore.uploadActive = true;
          }
        } else if (routeName.includes('ipns')) {
          await ipnsStore.getIPNSs(bucketId);
        } else if (routeName.includes('trash')) {
          await fileStore.getDeletedFiles();
        }

        pageLoading.value = false;
      });
    }, 10);
  }

  return {
    pageLoading,
    initBucket,
  };
}
