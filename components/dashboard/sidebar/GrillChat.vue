<template>
  <!-- Sidebar mask (page overlay for tablets that is used to close sidebar if user click on it) -->
  <div
    v-if="showOnMobile && !isLg"
    class="fixed left-0 top-0 w-full h-full z-1"
    @click="emit('toggleChat', false)"
  ></div>

  <!-- Sidebar -->
  <transition name="slide-right" :appear="isLg || showOnMobile">
    <div class="h-screen bg-bg transition-transform duration-300" :class="sidebarClasses">
      <!-- Close 
      <button
        v-if="showOnMobile"
        class="flex items-center justify-center absolute top-4 -left-10 w-8 h-8 z-50"
        @click="emit('toggleChat', false)"
      >
        <span class="icon-close text-body"></span>
      </button>-->

      <GrillChat />
    </div>
  </transition>
</template>

<script lang="ts" setup>
const props = defineProps({
  collapsed: { type: Boolean, default: false },
  showOnMobile: { type: Boolean, default: false },
});
const emit = defineEmits(['toggleChat']);

const config = useRuntimeConfig();
const { isSm, isLg } = useScreen();

/** Classes */
const sidebarClasses = computed(() => {
  return [
    isLg.value || !isSm.value ? 'w-full' : 'w-80',
    {
      'fixed top-0 left-full': !isLg.value,
      'z-10 -translate-x-full': props.showOnMobile && !isLg.value,
      'z-10 translate-x-0': !props.showOnMobile && !isLg.value,
    },
  ];
});
</script>
