<template>
  <n-dropdown
    v-if="authStore.loggedIn"
    placement="bottom-end"
    trigger="click"
    size="large"
    :options="options"
    @select="handleSelect"
  >
    <div class="flex cursor-pointer">
      <div class="flex items-center pr-2">
        <div class="relative w-10 h-10 flex justify-center items-center rounded-[50%] bg-white">
          <span v-if="authStore.username" class="text-bg text-lg font-bold uppercase">
            {{ initials(authStore.username) }}
          </span>
          <span v-else class="icon-apillon-icon text-bg text-lg"></span>
        </div>
      </div>
      <div class="hidden md:flex items-center">
        <span class="icon-down text-2xl"></span>
      </div>
    </div>
  </n-dropdown>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const router = useRouter();
const $i18n = useI18n();

const options = [
  {
    label: $i18n.t('profile.profile'),
    key: 'profile',
  },
  {
    label: $i18n.t('profile.logout'),
    key: 'logout',
  },
];

function handleSelect(key: string | number) {
  if (key === 'logout') {
    authStore.logout();
    router.push({ name: 'login' });
  } else if (key === 'profile') {
    router.push({ name: 'profile' });
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
