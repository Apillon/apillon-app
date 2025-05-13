<template>
  <n-dropdown
    v-if="authStore.loggedIn"
    class="rounded-lg"
    placement="bottom-end"
    trigger="click"
    size="large"
    :options="options"
    style="min-width: 220px"
    @select="handleSelect"
  >
    <div class="flex cursor-pointer">
      <div class="flex items-center pr-1">
        <div class="relative flex h-10 w-10 items-center justify-center rounded-[50%] bg-white">
          <span v-if="authStore.username" class="text-lg font-bold uppercase text-bg">
            {{ initials(authStore.username) }}
          </span>
          <span v-else class="icon-apillon-icon text-lg text-bg"></span>
        </div>
      </div>
    </div>
  </n-dropdown>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();

const renderIcon = (iconName: string) => {
  return () => {
    return h('span', { class: `${iconName} text-xl` }, '');
  };
};
const renderNuxtIcon = (iconName: string) => {
  return () => {
    return h(resolveComponent('NuxtIcon'), { name: iconName, class: 'text' }, '');
  };
};

const options = computed(() => [
  {
    key: 'dashboard-account-management',
    label: t('profile.account'),
    icon: renderIcon('icon-anonymous'),
  },
  {
    key: 'dashboard-payments',
    label: t('profile.billing'),
    disabled: !dataStore.hasProjects,
    show: !dataStore.isProjectUser,
    icon: renderIcon('icon-billing'),
  },
  {
    key: 'dashboard-project-settings',
    label: t('profile.settings'),
    disabled: !dataStore.hasProjects,
    icon: renderIcon('icon-project-setting'),
  },
  {
    key: 'logout',
    label: t('profile.logout'),
    icon: renderNuxtIcon('icon/logout'),
  },
]);

function handleSelect(key: string | number) {
  if (key === 'logout') {
    authStore.logout();
    router.push({ name: 'login' });
  } else if (key) {
    router.push({ name: `${key}` });
  }
}

/** Initials from username (firstname and lastname) */
function initials(username: string): string {
  return username
    .split(' ')
    .map(part => part.slice(0, 1))
    .join('');
}
</script>
