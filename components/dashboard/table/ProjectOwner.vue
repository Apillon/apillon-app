<template>
  <n-data-table :bordered="false" :columns="columns" :data="projectOwners" :loading="loading" />
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui';

const $i18n = useI18n();
const settingsStore = useSettingsStore();
const loading = ref<boolean>(false);
const SelectRole = resolveComponent('SelectRole');

onMounted(async () => {
  if (!settingsStore.hasUsers) {
    loading.value = true;
    await settingsStore.fetchProjectUsers();
    loading.value = false;
  }
});

const createColumns = (): DataTableColumns<ProjectUserInterface> => {
  return [
    {
      title: $i18n.t('dashboard.user'),
      key: 'name',
    },
    {
      title: $i18n.t('dashboard.email'),
      key: 'email',
    },
    {
      title: $i18n.t('dashboard.role'),
      key: 'role_id',
      className: '!py-0',
      render(row) {
        return h(
          SelectRole,
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
