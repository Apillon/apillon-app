<template>
  <template
    v-if="dataStore.hasProjects && isFeatureEnabled(Feature.PROJECT, authStore.getUserRoles())"
  >
    <n-dropdown
      v-if="collapsed"
      :options="dropdownOptions"
      :disabled="authStore.isAdmin()"
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
      :disabled="authStore.isAdmin()"
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
const paymentStore = usePaymentsStore();
const { clearAll } = useStore();

const componentSelectKey = ref(0);
const loading = ref<boolean>(false);

const dropdownOptions = computed(() => {
  return dataStore.project.items.map((item: ProjectInterface) => {
    return {
      key: item.project_uuid,
      label: item.label,
      value: item.value,
      active: item.project_uuid === dataStore.project.selected,
      props: {
        class: item.project_uuid === dataStore.project.selected ? 'active' : '',
        onClick: () => {},
      },
    };
  });
});

onMounted(async () => {
  if (authStore.isAdmin()) {
    const currentProject = await dataStore.getProject(dataStore.project.selected);
    dataStore.project.items = [currentProject];
    dataStore.updateCurrentProject(currentProject);
  } else {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await dataStore.getProjects();

      /** Fetch active project data(get myRole_id_onProject) */
      Promise.resolve(dataStore.promises.projects).then(async _ => {
        await dataStore.getProject(dataStore.project.selected);
      });
    });
  }
});

/** Watcher - project change */
watch(
  () => dataStore.project.selected,
  async (projectUuid, oldProjectUuid) => {
    /** Clear all stored data */
    clearAll();

    /** Save current project ID to LS and redirect to Dashboard */
    localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, projectUuid);
    if (projectUuid !== oldProjectUuid && oldProjectUuid !== '') {
      router.push({ name: 'dashboard' });
    }

    /** Reload projects if projectUuid is new project */
    if (!dataStore.project.items.some(project => project.project_uuid === projectUuid)) {
      loading.value = true;
      dataStore.project.items = [];

      await dataStore.fetchProjects(false);

      setTimeout(() => {
        loading.value = false;
        componentSelectKey.value += 1;

        /** Refresh credits */
        paymentStore.fetchCredits();
      }, 1000);
    }
    /** Fetch selected project data(get myRole_id_onProject)  */
    await dataStore.fetchProject();
  }
);

function onDropdownSelect(key: string) {
  dataStore.project.selected = key;
}
</script>

<style lang="postcss"></style>
