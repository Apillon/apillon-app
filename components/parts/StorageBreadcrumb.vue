<template>
  <StorageBreadcrumb
    v-if="folder?.parentDirectoryId"
    :folder-id="folder.parentDirectoryId"
    @breadcrumb-select="emit('breadcrumbSelect', folder.parentDirectoryId)"
  />
  <span class="cursor-pointer" @click="emit('breadcrumbSelect', folder.id)">
    {{ folder.name }}/
  </span>
</template>

<script lang="ts" setup>
const props = defineProps({
  folderId: { type: Number, required: true },
});
const emit = defineEmits(['breadcrumbSelect']);

const dataStore = useDataStore();

const folder = computed(() => {
  return dataStore.getFolderById(props.folderId);
});
</script>
