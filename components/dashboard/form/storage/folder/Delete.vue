<template v-if="items.length">
  <Btn type="primary" class="w-full mt-2" :loading="loading" @click="folderItems">
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
import { useI18n } from 'vue-i18n';

const props = defineProps({
  items: { type: Array<FolderInterface>, required: true },
});

const $i18n = useI18n();
const message = useMessage();
const emit = defineEmits(['submitSuccess']);

const loading = ref(false);

async function folderItems() {
  loading.value = true;
  const promises: Array<Promise<any>> = [];

  props.items.map(async item => {
    try {
      const url = item.type === BucketItemType.FILE ? endpoints.file : endpoints.directory;

      const req = $api.delete(`${url}${item.id}`);
      promises.push(req);
      await req;

      message.success($i18n.t(`form.success.deleted.${item.type}`));
    } catch (error) {
      message.error(userFriendlyMsg(error, $i18n));
    }
  });

  Promise.all(promises).then(_ => {
    if (props.items.length === 1) {
      message.success($i18n.t('form.success.deleted.item'));
    } else if (props.items.length > 1) {
      message.success($i18n.t('form.success.deleted.items'));
    }

    loading.value = false;
    emit('submitSuccess');
  });
}
</script>
