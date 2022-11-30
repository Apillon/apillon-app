<template>
  <select-options
    v-if="dataStore.hasProjects && isFeatureEnabled(Feature.PROJECT)"
    :key="componentSelectKey"
    v-model:value="dataStore.currentProjectId"
    :options="dataStore.projects"
    :theme-overrides="SelectProjectOverrides"
    class="select-project"
    size="small"
    :loading="loading"
  />
</template>

<script lang="ts" setup>
import { SelectProps } from 'naive-ui';
import { useDataStore } from '~~/stores/data';

const dataStore = useDataStore();
const router = useRouter();
const componentSelectKey = ref(0);
const loading = ref(false);

type SelectThemeOverrides = NonNullable<SelectProps['themeOverrides']>;
const SelectProjectOverrides: SelectThemeOverrides = {
  peers: {
    InternalSelection: {
      color: 'transparent',
      colorActive: 'transparent',
      border: 'none',
      borderActive: 'none',
      borderFocus: 'none',
      borderHover: 'none',
      borderPressed: 'none',
      boxShadowActive: 'none',
      boxShadowFocus: 'none',
      boxShadowHover: 'none',
    },
  },
};

onBeforeMount(() => {
  if (!dataStore.hasProjects) {
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
    router.push({ name: 'dashboard' });
  }
);
</script>

<style lang="postcss">
.n-select.select-project {
  @apply font-button min-w-[120px];

  .n-base-selection-label {
    background-color: transparent;

    .n-base-selection-input {
      padding-left: 0;
    }

    .n-base-selection-input__content {
      background-color: theme('colors.blue');
      color: theme('colors.dark');
      font-weight: bold;
      padding: 0 1px;
      margin-right: 10px;
    }

    .n-base-loading__placeholder {
      height: 16px;
      width: 16px;
    }
  }
}
</style>
