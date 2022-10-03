<template>
  <transition name="slide-down" appear>
    <div class="px-8 py-4 bg-white">
      <div class="flex justify-between">
        <div class="flex">
          <div class="flex items-end justify-end bg-grey-lighter/40 rounded mr-2 w-10 h-10 p-[6px]">
            <span class="icon-edit text-grey-light"></span>
          </div>
          <div>
            <p><strong>Project_name</strong></p>
            <p>Short description</p>
          </div>
        </div>
        <n-space align="center" :size="16">
          <div>
            <n-input type="text" name="" size="small" placeholder="Search the docs">
              <template #prefix>
                <span class="icon-mail"></span>
              </template>
            </n-input>
          </div>
          <div>OR</div>
          <div>Go to docs</div>
          <div class="h-6 w-[1px] bg-grey-light"></div>
          <div>Guy Hawkins</div>
        </n-space>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { NInput, NSpace } from 'naive-ui';
</script>
