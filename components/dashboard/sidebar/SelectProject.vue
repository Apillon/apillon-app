<template>
  <template
    v-if="dataStore.hasProjects && isFeatureEnabled(Feature.PROJECT, authStore.getUserRoles())"
  >
    <n-dropdown
      v-if="collapsed"
      :options="dropdownOptions"
      trigger="click"
      @select="onDropdownSelect"
    >
      <n-button
        v-bind="$attrs"
        class="w-full h-10 bg-bg-light"
        size="tiny"
        icon-placement="right"
        :loading="loading"
      >
        <span class="icon-down text-3xl"></span>
      </n-button>
    </n-dropdown>
    <select-options
      v-else
      v-bind="$attrs"
      :key="componentSelectKey"
      v-model:value="dataStore.project.selected"
      :options="dataStore.project.items"
      class="select-project"
      :loading="loading"
    />
  </template>
</template>

<script lang="ts" setup>
defineProps({
  collapsed: { type: Boolean, default: false },
});

const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();
const { clearAll } = useStore();

const componentSelectKey = ref(0);
const loading = ref<boolean>(false);

const dropdownOptions = computed(() => {
  return dataStore.project.items.map(item => {
    return {
      key: item.id,
      label: item.label,
      value: item.value,
      active: item.id === dataStore.project.selected,
      props: {
        class: item.id === dataStore.project.selected ? 'active' : '',
        onClick: () => {},
      },
    };
  });
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await dataStore.getProjects();

    /** Fetch active project data(get myRole_id_onProject) */
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await dataStore.getProject(dataStore.project.selected);
    });
  });
});

/** Watcher - project change */
watch(
  () => dataStore.project.selected,
  async (projectId, oldProjectId) => {
    /** Clear all stored data */
    clearAll();

    /** Save current project ID to LS and redirect to Dashboard */
    localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, `${projectId}`);
    if (projectId !== oldProjectId && oldProjectId > 0) {
      router.push({ name: 'dashboard' });
    }

    /** Reload projects if projectId is new project */
    if (!dataStore.project.items.some(project => project.id === projectId)) {
      loading.value = true;
      dataStore.project.items = [];

      await dataStore.fetchProjects(false);

      setTimeout(() => {
        loading.value = false;
        componentSelectKey.value += 1;
      }, 1000);
    }
    /** Fetch selected project data(get myRole_id_onProject)  */
    await dataStore.fetchProject();
  }
);

function onDropdownSelect(key: string | number) {
  dataStore.project.selected = Number(key);
}
</script>

<style lang="postcss"></style>
