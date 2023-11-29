<template>
  <div class="relative flex flex-col min-h-screen h-full py-16">
    <div class="container">
      <AuthHeader />
    </div>
    <div class="container flex items-center md:flex-auto relative z-1">
      <slot />
    </div>
    <div class="container">
      <AuthFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>
/** Global messages */
const message = useMessage();
window.$message = message;
</script>
