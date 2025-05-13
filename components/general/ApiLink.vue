<template>
  <div v-if="url" class="ml-auto flex flex-wrap items-center gap-2">
    <h5 v-if="title">
      {{ title }}
    </h5>
    <TableEllipsis
      class="max-w-sm rounded-lg bg-white px-4 py-[10px] !text-black lg:max-w-md xl:max-w-lg xxl:max-w-none"
      color="text-black"
      :text="url"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: '' },
  url: { type: String, default: '' },
});
</script>
