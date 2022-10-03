<template>
  <transition name="slide-down" appear>
    <div class="px-20 pt-3 bg-white">
      <n-space align="center" :size="32">
        <button>Resource</button>
        <button>Active</button>
        <button>Settings</button>
      </n-space>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { NSpace } from 'naive-ui';
</script>
