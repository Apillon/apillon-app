<template>
  <div class="card-light flex items-center h-10 px-4 py-2 rounded-lg">
    <strong class="text-xs mr-1">{{ $t('general.smBy') }}</strong>
    <NuxtIcon :name="icon" class="icon-auto" filled />
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  icon: { type: String, default: '' },
});
</script>
