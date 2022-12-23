<template>
  <div class="mb-3">
    <iframe
      class="max-w-full"
      width="350"
      height="200"
      :src="htmlContent"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: { type: String, default: '' },
  htmlContent: { type: String, default: '' },
  extendedHtmlContent: { type: String, default: '' },
});
</script>
