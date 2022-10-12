<template>
  <transition name="slide-down" appear>
    <div class="flex items-end h-8 px-20 bg-dark">
      <n-space align="center" :size="32">
        <button class="font-bold border-b-3 border-primary">Resource</button>
        <button class="text-grey">Active</button>
        <button class="text-grey">Settings</button>
      </n-space>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { NSpace } from 'naive-ui';
</script>
