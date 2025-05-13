<template>
  <transition name="slide-down" appear>
    <div class="flex items-end">
      <n-space align="center" :size="32">
        <button class="border-b-3 border-primary font-bold">Resource</button>
        <button class="text-body">Active</button>
        <button class="text-body">Settings</button>
      </n-space>
    </div>
  </transition>
</template>

<script lang="ts" setup></script>
