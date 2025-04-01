<template>
  <div class="flex h-fit justify-center">
    <div class="relative overflow-hidden rounded-lg">
      <Image :src="img" width="514" height="320" alt="nft template" />
      <div class="flex-cc absolute bottom-0 left-0 right-0 top-0 bg-bg-dark/75">
        <Btn type="info" size="small">
          <strong class="body-sm">
            {{ $t('general.viewDemo') }}
          </strong>
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
