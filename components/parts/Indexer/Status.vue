<template>
  <Tag v-if="status !== null" :type="status">
    <span class="mx-1 uppercase"><slot /></span>
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: String as PropType<TagType>, default: undefined },
});
</script>
