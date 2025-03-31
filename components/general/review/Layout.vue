<template>
  <div class="relative min-h-full flex flex-col items-start gap-12 md:flex-row">
    <slot name="left" />

    <div class="static hidden h-full md:block">
      <div class="absolute bottom-4 top-8 border-l border-bg-lighter"></div>
    </div>

    <slot name="right" /> 
  </div>
</template>
