<template v-if="items.length">
  <Btn type="error" class="w-full mt-2" :loading="loading" @click="deleteItems">
    <slot v-if="$slots.default"></slot>
    <template v-else>{{ $t('form.confirm') }}</template>
  </Btn>
</template>

<script lang="ts" setup>
type Item = ApiKeyInterface | BucketInterface | BucketItemInterface | IpnsInterface;

const props = defineProps({
  items: { type: Array<Item>, required: true },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
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
        message.success($i18n.t(`form.success.deleted.${getItemType(item)}`));
      }
    } catch (error) {
      message.error(userFriendlyMsg(error));
    }
  });
  await Promise.all(promises).then(_ => {
    if (props.items.length > 1) {
      message.success($i18n.t('form.success.deleted.items'));
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
    case 'directory':
      return endpoints.directory((item as BucketItemInterface).uuid);
    case 'file':
      return endpoints.storageFileDelete(
        bucketStore.bucketUuid,
        (item as BucketItemInterface).uuid
      );
    case 'ipns':
      return endpoints.ipns(bucketStore.selected, (item as IpnsInterface).ipns_uuid);
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
