<template>
  <!-- Heading template -->
  <div class="pb-8">
    <n-space justify="space-between" align="center" class="pb-8 min-h-[40px] box-content">
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
