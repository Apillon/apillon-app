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
        <div class="relative w-10 h-10 flex justify-center items-center rounded-[50%] bg-white">
          <span v-if="authStore.username" class="text-bg text-lg font-bold uppercase">
            {{ initials(authStore.username) }}
          </span>
          <span v-else class="icon-apillon-icon text-bg text-lg"></span>
        </div>
      </div>
      <div class="hidden md:flex items-center">
        <n-button class="w-10 px-1" size="small" type="tertiary" quaternary circle>
          <span class="icon-down text-3xl"></span>
        </n-button>
      </div>
    </div>
  </n-dropdown>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
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
    return h(resolveComponent('NuxtIcon'), { name: iconName, class: 'text-xl' }, '');
  };
};

const options = computed(() => [
  {
    key: 'profile',
    label: $i18n.t('profile.profile'),
    icon: renderIcon('icon-anonymous'),
  },
  {
    key: 'dashboard-payments',
    label: $i18n.t('profile.billing'),
    disabled: !dataStore.hasProjects,
    show: !dataStore.isProjectUser,
    icon: renderIcon('icon-billing'),
  },
  {
    key: 'dashboard-airdrop',
    label: $i18n.t('referral.banner.btn'),
    show: !dataStore.isProjectUser,
    icon: renderNuxtIcon('logo/apillon-icon'),
  },
  {
    key: 'dashboard-project-settings',
    label: $i18n.t('profile.settings'),
    disabled: !dataStore.hasProjects,
    icon: renderIcon('icon-project-setting'),
  },
  {
    key: 'logout',
    label: $i18n.t('profile.logout'),
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
