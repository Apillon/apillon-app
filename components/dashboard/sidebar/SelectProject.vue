<template>
  <template v-if="dataStore.hasProjects">
    <n-dropdown
      v-if="collapsed"
      :options="dropdownOptions"
      :disabled="authStore.isAdmin()"
      trigger="click"
      @select="onDropdownSelect"
    >
      <n-button v-bind="$attrs" class="h-10 w-full bg-bg-light" size="tiny" icon-placement="right" :loading="loading">
        <span class="icon-down text-3xl"></span>
      </n-button>
    </n-dropdown>
    <select-options
      v-else
      v-bind="$attrs"
      :key="componentSelectKey"
      v-model:value="dataStore.project.selected"
      :options="dropdownOptions"
      class="select-project"
      :loading="loading"
      :disabled="authStore.isAdmin()"
    />
  </template>
  <!-- Modal - Create new project -->
  <modal v-model:show="modalNewProjectVisible" :title="$t('project.new')">
    <FormProject @submit-success="modalNewProjectVisible = false" />
  </modal>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';

const props = defineProps({
  collapsed: { type: Boolean, default: false },
});
const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const { clearAll } = useStore();

const NEW_PROJECT_KEY = 'new-project';
const componentSelectKey = ref<number>(0);
const loading = ref<boolean>(false);
const modalNewProjectVisible = ref<boolean>(false);

const dropdownOptions = computed(() => {
  const projects = dataStore.project.items.map((item: ProjectInterface) => {
    return {
      key: item.project_uuid,
      label: item.label,
      value: item.value,
      active: item.project_uuid === dataStore.project.selected,
      props: {
        class: item.project_uuid === dataStore.project.selected ? 'active' : '',
      },
    };
  });

  return [
    ...projects,
    {
      key: NEW_PROJECT_KEY,
      label: t('project.new'),
      value: NEW_PROJECT_KEY,
      props: {
        class: 'dropdown-new-project',
        onClick: () => {
          modalNewProjectVisible.value = true;
        },
      },
      render: renderOption,
    },
  ];
});

/** Watcher - project change */
watch(
  () => dataStore.project.selected,
  async (projectUuid, oldProjectUuid) => {
    /** Clear all stored data */
    clearAll();

    if (projectUuid) {
      /** Payment loader */
      paymentStore.loading = true;

      /** Save current project ID to LS and redirect to Dashboard */
      console.debug(DataLsKeys.CURRENT_PROJECT_ID, projectUuid);
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
        }, 1000);
      }
      /** Fetch selected project data(get myRole_id_onProject)  */
      await dataStore.fetchProject(projectUuid);

      /** Refresh credits */
      paymentStore.fetchCredits();

      /** Refresh active subscription */
      paymentStore.fetchActiveSubscription();
    }
  }
);

function onDropdownSelect(key: string) {
  if (key !== NEW_PROJECT_KEY) {
    dataStore.project.selected = key;
  }
}

/**
 * Render functions
 */
function renderOption(info: RenderOptionInfo) {
  if (info.option.key === NEW_PROJECT_KEY) {
    return h(
      resolveComponent('Btn'),
      {
        class: 'locked mt-2',
        type: 'info',
        size: props.collapsed ? 'small' : 'large',
        onClick: () => {
          modalNewProjectVisible.value = true;
        },
      },
      () => info.option.label as string
    );
  }
  return info.node;
}
</script>
