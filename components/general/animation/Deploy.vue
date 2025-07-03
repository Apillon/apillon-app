<template>
  <div class="flex-cc min-h-52">
    <div class="text-center">
      <AnimationLoader :size="64" />
      <Headline :title="title || $t('nft.deploy.deploying')" :content="content || $t('nft.deploy.metadata')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: null },
  content: { type: String, default: null },
});
</script>
