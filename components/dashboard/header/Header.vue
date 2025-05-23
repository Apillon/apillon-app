<template>
  <transition name="slide-down" appear>
    <div
      class="p-4 pb-0 sm:px-8"
      :class="{ 'bg-bg-light/65': dataStore.project.selected && currentRoute.name != 'dashboard' }"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center pr-2 sm:pr-4">
          <small v-if="pageTitle">{{ pageTitle }}</small>

          <!-- Hamburger btn to show sidebar on mobile -->
          <BtnHamburger class="mr-2 flex sm:mr-4 lg:hidden" @click="emit('toggleSidebar')" />
        </div>

        <slot />

        <div class="flex flex-nowrap items-center gap-3 lg:gap-4">
          <n-dropdown :options="docs" @select="handleSelect">
            <n-button class="h-10 !p-[10px]">
              <NuxtIcon name="icon/help" class="text-xl" />
            </n-button>
          </n-dropdown>
          <PaymentCredits />
          <HeaderNotifications />
          <div class="h-5 w-0 border-l border-bg-lighter"></div>
          <HeaderProfile v-if="!authStore.isAdmin()" />
        </div>
      </div>

      <!-- Admin notification -->
      <NotificationBar v-if="authStore.isAdmin()" class="absolute left-1/2 top-0 -translate-x-1/2" type="warning">
        {{ $t('dashboard.adminMode') }}
      </NotificationBar>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const emit = defineEmits(['toggleSidebar', 'toggleChat']);

const { t } = useI18n();
const { currentRoute } = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();
const pageTitle = useState('pageTitle');

const renderIcon = (iconName: string) => {
  return () => {
    return h(resolveComponent('NuxtIcon'), { name: iconName, class: 'text-xl mx-2' }, '');
  };
};

const docs = [
  {
    key: 'readDocs',
    label: t('dashboard.readDocs'),
    link: 'https://wiki.apillon.io',
    iconName: 'icon/file',
    icon: renderIcon('icon/file'),
  },
  {
    key: 'tutorials',
    label: t('dashboard.tutorials'),
    link: 'https://blog.apillon.io/tagged/tutorial',
    iconName: 'icon/guide',
    icon: renderIcon('icon/guide'),
  },
  {
    key: 'demoVideo',
    label: t('dashboard.demoVideo'),
    link: 'https://www.youtube.com/watch?v=qQJnuvUo-xo',
    iconName: 'social/youtube',
    icon: renderIcon('social/youtube'),
  },
  {
    key: 'discord',
    label: t('dashboard.discord'),
    link: 'https://discord.com/invite/yX3gTw36C4',
    iconName: 'social/discord',
    icon: renderIcon('social/discord'),
  },
];

function handleSelect(key: string) {
  const doc = docs.find(item => item.key === key);

  if (doc && doc.link) {
    window.open(doc.link, '_blank');
  }
}
</script>
