<template>
  <NuxtTime :datetime="datetime" hour="numeric" minute="numeric" second="numeric" month="long" day="numeric" relative />
</template>

<script lang="ts" setup>
defineProps({
  datetime: { type: [String, Number, Date], required: true },
});
</script>
