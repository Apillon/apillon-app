<template>
  <div>
    <div v-if="$slots.heading" class="mb-10">
      <slot name="heading"> </slot>
    </div>

    <div v-if="$slots.infobar" class="bg-white px-9 py-3 mb-8">
      <slot name="infobar"> </slot>
    </div>

    <div class="flex flex-auto w-full">
      <div v-if="$slots.sidebar" class="bg-white w-44 py-6 mr-6 rounded">
        <slot name="sidebar"></slot>
      </div>
      <!-- <div class="w-[inherit]">
        <slot />
      </div>
      <div v-if="$slots.learn" class="w-[356px] mt-16">
      </div> -->
      <n-layout :has-sider="$slots.learn ? true : false" sider-placement="right">
        <n-layout-header v-if="$slots.title">
          <slot name="title"></slot>
        </n-layout-header>
        <n-layout-content>
          <slot />
        </n-layout-content>
        <n-layout-sider
          :collapsed="learnCollapsed"
          collapse-mode="width"
          :collapsed-width="48"
          :width="356"
          content-style="padding-left: 32px;"
        >
          <div class="mb-2">
            <strong v-if="!learnCollapsed" class="uppercase">{{ $t('general.learn') }}</strong>
            <button class="float-right border-[1px]" @click="learnCollapsed = !learnCollapsed">
              <span v-if="learnCollapsed" class="icon-tip text-primary"></span>
              <span v-else class="icon-go-to"></span>
              <span class="icon-back"></span>
            </button>
          </div>

          <slot v-if="!learnCollapsed" name="learn"></slot>
        </n-layout-sider>
      </n-layout>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NLayout, NLayoutContent, NLayoutSider, NLayoutHeader } from 'naive-ui';

const learnCollapsed = ref(false);
</script>
