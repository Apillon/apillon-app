<template>
  <Btn type="primary" class="w-full mt-2" :loading="loading" @click="deleteItem">
    <slot v-if="$slots.default"></slot>
    <template v-else>{{ $t('general.confirm') }}</template>
  </Btn>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const props = defineProps({
  id: { type: Number, required: true },
  type: {
    type: String,
    validator: (type: string) =>
      ['apiKey', 'bucket', 'bucketContent', 'directory', 'file', 'ipns'].includes(type),
    required: true,
  },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const bucketStore = useBucketStore();
const loading = ref<boolean>(false);

/** Delete item */
async function deleteItem() {
  loading.value = true;

  try {
    await $api.delete(getUrl(props.type, props.id));

    const successMsg = $i18n.te(`form.success.deleted.${props.type}`)
      ? $i18n.t(`form.success.deleted.${props.type}`)
      : $i18n.t('form.success.deleted.item');
    message.success(successMsg);

    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

/** Get URL base on entity type */
function getUrl(type: string, id: number) {
  switch (type) {
    case 'apiKey':
      return endpoints.apiKey(id);
    case 'bucket':
      return endpoints.bucket(id);
    case 'bucketContent':
      return endpoints.bucketContent(id);
    case 'directory':
      return endpoints.directory(id);
    case 'file':
      return endpoints.storageFileDelete(bucketStore.bucketUuid, id);
    case 'ipns':
      return endpoints.ipns(bucketStore.selected, id);
    default:
      return endpoints.file(id);
  }
}
</script>
