import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import type { FormCloudFunctions } from '~/components/dashboard/form/computing/CloudFunctions/Job.vue';

let jobInterval: any = null as any;

export default function useCloudFunctions() {
  const { t } = useI18n();
  const { params } = useRoute();
  const router = useRouter();
  const message = useMessage();
  const dataStore = useDataStore();
  const cloudFunctionStore = useCloudFunctionStore();
  const { uploadFileToIPFS } = useComputing();
  const { refreshInterval, clearIntervalJob, setJobStatus, updateJobStatus } = useRefreshStatus();

  const pageLoading = ref<boolean>(true);
  const envLoading = ref<boolean>(false);
  const modalCreateJobVisible = ref<boolean>(false);

  onUnmounted(() => {
    clearInterval(jobInterval);
  });

  async function init() {
    /** CloudFunction UUID from route */
    const functionUuid = params?.id ? `${params?.id}` : params?.slug ? `${params?.slug}` : '';
    if (functionUuid !== cloudFunctionStore.functionUuid) {
      cloudFunctionStore.resetVariables();
    }

    await Promise.all(Object.values(dataStore.promises));

    const currentCloudFunction = await cloudFunctionStore.getCloudFunction(functionUuid);
    if (!currentCloudFunction?.function_uuid) {
      router.push({ name: 'dashboard-service-cloud-functions' });
    } else {
      cloudFunctionStore.active = currentCloudFunction;

      checkUnfinishedJobs();
    }

    pageLoading.value = false;
  }

  async function parseEnvFile(file: UploadFileInfo): Promise<Record<string, string>> {
    const env: Record<string, string> = {};

    console.log(env, file);
    const fileContent = (await readFileContent(file.file)) as string;
    console.log(fileContent);

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
      console.log(key, value, removeSurroundingQuotes(value.trim()));
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

  async function uploadEnvFile({ file, onError, onFinish }: UploadCustomRequestOptions) {
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

  async function createNewJob(
    data: FormCloudFunctions,
    functionUuid: string
  ): Promise<JobInterface | null> {
    if (!dataStore.hasProjects) {
      await dataStore.fetchProjects();
      if (!dataStore.projectUuid) return null;
    }
    try {
      setJobStatus(data?.file?.name);

      const fileCid = await uploadFile(data.file);
      if (!fileCid) return null;

      const bodyData = {
        project_uuid: dataStore.projectUuid,
        function_uuid: functionUuid,
        name: data.name,
        slots: data.slots,
        scriptCid: fileCid,
      };
      updateJobStatus(data?.name);

      const res = await $api.post<JobResponse>(endpoints.cloudFunctionJobs(functionUuid), bodyData);
      cloudFunctionStore.addJob(res.data);

      message.success(t('form.success.created.cloudFunctionJob'));
      clearIntervalJob();

      return res.data;
    } catch (error) {
      message.error(userFriendlyMsg(error));
    }
    return null;
  }

  async function uploadFile(file?: FileListItemType | null) {
    if (!file?.file) return false;
    if (!cloudFunctionStore.active.bucket_uuid) {
      message.error(t('error.DIRECTORY_BUCKET_ID_NOT_PRESENT'));
      return false;
    }

    const fileDetails = await uploadFileToIPFS(file, cloudFunctionStore.active.bucket_uuid);
    if (fileDetails) {
      return fileDetails.CIDv1 || fileDetails.CID;
    }
    return false;
  }

  async function onJobCreated(cloudFunction: CloudFunctionInterface) {
    modalCreateJobVisible.value = false;
    await sleep(1000);
    await cloudFunctionStore.fetchCloudFunction(cloudFunction.function_uuid, false);
    await sleep(5000);
    checkUnfinishedJobs();
  }

  /** Cloud function polling */
  function checkUnfinishedJobs() {
    clearInterval(jobInterval);

    const unfinishedJob = cloudFunctionStore.jobs.find(
      job => !job?.jobStatus || job.jobStatus < AcurastJobStatus.DEPLOYED
    );
    if (unfinishedJob === undefined) return;

    jobInterval = setInterval(async () => {
      const cloudFunction = await cloudFunctionStore.fetchCloudFunction(
        cloudFunctionStore.functionUuid,
        false
      );
      const job = cloudFunction.jobs.find(job => job.job_uuid === unfinishedJob.job_uuid);

      if (!job || job.jobStatus >= AcurastJobStatus.DEPLOYED) {
        cloudFunctionStore.active = cloudFunction;
        clearInterval(jobInterval);
      }
    }, refreshInterval.value.value);
  }

  return {
    envLoading,
    modalCreateJobVisible,
    pageLoading,
    createEnvVariables,
    createNewJob,
    init,
    onJobCreated,
    parseEnvFile,
    uploadEnvFile,
  };
}
