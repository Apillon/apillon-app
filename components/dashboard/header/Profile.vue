<template>
  <n-dropdown
    v-if="authStore.loggedIn"
    placement="bottom-end"
    trigger="click"
    size="huge"
    :options="options"
    @select="handleSelect"
  >
    <div class="flex cursor-pointer">
      <div class="flex items-center pr-2">
        <div
          class="relative w-10 h-10 flex justify-center items-center rounded-[50%] bg-grey-light"
        >
          <span class="icon-apillon-icon text-dark text-lg"></span>
          <span
            class="absolute right-0 bottom-0 icon-status text-green translate-x-1/4 translate-y-1/4 text-xl"
          ></span>
        </div>
      </div>
      <div class="flex flex-col min-w-[120px] pr-1">
        <strong v-if="authStore.username">{{ authStore.username }}</strong>
        <strong v-else>{{ authStore.email }}</strong>
        <span class="text-grey">{{ truncateWallet(authStore.userUuid) }}</span>
      </div>
      <div class="flex items-center">
        <span class="icon-down text-2xl"></span>
      </div>
    </div>
  </n-dropdown>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';
const authStore = useAuthStore();
const router = useRouter();

const options = [
  {
    label: 'Profile',
    key: 'profile',
  },
  {
    label: 'Edit Profile',
    key: 'editProfile',
  },
  {
    label: 'Logout',
    key: 'logout',
  },
];

function handleSelect(key: string | number) {
  if (key === 'logout') {
    authStore.logout();
    router.push({ name: 'login' });
  } else {
    router.push({ name: 'profile' });
  }
}
</script>
