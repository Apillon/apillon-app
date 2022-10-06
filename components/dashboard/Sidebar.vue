<template>
  <transition name="slide-left" appear>
    <n-config-provider
      :theme="darkTheme"
      class="absolute left-0 top-0 bottom-0 w-64 min-h-full bg-black text-white"
    >
      <n-scrollbar style="max-height: 100vh" class="scrollbar--menu">
        <n-space class="py-6" size="large" vertical>
          <div class="flex justify-center">
            <NuxtLink to="/login">
              <span class="icon-apillon-icon text-3xl"></span>
            </NuxtLink>
          </div>
          <div class="pr-4">
            <n-select v-model:value="currentProject" :options="projects" />
          </div>
          <Btn type="secondary" size="sm"> New Project </Btn>
          <button class="bg-purple-black">Project overview</button>
          <SidebarNav />
          <SidebarNav />
        </n-space>
        <SidebarFooter />
      </n-scrollbar>
    </n-config-provider>
  </transition>
</template>

<script lang="ts" setup>
import { NConfigProvider, NScrollbar, NSpace, NSelect, darkTheme } from 'naive-ui';

const currentProject = ref(0);
const projects = [
  {
    label: 'Hello world',
    value: 0,
  },
  {
    label: 'First project',
    value: 1,
  },
];
</script>

<style lang="postcss">
.scrollbar--menu .n-scrollbar-content {
  @apply min-h-full flex flex-col justify-between;
}
</style>
