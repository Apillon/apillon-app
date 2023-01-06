<template>
  <select-options
    v-if="dataStore.hasProjects && isFeatureEnabled(Feature.PROJECT)"
    :key="componentSelectKey"
    v-model:value="dataStore.currentProjectId"
    :options="dataStore.project.items"
    :theme-overrides="SelectProjectOverrides"
    class="select-project"
    size="small"
    :loading="loading"
  />
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const router = useRouter();
const componentSelectKey = ref(0);
const loading = ref(false);

type SelectThemeOverrides = NonNullable<NSelectProps['themeOverrides']>;
const SelectProjectOverrides: SelectThemeOverrides = {
  peers: {
    InternalSelection: {
      color: 'transparent',
      colorActive: 'transparent',
      border: 'none',
      borderActive: 'none',
      borderFocus: 'none',
      borderHover: 'none',
      boxShadowActive: 'none',
      boxShadowFocus: 'none',
      boxShadowHover: 'none',
    },
  },
};

onBeforeMount(() => {
  if (!dataStore.hasProjects) {
    dataStore.promises.projects = dataStore.fetchProjects(false);

    /** Fetch selected project data(get myRole_id_onProject) */

    Promise.all(Object.values(dataStore.promises)).then(_ => {
      dataStore.fetchProject();
    });
  }
});

/** Watcher - project change */
watch(
  () => dataStore.currentProjectId,
  async currentProjectId => {
    /** Reload projects if currentProjectId is new project */
    if (!dataStore.project.items[currentProjectId]) {
      loading.value = true;
      dataStore.project.items = [];

      await dataStore.fetchProjects(false);

      setTimeout(() => {
        loading.value = false;
        componentSelectKey.value += 1;
      }, 1000);
    }
    /** Fetch selected project data(get myRole_id_onProject) */
    await dataStore.fetchProject();

    /** Reset store data */
    dataStore.resetData();

    /** Save current project ID to LS and redirect to Dashboard */
    localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, `${currentProjectId}`);
    router.push({ name: 'dashboard' });
  }
);
</script>

<style lang="postcss">
.n-select.select-project {
  @apply min-w-[120px];

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
