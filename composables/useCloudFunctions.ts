import type { UploadFileInfo } from 'naive-ui';

export default function useCloudFunctions() {
  const { t } = useI18n();
  const { params } = useRoute();
  const router = useRouter();
  const message = useMessage();
  const dataStore = useDataStore();
  const cloudFunctionStore = useCloudFunctionStore();

  const pageLoading = ref<boolean>(true);
  const envLoading = ref<boolean>(true);

  async function init() {
    /** CloudFunction UUID from route */
    const functionUuid = params?.id ? `${params?.id}` : params?.slug ? `${params?.slug}` : '';

    await Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const currentCloudFunction = await cloudFunctionStore.getCloudFunction(functionUuid);

      if (!currentCloudFunction?.function_uuid) {
        router.push({ name: 'dashboard-service-cloud-functions' });
      } else {
        cloudFunctionStore.active = currentCloudFunction;
      }
      pageLoading.value = false;
    });
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

  async function updateEnvVariables(data: EnvVariable[], uuid?: string) {
    envLoading.value = true;

    const functionUuid = uuid || cloudFunctionStore.functionUuid;

    try {
      const bodyData = {
        function_uuid: functionUuid,
        variables: envVariablesToArray(data),
      };
      const res = await $api.post<CloudFunctionResponse>(
        endpoints.cloudFunctionEnvironment(functionUuid),
        bodyData
      );

      message.success(t('form.success.created.cloudFunction'));
    } catch (error) {
      message.error(userFriendlyMsg(error));
    }
    envLoading.value = false;
  }

  const envVariablesToArray = (data: EnvVariable[]) =>
    data.reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {});

  return {
    pageLoading,
    init,
    parseEnvFile,
    envVariablesToArray,
  };
}
