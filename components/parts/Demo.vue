<template>
  <div class="flex h-fit justify-center">
    <div class="relative overflow-hidden rounded-lg">
      <Image :src="props.image" width="514" height="320" alt="nft template" />
      <div class="flex-cc absolute bottom-0 left-0 right-0 top-0 bg-bg-dark/75">
        <Btn type="info" :href="props.link">
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
