<template v-if="items.length">
  <Btn type="primary" class="w-full mt-2" :loading="loading" @click="deleteFolderItems">
    <template v-if="items.length === 1">
      {{ $t(`storage.delete.item`) }}
    </template>
    <template v-else-if="items.length > 1">
      {{ $t(`storage.delete.items`) }}
    </template>
  </Btn>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const props = defineProps({
  items: { type: Array<FolderInterface>, required: true },
});

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const emit = defineEmits(['submitSuccess']);

const loading = ref(false);

async function deleteFolderItems() {
  loading.value = true;
  const promises: Array<Promise<any>> = [];

  props.items.map(async item => {
    try {
      const url =
        item.type === BucketItemType.FILE
          ? endpoints.storageFileDelete(dataStore.currentBucket.bucket_uuid, item.id)
          : endpoints.directory(item.id);

      const req = $api.delete<DeleteResponse>(url);
      const res = await req;

      if (res.data) {
        promises.push(req);
      }

      if (props.items.length === 1) {
        message.success($i18n.t(`form.success.deleted.${item.type}`));
      }
    } catch (error) {
      message.error(userFriendlyMsg(error));
    }
  });
  Promise.all(promises).then(_ => {
    if (props.items.length > 1) {
      message.success($i18n.t('form.success.deleted.items'));
    }

    loading.value = false;
    emit('submitSuccess');
  });
}
</script>
