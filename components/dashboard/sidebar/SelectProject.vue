<template>
  <select-options
    v-if="dataStore.hasProjects && isFeatureEnabled(Feature.PROJECT)"
    :key="componentSelectKey"
    v-model:value="dataStore.currentProjectId"
    :options="dataStore.project.items"
    class="select-project"
    :loading="loading"
  />
</template>

<script lang="ts" setup>
const dataStore = useDataStore();
const router = useRouter();
const componentSelectKey = ref(0);
const loading = ref(false);

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

<style lang="postcss"></style>
