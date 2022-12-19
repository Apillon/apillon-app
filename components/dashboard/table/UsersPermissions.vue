<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="users"
    :loading="loading"
    :row-props="rowProps"
  />
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NTag, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const loading = ref<boolean>(true);
const SelectRole = resolveComponent('SelectRole');

onMounted(() => {
  getUsers();
});

const createColumns = ({
  handleRoleChange,
}: {
  handleRoleChange: (selected: number) => void;
}): DataTableColumns<ProjectUserInterface> => {
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
      key: 'role',
      className: '!py-0',
      render(row) {
        return h(
          SelectRole,
          {
            class: 'select-role',
            model: row.role_id,
            loading: row.loading,
            disabled: row.pendingInvitation === 1,
            onRoleChange: handleRoleChange,
          },
          ''
        );
      },
    },
    {
      title: $i18n.t('general.status'),
      key: 'active',
      render(row) {
        return h(
          NTag,
          { type: row.pendingInvitation ? 'default' : 'success', round: true, bordered: false },
          {
            default: () =>
              row.pendingInvitation ? $i18n.t('general.pending') : $i18n.t('general.active'),
          }
        );
      },
    },
    {
      title: $i18n.t('general.actions'),
      key: 'actions',
      align: 'right',
      className: '!py-0',
      render(row) {
        return h(
          NDropdown,
          {
            options: dropdownOptions,
            trigger: 'click',
            disabled: row.pendingInvitation === 1,
          },
          {
            default: () =>
              h(
                NButton,
                { size: 'small', quaternary: true },
                { default: () => h('span', { class: 'icon-more text-lg' }, {}) }
              ),
          }
        );
      },
    },
  ];
};
const currentRow = ref<ProjectUserInterface>({} as ProjectUserInterface);
const users = ref<Array<ProjectUserInterface>>([]);

const columns = createColumns({
  handleRoleChange(selected: number) {
    updateRole(currentRow.value.id, selected);
  },
});

function rowProps(row: ProjectUserInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

/**
 * Dropdown Actions
 */
const dropdownOptions = [
  {
    label: $i18n.t('general.delete'),
    key: 'delete',
    props: {
      onClick: () => {
        deleteRole(currentRow.value.id);
      },
    },
  },
];

/** Fetch Users on project */
async function getUsers() {
  loading.value = true;

  try {
    const res = await $api.get<ProjectUsersResponse>(
      endpoints.projectUsers(dataStore.currentProjectId)
    );
    users.value = res.data.items;
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loading.value = false;
}

/** Patch - update user's role */
async function updateRole(id: number, roleId: number) {
  updateLoadingStatusOnUsersRole(id, true);
  try {
    const res = await $api.patch<UpdateUserRoleResponse>(endpoints.projectUserRole(id), {
      role_id: roleId,
    });

    /** Show success msg and refresh users */
    message.success($i18n.t('form.success.updated.userRole'));
    await getUsers();
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  updateLoadingStatusOnUsersRole(id, false);
}

/** Delete permission - remove user from project */
async function deleteRole(id: number) {
  updateLoadingStatusOnUsersRole(id, true);

  try {
    await $api.delete<DeleteResponse>(endpoints.projectUserRole(id));

    message.success($i18n.t('form.success.deleted.userRole'));
    await getUsers();
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  updateLoadingStatusOnUsersRole(id, false);
}

function updateLoadingStatusOnUsersRole(id: number, enabled: boolean) {
  users.value.forEach(user => {
    if (user.id === id && user.pendingInvitation === 0) {
      user.loading = enabled;
    }
  });
}
</script>
