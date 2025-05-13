<template>
  <div class="card-light flex h-10 items-center rounded-lg px-4 py-2">
    <strong class="mr-1 text-xs">{{ $t('general.smBy') }}</strong>
    <NuxtIcon :name="icon" class="icon-auto" filled />
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  icon: { type: String, default: '' },
});
</script>
