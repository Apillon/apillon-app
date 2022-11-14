<template>
  <transition name="slide-down" appear>
    <div class="px-8 py-4">
      <div class="flex justify-between">
        <div class="pr-4">
          <select-options
            :key="componentSelectKey"
            v-model:value="dataStore.currentProjectId"
            :options="dataStore.projects"
            :theme-overrides="SelectProjectOverrides"
            class="select-project"
            size="small"
            :loading="loading"
          />
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
import { SelectProps } from 'naive-ui';
import colors from '~~/tailwind.colors';
import { useDataStore } from '~~/stores/data';

const dataStore = useDataStore();
const router = useRouter();
const componentSelectKey = ref(0);
const loading = ref(false);

type SelectThemeOverrides = NonNullable<SelectProps['themeOverrides']>;
const SelectProjectOverrides: SelectThemeOverrides = {
  peers: {
    InternalSelection: {
      color: colors.transparent,
      border: `0px solid ${colors.grey.DEFAULT}`,
      borderActive: `1px solid ${colors.blue}`,
      borderFocus: `1px solid ${colors.blue}`,
      borderHover: `1px solid ${colors.blue}`,
    },
  },
};

onBeforeMount(() => {
  if (!Array.isArray(dataStore.projects) || dataStore.projects.length === 0) {
    dataStore.promises.projects = dataStore.getProjects();
  }
});

/** Watcher - project change */
watch(
  () => dataStore.currentProjectId,
  async currentProjectId => {
    /** Reload projects if currentProjectId is new project */
    if (!dataStore.projects[currentProjectId]) {
      loading.value = true;
      dataStore.projects = [];

      await dataStore.getProjects();

      setTimeout(() => {
        loading.value = false;
        componentSelectKey.value += 1;
      }, 1000);
    }
    localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, `${currentProjectId}`);
    router.push('/');
  }
);
</script>

<style lang="postcss">
.n-select.select-project {
  @apply min-w-[120px];

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
