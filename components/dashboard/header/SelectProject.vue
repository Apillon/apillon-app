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
import colors from '~~/tailwind.colors';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const dataStore = useDataStore();
const router = useRouter();
const componentSelectKey = ref(0);
const loading = ref(false);

type SelectThemeOverrides = NonNullable<NSelectProps['themeOverrides']>;
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
  if (!dataStore.hasProjects) {
    dataStore.promises.projects = dataStore.getProjects(false, $i18n);
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

      await dataStore.getProjects(false, $i18n);

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

    .n-base-selection-input__content {
      background-color: theme('colors.blue');
      color: theme('colors.dark');
      font-weight: bold;
      margin-right: 10px;
    }
  }
}
</style>
