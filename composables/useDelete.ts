export type ItemDelete =
  | ApiKeyInterface
  | BucketInterface
  | BucketItemInterface
  | ChatInterface
  | CollectionInterface
  | ContractInterface
  | DomainInterface
  | IpnsInterface
  | PostInterface
  | WebsiteBaseInterface;

export enum ItemDeleteKey {
  API_KEY = 'apiKey',
  BUCKET = 'bucket',
  BUCKET_CONTENT = 'bucketContent',
  COLLECTION = 'collection',
  CONTRACT = 'contract',
  DIRECTORY = 'directory',
  DOMAIN = 'domain',
  FILE = 'file',
  IPNS = 'ipns',
  POST = 'post',
  SERVICE = 'service',
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
      case ItemDeleteKey.POST:
        return endpoints.posts(`${id}`);
      case ItemDeleteKey.SERVICE:
        return endpoints.services(`${id}`);
      case ItemDeleteKey.SPACE:
        return endpoints.spaces(`${id}`);
      case ItemDeleteKey.WEBSITE:
        return endpoints.websites(`${id}`);
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
      case 'apiKey':
        return endpoints.apiKey((item as ApiKeyInterface).id);
      case 'bucket':
        return endpoints.bucket((item as BucketInterface).bucket_uuid);
      case 'collection':
        return endpoints.collections((item as CollectionInterface).collection_uuid);
      case 'contract':
        return endpoints.contracts((item as ContractInterface).contract_uuid);
      case 'directory':
        return endpoints.directory((item as BucketItemInterface).uuid);
      case 'file':
        return endpoints.storageFileDelete(
          bucketStore.bucketUuid,
          (item as BucketItemInterface).uuid
        );
      case 'ipns':
        return endpoints.ipns(bucketStore.selected, (item as IpnsInterface).ipns_uuid);
      case 'post':
        return endpoints.posts((item as PostInterface).post_uuid);
      case 'space':
        return endpoints.spaces((item as ChatInterface).space_uuid);
      case 'website':
        return endpoints.websites((item as WebsiteInterface).website_uuid);
      default:
        console.warn('Wrong type');
        return '';
    }
  }

  /** Get type base on entity type */
  function getItemType(item: ItemDelete) {
    if ('apiKey' in item) {
      return 'apiKey';
    } else if ('ipnsName' in item) {
      return 'ipns';
    } else if ('bucketType' in item) {
      return 'bucket';
    } else if ('collection_uuid' in item) {
      return 'collection';
    } else if ('contract_uuid' in item) {
      return 'contract';
    } else if ('post_uuid' in item) {
      return 'post';
    } else if ('space_uuid' in item) {
      return 'space';
    } else if ('website_uuid' in item) {
      return 'website';
    } else if ('type' in item) {
      switch (item.type) {
        case BucketItemType.DIRECTORY:
          return 'directory';
        case BucketItemType.FILE:
          return 'file';
        default:
          return 'file';
      }
    }
    return 'file';
  }

  return { loading, deleteItem, deleteItems };
}
