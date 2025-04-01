<template>
  <n-upload
    class="pr-1"
    :show-file-list="false"
    :disabled="authStore.isAdmin() || disabled"
    :custom-request="data => $emit('upload', data)"
  >
    <n-upload-dragger class="h-40">
      <div v-if="file?.name" class="py-2 text-center">
        <div class="mb-2 inline-block h-10 w-10 rounded-full bg-bg-lighter p-2">
          <span class="icon-upload text-2xl text-violet"></span>
        </div>

        <h4 class="mb-1">{{ $t('computing.upload.uploaded') }}</h4>
        <span class="text-body">{{ file?.name }}</span>
      </div>
      <div v-else class="py-2 text-center">
        <div class="mb-2 inline-block h-10 w-10 rounded-full bg-bg-lighter p-2">
          <span class="icon-upload text-2xl text-violet"></span>
        </div>

        <h4 class="mb-1">{{ $t('computing.upload.upload') }}</h4>
        <span class="text-body">{{ $t('computing.upload.dragAndDrop') }}</span>
      </div>
    </n-upload-dragger>
  </n-upload>
</template>

<script lang="ts" setup>
defineEmits(['upload']);
defineProps({
  disabled: { type: Boolean, default: false },
  file: { type: Object as PropType<FileListItemType | null>, default: null },
});

const authStore = useAuthStore();
</script>
