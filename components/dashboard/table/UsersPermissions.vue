<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="settingsStore.users"
    :loading="loading"
    :row-props="rowProps"
  />
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NTag, useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const loading = ref<boolean>(false);
const SelectRole = resolveComponent('SelectRole');
const currentRow = ref<ProjectUserInterface>({} as ProjectUserInterface);

onMounted(() => {
  if (!settingsStore.hasUsers) {
    getUsers();
  }
});

const createColumns = ({
  handleRoleChange,
}: {
  handleRoleChange: (selected: number) => void;
}): NDataTableColumns<ProjectUserInterface> => {
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
            loading: row.loading,
            disabled: !isRoleChangeAllowed(row),
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
          {
            type: row.pendingInvitation ? 'default' : 'success',
            round: true,
            bordered: row.pendingInvitation,
          },
          {
            default: () =>
              row.pendingInvitation ? $i18n.t('general.pending') : $i18n.t('general.active'),
          }
        );
      },
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      className: '!py-0',
      render(row) {
        return h(
          NDropdown,
          {
            options: dropdownOptions(row),
            trigger: 'click',
          },
          {
            default: () =>
              h(
                NButton,
                { type: 'tertiary', size: 'small', quaternary: true, round: true },
                { default: () => h('span', { class: 'icon-more text-2xl' }, {}) }
              ),
          }
        );
      },
    },
  ];
};

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
const dropdownOptions = (user: ProjectUserInterface) => {
  return [
    {
      label: $i18n.t('general.delete'),
      key: 'delete',
      disabled: !isRoleDeletionAllowed(user),
      props: {
        class: '!text-pink',
        onClick: () => {
          if (isRoleDeletionAllowed(user)) {
            if (user.pendingInvitation === 1) {
              uninviteUser(currentRow.value);
            } else {
              deleteUser(currentRow.value.id);
            }
          }
        },
      },
    },
  ];
};

/** Check if user role can be changed - user is active and is not project owner */
function isRoleChangeAllowed(user: ProjectUserInterface) {
  return user.pendingInvitation !== 1 && isRoleDeletionAllowed(user);
}
function isRoleDeletionAllowed(user: ProjectUserInterface) {
  return user.role_id !== DefaultUserRole.PROJECT_OWNER && settingsStore.isUserOwner();
}

/** GET Users on project */
async function getUsers() {
  loading.value = true;
  await settingsStore.fetchProjectUsers();
  loading.value = false;
}

/** Patch - update user's role */
async function updateRole(id: number, roleId: number) {
  updateLoadingStatusOnUsersRole(id, true);
  try {
    await $api.patch<UpdateUserRoleResponse>(endpoints.projectUser(id), {
      role_id: roleId,
    });

    /** Show success msg and refresh users */
    message.success($i18n.t('form.success.updated.userRole'));
    await getUsers();
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  updateLoadingStatusOnUsersRole(id, false);
}

/** Un-invite user from project */
async function uninviteUser(user: ProjectUserInterface) {
  updateLoadingStatusOnUsersRole(user.id, true);

  try {
    await $api.post<DeleteResponse>(endpoints.projectUserUninvite(dataStore.projectUuid), {
      email: user.email,
    });

    /** Show success msg and refresh users */
    message.success($i18n.t('form.success.deleted.userUninvited'));
    await getUsers();
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  updateLoadingStatusOnUsersRole(user.id, false);
}

/** Remove user from project */
async function deleteUser(id: number) {
  updateLoadingStatusOnUsersRole(id, true);

  try {
    await $api.delete<DeleteResponse>(endpoints.projectUser(id));

    /** Show success msg and refresh users */
    message.success($i18n.t('form.success.deleted.user'));
    await getUsers();
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  updateLoadingStatusOnUsersRole(id, false);
}

function updateLoadingStatusOnUsersRole(id: number, enabled: boolean) {
  settingsStore.users.forEach(user => {
    if (user.id === id && user.pendingInvitation === 0) {
      user.loading = enabled;
    }
  });
}
</script>
