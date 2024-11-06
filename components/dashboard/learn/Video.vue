<template>
  <div class="w-full max-w-[600px]">
    <div class="mb-3 relative w-full pb-[56.25%] h-0 overflow-hidden">
      <iframe
        class="absolute top-0 left-0 w-full h-full"
        :src="htmlContent"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: { type: String, default: '' },
  htmlContent: { type: String, default: '' },
  extendedHtmlContent: { type: String, default: '' },
});
</script>
