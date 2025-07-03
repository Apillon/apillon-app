<template>
  <div class="relative flex h-full min-h-screen flex-col py-16">
    <div class="container">
      <AuthHeader />
    </div>
    <div class="container relative z-1 flex items-center md:flex-auto">
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
