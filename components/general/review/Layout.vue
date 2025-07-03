<template>
  <div class="relative flex min-h-full flex-col items-start gap-x-12 gap-y-4 md:flex-row">
    <slot name="left" />

    <div class="static hidden h-full md:block">
      <div class="absolute bottom-4 top-8 border-l border-bg-lighter"></div>
    </div>

    <slot name="right" />
  </div>
</template>
