<template>
  <div class="w-full max-w-[600px]">
    <div class="relative mb-3 h-0 w-full overflow-hidden pb-[56.25%]">
      <iframe
        class="absolute left-0 top-0 h-full w-full"
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
