export default function useCloudFunctions() {
  const { params } = useRoute();
  const router = useRouter();
  const dataStore = useDataStore();
  const cloudFunctionStore = useCloudFunctionStore();

  const pageLoading = ref<boolean>(true);

  async function init() {
    /** CloudFunction UUID from route */
    const jobUuid = ref<string>(
      params?.id ? `${params?.id}` : params?.slug ? `${params?.slug}` : ''
    );

    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const currentCloudFunction = await cloudFunctionStore.getCloudFunction(jobUuid.value);

      if (!currentCloudFunction?.job_uuid) {
        // router.push({ name: 'dashboard-service-cloud-functions' });
      } else {
        cloudFunctionStore.active = currentCloudFunction;
      }
      pageLoading.value = false;
    });
  }

  return {
    pageLoading,
    init,
  };
}
