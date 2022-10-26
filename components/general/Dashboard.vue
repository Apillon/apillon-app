<template>
  <n-space v-if="loading" vertical>
    <n-skeleton height="40px" width="33%" />
    <n-skeleton height="40px" width="66%" :sharp="false" />
    <n-skeleton height="40px" round />
    <n-skeleton height="40px" circle />
  </n-space>
  <div v-else>
    <div v-if="$slots.heading" class="mb-10">
      <slot name="heading"> </slot>
    </div>

    <div v-if="$slots.infobar" class="px-9 py-3 mb-8 bg-grey-lightBg">
      <slot name="infobar"> </slot>
    </div>

    <div class="flex flex-auto w-full">
      <div v-if="$slots.sidebar" class="w-44 h-fit mr-6">
        <slot name="sidebar"></slot>
      </div>
      <n-layout :has-sider="$slots.learn ? true : false" sider-placement="right">
        <n-layout-header v-if="$slots.title">
          <slot name="title"></slot>
        </n-layout-header>
        <n-layout-content>
          <slot />
        </n-layout-content>
        <n-layout-sider
          v-if="$slots.learn"
          :collapsed="learnCollapsed"
          collapse-mode="width"
          :collapsed-width="48"
          :width="356"
          content-style="padding-left: 32px;"
          @after-enter="handleOnUpdateCollapse(false)"
          @after-leave="handleOnUpdateCollapse(true)"
        >
          <div class="mb-2">
            <h6 v-if="!learnCollapsed" class="inline-block">
              {{ $t('general.learn') }}
            </h6>
            <button
              class="btn-collapse flex justify-center items-center w-8 h-7 float-right border-[1px] text-[10px]"
              @click="learnCollapsed = !learnCollapsed"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  d="M3.27273 5.45453V18.5454L12 12L3.27273 5.45453Z"
                  fill="#F0F2DA"
                  :class="learnCollapsed ? 'translate-x-[9px]' : 'translate-x-0'"
                />
                <path
                  d="M20.7271 18.5454V5.45453L11.9998 12L20.7271 18.5454Z"
                  fill="#F0F2DA"
                  :class="learnCollapsed ? '-translate-x-[9px]' : 'translate-x-0'"
                />
              </svg>
            </button>
          </div>

          <slot v-if="!learnCollapsed" name="learn"></slot>
        </n-layout-sider>
      </n-layout>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NLayout, NLayoutContent, NLayoutSider, NLayoutHeader, NSkeleton, NSpace } from 'naive-ui';

defineProps({
  loading: { type: Boolean, default: false },
});

// Keep info about collapsible section learn in local storage
const learnCollapsed = ref<boolean>(localStorage.getItem('learnCollapsed') === '1' || false);

function handleOnUpdateCollapse(value: boolean) {
  localStorage.setItem('learnCollapsed', value ? '1' : '0');
}
</script>

<style lang="postcss">
.btn-collapse > svg path {
  transition: all 0.5s;
}
</style>
