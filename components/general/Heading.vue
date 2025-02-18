<template>
  <!-- Heading template -->
  <div class="text-sm">
    <n-space class="box-content min-h-[40px] pb-4" justify="space-between" align="center" :size="32" :wrap="!isSm">
      <!-- Title - left side -->
      <slot />

      <!-- Info bar - right side -->
      <template v-if="$slots.info">
        <slot name="info"> </slot>
      </template>
    </n-space>

    <!-- Sub-menu -->
    <div v-if="$slots.submenu">
      <slot name="submenu"> </slot>
    </div>
    <div class="border-b-1 border-bg-lighter"></div>
  </div>
</template>

<script lang="ts" setup>
const { isSm } = useScreen();
</script>
