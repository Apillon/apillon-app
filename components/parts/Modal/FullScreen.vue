<template>
  <n-drawer width="100%" height="92vh" placement="bottom">
    <n-drawer-content :title="title" closable>
      <template #header>
        <div class="flex w-full items-center justify-between">
          <small class="inline-block md:w-1/6">{{ title }}</small>
          <div>
            <slot name="header-center" />
          </div>
          <div class="md:w-1/6"></div>
        </div>
        <div
          v-if="progress !== null"
          class="absolute bottom-0 left-0 border-b-2 border-blue"
          :style="{ width: `${progress}%` }"
        ></div>
      </template>

      <slot />

      <template v-if="$slots.footer" #footer>
        <slot name="footer" />
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: null },
  progress: { type: Number, default: null },
});
</script>
