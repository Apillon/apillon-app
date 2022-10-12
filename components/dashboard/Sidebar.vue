<template>
  <transition name="slide-left" appear>
    <div class="absolute left-0 top-0 bottom-0 w-64 min-h-full text-white">
      <n-scrollbar style="max-height: 100vh" class="scrollbar--menu">
        <n-space class="py-6" :size="24" vertical>
          <div class="flex justify-center">
            <NuxtLink to="/login">
              <span class="icon-apillon text-2xl"></span>
            </NuxtLink>
          </div>
          <div class="text-center">
            <Btn size="tiny" quaternary>{{ $t('dashboard.newProject') }}</Btn>
          </div>
          <div class="pl-4 mt-6">
            <NuxtLink
              to="/"
              class="block p-2 h-[38px] w-full text-left border-primary"
              :class="{ 'bg-grey-dark border-l-3': currentRoute.name === 'index' }"
            >
              <span class="icon-home text-primary"></span>
              <strong class="ml-1">{{ $t('dashboard.projectOverview') }}</strong>
            </NuxtLink>
          </div>
          <SidebarNav class="pl-4" />
        </n-space>
        <SidebarFooter />
      </n-scrollbar>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { NScrollbar, NSpace } from 'naive-ui';

const { currentRoute } = useRouter();
</script>

<style lang="postcss">
.scrollbar--menu .n-scrollbar-content {
  @apply min-h-full flex flex-col justify-between;
}
</style>
