<template>
  <transition name="slide-down" appear>
    <div class="px-8 py-4">
      <div class="flex justify-between">
        <div class="pr-4">
          <n-select
            v-model:value="currentProject"
            class="select-project"
            :theme-overrides="SelectProjectOverrides"
            :options="projects"
          >
            <template #arrow>
              <span class="icon-down text-2xl"></span>
            </template>
          </n-select>
        </div>
        <n-space align="center" :size="32">
          <div class="w-[20vw] max-w-xs">
            <n-input
              type="text"
              name="search"
              size="small"
              class="bg-grey-lightBg"
              placeholder="Search the docs"
            />
          </div>
          <HeaderProfile />
        </n-space>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { NInput, NSpace, NSelect } from 'naive-ui';
import colors from '~~/tailwind.colors';

const SelectProjectOverrides = {
  InternalSelection: {
    heightMedium: '24px',
    color: colors.transparent,
    borderActive: `1px solid ${colors.blue}`,
    borderFocus: `1px solid ${colors.blue}`,
    borderHover: `1px solid ${colors.blue}`,
  },
  InternalSelectMenu: {
    color: colors.dark,
  },
};

const currentProject = ref(0);
const projects = [
  {
    label: 'Project_name',
    value: 0,
  },
  {
    label: 'First project',
    value: 1,
  },
];
</script>

<style lang="postcss">
.n-select.select-project {
  .n-base-selection-label {
    background-color: transparent;

    .n-base-selection-input__content {
      background-color: theme('colors.blue');
      color: theme('colors.dark');
      font-weight: bold;
      margin-right: 10px;
    }
  }
}
</style>
