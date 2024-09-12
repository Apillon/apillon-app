import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';

let functionInterval: any = null as any;
let jobInterval: any = null as any;

export default function useCloudFunctions() {
  const { t } = useI18n();
  const { params } = useRoute();
  const router = useRouter();
  const message = useMessage();
  const dataStore = useDataStore();
  const cloudFunctionStore = useCloudFunctionStore();

  const pageLoading = ref<boolean>(true);
  const envLoading = ref<boolean>(false);

  onUnmounted(() => {
    clearInterval(jobInterval);
  });

  async function init() {
    /** CloudFunction UUID from route */
    const functionUuid = params?.id ? `${params?.id}` : params?.slug ? `${params?.slug}` : '';

    await Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const currentCloudFunction = await cloudFunctionStore.getCloudFunction(functionUuid);

      if (!currentCloudFunction?.function_uuid) {
        router.push({ name: 'dashboard-service-cloud-functions' });
      } else {
        cloudFunctionStore.active = currentCloudFunction;

        checkUnfinishedJobs();
      }

      pageLoading.value = false;
    });
  }

  /** Cloud function polling */
  function checkUnfinishedJobs() {
    clearInterval(jobInterval);

    const unfinishedJob = cloudFunctionStore.jobs.find(
      job => job.jobStatus === AcurastJobStatus.DEPLOYING
    );
    if (unfinishedJob === undefined) {
      return;
    }

    jobInterval = setInterval(async () => {
      const cloudFunction = await cloudFunctionStore.fetchCloudFunction(
        cloudFunctionStore.functionUuid
      );
      const job = cloudFunction.jobs.find(job => job.job_uuid === unfinishedJob.job_uuid);

      if (!job || job.jobStatus >= AcurastJobStatus.DEPLOYED) {
        clearInterval(jobInterval);
        cloudFunctionStore.active = cloudFunction;
      }
    }, 10000);
  }

  async function parseEnvFile(file: UploadFileInfo): Promise<Record<string, string>> {
    const env: Record<string, string> = {};

    const fileContent = (await readFileContent(file.file)) as string;

    // Split content by lines
    const lines = fileContent.split('\n');

    for (let line of lines) {
      // Trim whitespace
      line = line.trim();

      // Ignore empty lines or comments
      if (!line || line.startsWith('#')) {
        continue;
      }

      // Split line into key and value
      const [key, value] = line.split('=');

      // Store key and value in the env object (trim to remove any surrounding whitespace)
      if (key && value) {
        env[key.trim()] = removeSurroundingQuotes(value.trim());
      }
    }

    return env;
  }

  async function createEnvVariables(
    data: EnvVariable[],
    uuid?: string
  ): Promise<CloudFunctionInterface | null> {
    envLoading.value = true;

    const functionUuid = uuid || cloudFunctionStore.functionUuid;

    try {
      const res = await $api.post<CloudFunctionResponse>(
        endpoints.cloudFunctionEnvironment(functionUuid),
        { variables: data }
      );
      if (cloudFunctionStore.hasVariablesExisting) {
        message.success(t('form.success.updated.cloudFunctionVariable'));
      } else {
        message.success(t('form.success.created.cloudFunctionVariable'));
      }
      envLoading.value = false;

      return res.data;
    } catch (error) {
      message.error(userFriendlyMsg(error));
      envLoading.value = false;

      return null;
    }
  }

  async function uploadFile({ file, onError, onFinish }: UploadCustomRequestOptions) {
    try {
      const envData = await parseEnvFile(file);
      const newVars = Object.entries(envData).map(([k, v]) => ({
        key: k,
        value: v,
      }));

      cloudFunctionStore.variablesNew = cloudFunctionStore.variablesNew.filter(
        i => !newVars.some(j => j.key === i.key)
      );
      cloudFunctionStore.variablesNew = [...cloudFunctionStore.variablesNew, ...newVars];

      cloudFunctionStore.variables = cloudFunctionStore.variables.filter(
        i => !cloudFunctionStore.variablesNew.some(j => j.key === i.key)
      );
      onFinish();
    } catch (error) {
      console.warn(error);
      onError();
    }
  }

  return {
    envLoading,
    pageLoading,
    checkUnfinishedJobs,
    createEnvVariables,
    init,
    parseEnvFile,
    uploadFile,
  };
}
