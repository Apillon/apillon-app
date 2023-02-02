<template v-if="items.length">
  <Btn type="primary" class="w-full mt-2" :loading="loading" @click="deleteItems">
    <slot v-if="$slots.default"></slot>
    <template v-else>{{ $t('general.confirm') }}</template>
  </Btn>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
type Item = ApiKeyInterface | BucketInterface | BucketItemInterface | FileUploadInterface;

const props = defineProps({
  items: {
    type: Array<ApiKeyInterface | BucketInterface | BucketItemInterface | FileUploadInterface>,
    required: true,
  },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const loading = ref(false);

onMounted(() => {
  props.items.forEach((item: Item) => {
    getItemType(item);
  });
});

/** Delete multiple items of type apiKey, Bucket, Directory or File */
async function deleteItems() {
  loading.value = true;
  const promises: Array<Promise<any>> = [];

  props.items.forEach(async (item: Item) => {
    try {
      const url = getUrl(getItemType(item), item.id);

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

    loading.value = false;
    emit('submitSuccess');
  });
}

/** Get URL base on entity type */
function getUrl(type: string, id: number) {
  switch (type) {
    case 'apiKey':
      return endpoints.apiKey(id);
    case 'bucket':
      return endpoints.bucket(id);
    case 'directory':
      return endpoints.directory(id);
    case 'file':
      return endpoints.storageFileDelete(dataStore.bucketUuid, id);
    default:
      console.warn('Wrong type');
      return '';
  }
}

/** Get type base on entity type */
function getItemType(item: Item) {
  if ('apiKey' in item) {
    return 'apiKey';
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
