<template>
  <select-options
    v-if="dataStore.hasProjects && isFeatureEnabled(Feature.PROJECT, authStore.getUserRoles())"
    :key="componentSelectKey"
    v-model:value="dataStore.project.selected"
    :options="dataStore.project.items"
    class="select-project"
    :loading="loading"
  />
</template>

<script lang="ts" setup>
const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();
const { clearAll } = useStore();

const componentSelectKey = ref(0);
const loading = ref<boolean>(false);

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

    /** Save current project ID to LS and redirect to Dashboard */
    localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, `${projectId}`);
    if (projectId !== oldProjectId && oldProjectId > 0) {
      router.push({ name: 'dashboard' });
    }
  }
);
</script>

<style lang="postcss"></style>
