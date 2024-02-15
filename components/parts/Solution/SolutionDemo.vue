<template>
  <div class="flex justify-center h-fit">
    <div class="relative rounded-lg overflow-hidden">
      <Image :src="img" width="514" height="320" alt="nft template" />
      <div class="absolute left-0 right-0 top-0 bottom-0 flex-cc bg-bg-dark/75">
        <Btn type="info" size="small">
          <strong class="body-sm">View demo</strong>
        </Btn>
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  img: { type: String, required: true },
});
</script>
