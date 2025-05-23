<template>
  <div class="flex items-center justify-between">
    <span class="text-xs">{{ $t('general.poweredBy') }}</span>
    <div class="flex items-center gap-2">
      <slot>
        <NuxtIcon v-for="(icon, key) in icons" :key="key" :name="`${icon}`" class="text-2xl" filled />
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  icons: { type: Array<string>, default: [] },
});
</script>
