export type ItemDelete =
  | ApiKeyInterface
  | BucketInterface
  | BucketItemInterface
  | ChatInterface
  | CloudFunctionInterface
  | CollectionInterface
  | ContractInterface
  | IpnsInterface
  | JobInterface
  | PostInterface
  | ServiceInterface
  | SmartContractInterface
  | RpcApiKeyInterface
  | RpcEndpointInterface
  | WebsiteBaseInterface;

export enum ItemDeleteKey {
  API_KEY = 'apiKey',
  BUCKET = 'bucket',
  BUCKET_CONTENT = 'bucketContent',
  CLOUD_FUNCTION = 'cloudFunction',
  COLLECTION = 'collection',
  CONTRACT = 'contract',
  DIRECTORY = 'directory',
  DOMAIN = 'domain',
  FILE = 'file',
  IPNS = 'ipns',
  JOB = 'job',
  POST = 'post',
  RPC_API_KEY = 'rpcApiKey',
  RPC_ENDPOINT = 'rpcEndpoint',
  SERVICE = 'service',
  SMART_CONTRACT = 'smartContract',
  SPACE = 'space',
  WEBSITE = 'website',
}
export type ItemDeleteType = `${ItemDeleteKey}`;

export default function useDelete() {
  const { t, te } = useI18n();
  const message = useMessage();
  const bucketStore = useBucketStore();
  const loading = ref<boolean>(false);

  /** Delete item */
  async function deleteItem(type: ItemDeleteType, id: string | number): Promise<Boolean> {
    loading.value = true;

    try {
      await $api.delete(getUrlById(type, id));

      const successMsg = te(`form.success.deleted.${type}`)
        ? t(`form.success.deleted.${type}`)
        : t('form.success.deleted.item');
      message.success(successMsg);

      loading.value = false;
      return true;
    } catch (error) {
      message.error(userFriendlyMsg(error));
    }
    loading.value = false;
    return false;
  }

  /** Get URL base on entity type */
  function getUrlById(type: ItemDeleteType, id: string | number) {
    switch (type) {
      case ItemDeleteKey.API_KEY:
        return endpoints.apiKey(id);
      case ItemDeleteKey.BUCKET:
        return endpoints.bucket(`${id}`);
      case ItemDeleteKey.BUCKET_CONTENT:
        return endpoints.bucketContent(`${id}`);
      case ItemDeleteKey.CLOUD_FUNCTION:
        return endpoints.cloudFunctions(`${id}`);
      case ItemDeleteKey.COLLECTION:
        return endpoints.collections(`${id}`);
      case ItemDeleteKey.CONTRACT:
        return endpoints.contracts(`${id}`);
      case ItemDeleteKey.DIRECTORY:
        return endpoints.directory(`${id}`);
      case ItemDeleteKey.DOMAIN:
        return endpoints.websiteDomain(`${id}`);
      case ItemDeleteKey.FILE:
        return endpoints.storageFileDelete(bucketStore.bucketUuid, `${id}`);
      case ItemDeleteKey.IPNS:
        return endpoints.ipns(bucketStore.selected, `${id}`);
      case ItemDeleteKey.JOB:
        return endpoints.acurastJobs(`${id}`);
      case ItemDeleteKey.POST:
        return endpoints.posts(`${id}`);
      case ItemDeleteKey.SERVICE:
        return endpoints.services(`${id}`);
      case ItemDeleteKey.SMART_CONTRACT:
        return endpoints.smartContractsDeployed(`${id}`);
      case ItemDeleteKey.SPACE:
        return endpoints.spaces(`${id}`);
      case ItemDeleteKey.WEBSITE:
        return endpoints.websites(`${id}`);
      case ItemDeleteKey.RPC_API_KEY:
        return endpoints.rpcApiKeys(id as number);
      case ItemDeleteKey.RPC_ENDPOINT:
        return endpoints.rpcUrl(id as number);
      default:
        return endpoints.file(`${id}`);
    }
  }

  /** Delete multiple items of type apiKey, Bucket, Directory or File */
  async function deleteItems(items: ItemDelete[]): Promise<boolean> {
    loading.value = true;
    const promises: Array<Promise<any>> = [];

    items.forEach(async item => {
      try {
        const url = getUrl(getItemType(item), item);

        const req = $api.delete<DeleteResponse>(url);
        const res = await req;

        if (res.data) {
          promises.push(req);
        }

        if (items.length === 1) {
          message.success(t(`form.success.deleted.${getItemType(item)}`));
        }
      } catch (error) {
        message.error(userFriendlyMsg(error));

        loading.value = false;
        return false;
      }
    });
    await Promise.all(promises).then(_ => {
      if (items.length > 1) {
        message.success(t('form.success.deleted.items'));
      }

      loading.value = false;
    });
    loading.value = false;
    return true;
  }

  /** Get URL base on entity type */
  function getUrl(type: string, item: ItemDelete) {
    switch (type) {
      case ItemDeleteKey.API_KEY:
        return endpoints.apiKey((item as ApiKeyInterface).id);
      case ItemDeleteKey.BUCKET:
        return endpoints.bucket((item as BucketInterface).bucket_uuid);
      case ItemDeleteKey.CLOUD_FUNCTION:
        return endpoints.cloudFunctions((item as CloudFunctionInterface).function_uuid);
      case ItemDeleteKey.COLLECTION:
        return endpoints.collections((item as CollectionInterface).collection_uuid);
      case ItemDeleteKey.CONTRACT:
        return endpoints.contracts((item as ContractInterface).contract_uuid);
      case ItemDeleteKey.DIRECTORY:
        return endpoints.directory((item as BucketItemInterface).uuid);
      case ItemDeleteKey.FILE:
        return endpoints.storageFileDelete(bucketStore.bucketUuid, (item as BucketItemInterface).uuid);
      case ItemDeleteKey.IPNS:
        return endpoints.ipns(bucketStore.selected, (item as IpnsInterface).ipns_uuid);
      case ItemDeleteKey.JOB:
        return endpoints.acurastJobs((item as JobInterface).job_uuid);
      case ItemDeleteKey.POST:
        return endpoints.posts((item as PostInterface).post_uuid);
      case ItemDeleteKey.SERVICE:
        return endpoints.services((item as ServiceInterface).service_uuid);
      case ItemDeleteKey.SMART_CONTRACT:
        return endpoints.smartContractsDeployed((item as SmartContractInterface).contract_uuid);
      case ItemDeleteKey.SPACE:
        return endpoints.spaces((item as ChatInterface).space_uuid);
      case ItemDeleteKey.WEBSITE:
        return endpoints.websites((item as WebsiteInterface).website_uuid);
      case 'rpcApiKey':
        return endpoints.rpcApiKeys((item as RpcApiKeyInterface).id);
      case 'rpcEndpoint':
        return endpoints.rpcUrl((item as RpcEndpointInterface).favoriteData?.id);
      default:
        console.warn('Wrong type');
        return '';
    }
  }

  /** Get type base on entity type */
  function getItemType(item: ItemDelete) {
    if ('apiKey' in item) {
      return ItemDeleteKey.API_KEY;
    } else if ('ipnsName' in item) {
      return ItemDeleteKey.IPNS;
    } else if ('bucketType' in item) {
      return ItemDeleteKey.BUCKET;
    } else if ('collection_uuid' in item) {
      return ItemDeleteKey.COLLECTION;
    } else if ('contract_uuid' in item) {
      return ItemDeleteKey.CONTRACT;
    } else if ('function_uuid' in item) {
      return ItemDeleteKey.CLOUD_FUNCTION;
    } else if ('job_uuid' in item) {
      return ItemDeleteKey.JOB;
    } else if ('post_uuid' in item) {
      return ItemDeleteKey.POST;
    } else if ('contract_uuid' in item) {
      return ItemDeleteKey.SMART_CONTRACT;
    } else if ('space_uuid' in item) {
      return ItemDeleteKey.SPACE;
    } else if ('website_uuid' in item) {
      return ItemDeleteKey.WEBSITE;
    } else if ('type' in item) {
      switch (item.type) {
        case BucketItemType.DIRECTORY:
          return ItemDeleteKey.DIRECTORY;
        default:
          return ItemDeleteKey.FILE;
      }
    }
    return ItemDeleteKey.FILE;
  }

  return { loading, deleteItem, deleteItems };
}
