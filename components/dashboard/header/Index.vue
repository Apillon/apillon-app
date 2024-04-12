<template>
  <transition name="slide-down" appear>
    <div class="px-4 sm:px-8 py-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center pr-2 sm:pr-4">
          <!-- Hamburger btn to show sidebar on mobile -->
          <BtnHamburger class="flex lg:hidden mr-2 sm:mr-4" @click="emit('toggleSidebar')" />

          <!-- Search docs -->
          <div
            v-if="isFeatureEnabled(Feature.SEARCH, authStore.getUserRoles())"
            class="min-w-[11rem] w-[20vw] max-w-xs"
          >
            <a
              class="flex items-center"
              href="https://wiki.apillon.io/build/1-apillon-api.html"
              target="_blank"
            >
              <n-input
                type="text"
                name="search"
                size="small"
                :placeholder="$t('dashboard.searchDocs')"
                clearable
              >
                <template #prefix>
                  <span class="icon-search text-2xl text-bodyDark"></span>
                </template>
              </n-input>
            </a>
          </div>
          <div v-if="isLg" class="flex gap-2">
            <a
              v-for="doc in docs"
              :key="doc.key"
              class="flex items-center"
              :href="doc.link"
              target="_blank"
            >
              <n-button size="small" :bordered="false">
                <NuxtIcon :name="doc.iconName" class="text-xl mr-2" />
                {{ doc.label }}
              </n-button>
            </a>
          </div>
          <n-dropdown v-else :options="docs" @select="handleSelect">
            <n-button>
              <NuxtIcon name="icon/file" class="text-xl mr-2" />
              {{ $t('dashboard.guides') }}
            </n-button>
          </n-dropdown>
        </div>

        <n-space :size="isSm ? 32 : 16" align="center">
          <!-- Credits -->
          <PaymentCredits />

          <!-- User profile -->
          <HeaderProfile v-if="!authStore.isAdmin()" />
        </n-space>
      </div>

      <!-- Admin notification -->
      <NotificationBar
        v-if="authStore.isAdmin()"
        class="absolute top-0 left-1/2 -translate-x-1/2"
        type="warning"
      >
        {{ $t('dashboard.adminMode') }}
      </NotificationBar>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { NSpace } from 'naive-ui';

const emit = defineEmits(['toggleSidebar', 'toggleChat']);

const { t } = useI18n();
const authStore = useAuthStore();
const { isSm, isLg } = useScreen();

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
