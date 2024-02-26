<template>
  <div class="relative flex flex-col justify-center align-middle min-h-screen h-full bg-bg-dark">
    <div class="container card relative max-w-[90vw] sm:max-w-lg py-16 sm:px-8 md:px-12 lg:px-16">
      <AuthHeader />

      <div class="relative">
        <router-view v-slot="{ Component, route }">
          <transition :name="(route.meta?.transition as string) || 'fadeBlur'" :duration="500">
            <component :is="Component" class="w-full" />
          </transition>
        </router-view>
      </div>

      <AuthFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>
/** Global messages */
const message = useMessage();
window.$message = message;
</script>
