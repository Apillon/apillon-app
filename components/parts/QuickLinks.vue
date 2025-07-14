<template>
  <div class="flex items-center justify-between">
    <span class="text-xs">{{ $t('dashboard.quickLinks') }}</span>
    <div class="flex items-center gap-4">
      <slot />
    </div>
  </div>
</template>
