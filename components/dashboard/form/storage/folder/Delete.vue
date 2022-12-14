<template>
  <Btn type="primary" class="w-full mt-2" :loading="loading" @click="folderDelete">
    {{ $t(`storage.${type}.delete`) }}
  </Btn>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  id: { type: Number, required: true },
  type: {
    type: String,
    validator: (type: string) => ['file', 'directory'].includes(type),
    required: true,
  },
});

const $i18n = useI18n();
const message = useMessage();
const emit = defineEmits(['submitSuccess']);

const loading = ref(false);

async function folderDelete() {
  loading.value = true;

  try {
    const url = props.type === 'file' ? endpoints.file : endpoints.directory;

    const res = await $api.delete(`${url}${props.id}`);

    message.success($i18n.t('form.success.folderDestroyed'));
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loading.value = false;
}
</script>
