<template>
  <div v-if="url" class="flex flex-wrap gap-2 items-center ml-auto">
    <h5 v-if="title">
      {{ title }}
    </h5>
    <TableEllipsis
      class="bg-white px-4 py-[10px] rounded-lg !text-black max-w-sm lg:max-w-md xl:max-w-lg xxl:max-w-none"
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
