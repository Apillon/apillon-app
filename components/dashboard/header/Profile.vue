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
      <div class="hidden md:flex flex-col justify-center min-w-[120px] pr-1">
        <strong v-if="authStore.username">{{ authStore.username }}</strong>
        <strong v-else>{{ authStore.email }}</strong>
        <span v-if="authStore.wallet" class="text-grey">
          {{ truncateWallet(authStore.wallet) }}
        </span>
        <span v-else-if="authStore.username" class="text-grey">
          {{ authStore.email }}
        </span>
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
</script>
