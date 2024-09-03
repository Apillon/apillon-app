<template v-if="items.length">
  <Btn type="error" class="w-full mt-2" :loading="loading" @click="deleteItems">
    <slot v-if="$slots.default"></slot>
    <template v-else>{{ $t('form.confirm') }}</template>
  </Btn>
</template>

<script lang="ts" setup>
type Item =
  | ApiKeyInterface
  | BucketInterface
  | BucketItemInterface
  | ChatInterface
  | CollectionInterface
  | ContractInterface
  | IpnsInterface
  | PostInterface
  | WebsiteBaseInterface;

const props = defineProps({
  items: { type: Array<Item>, required: true },
});
const emit = defineEmits(['submitSuccess']);

const { t } = useI18n();
const message = useMessage();
const bucketStore = useBucketStore();
const loading = ref<boolean>(false);

/** Delete multiple items of type apiKey, Bucket, Directory or File */
async function deleteItems() {
  loading.value = true;
  const promises: Array<Promise<any>> = [];

  props.items.forEach(async (item: Item) => {
    try {
      const url = getUrl(getItemType(item), item);

      const req = $api.delete<DeleteResponse>(url);
      const res = await req;

      if (res.data) {
        promises.push(req);
      }

      if (props.items.length === 1) {
        message.success(t(`form.success.deleted.${getItemType(item)}`));
      }
    } catch (error) {
      message.error(userFriendlyMsg(error));
    }
  });
  await Promise.all(promises).then(_ => {
    if (props.items.length > 1) {
      message.success(t('form.success.deleted.items'));
    }

    emit('submitSuccess');
    loading.value = false;
  });
}

/** Get URL base on entity type */
function getUrl(type: string, item: Item) {
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
function getItemType(item: Item) {
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
</script>
