<template>
  <n-data-table :bordered="false" :columns="columns" :data="projectOwners" :loading="loading" />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const settingsStore = useSettingsStore();
const loading = ref<boolean>(false);

onMounted(async () => {
  if (!settingsStore.hasUsers) {
    loading.value = true;
    await settingsStore.fetchProjectUsers();
    loading.value = false;
  }
});

const createColumns = (): NDataTableColumns<ProjectUserInterface> => {
  return [
    {
      title: t('dashboard.user'),
      key: 'name',
    },
    {
      title: t('dashboard.email'),
      key: 'email',
    },
    {
      title: t('dashboard.role'),
      key: 'role_id',
      className: '!py-0',
      render(row) {
        return h(
          resolveComponent('SelectRole'),
          {
            class: 'select-role',
            model: row.role_id,
            disabled: true,
          },
          ''
        );
      },
    },
  ];
};

const columns = createColumns();

const projectOwners = computed<Array<ProjectUserInterface>>(() => {
  return settingsStore.users.filter(user => user.role_id === DefaultUserRole.PROJECT_OWNER);
});
</script>
