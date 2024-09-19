<template>
  <div class="flex justify-center h-fit">
    <div class="relative rounded-lg overflow-hidden">
      <Image :src="props.image" width="514" height="320" alt="nft template" />
      <div class="absolute left-0 right-0 top-0 bottom-0 flex-cc bg-bg-dark/75">
        <Btn type="info" size="small" :href="props.link">
          <span class="icon-github mr-2"></span>
          <strong class="body-sm"> {{ props.title }}</strong>
        </Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Define props
const props = defineProps<{
  image: string;
  link: string;
  title: string;
}>();
</script>
