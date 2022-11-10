<template>
  <n-collapse
    class="collapse-nav"
    :theme-overrides="collapseNavOverrides"
    :default-expanded-names="['services', 'monitoring', 'configuration']"
  >
    <template #arrow>
      <span class="icon-right"></span>
    </template>

    <n-collapse-item v-for="(items, key) in menu" :key="key" :title="$t(`nav.${key}`)" :name="key">
      <div v-for="item in items" :key="item.name">
        <component
          :is="item.link ? NuxtLink : 'div'"
          :to="item.link || undefined"
          class="block h-[38px] w-full py-2 pl-2 pr-6 font-normal"
          :class="{ 'bg-grey-lightBg border-l-3 border-primary': currentRoute.name === item.name }"
        >
          <span :class="item.icon" class="text-base align-middle"></span>
          <span class="ml-2">{{ $t(`nav.${item.name}`) }}</span>
          <span
            v-if="item.new"
            class="icon-new float-right text-blue text-2xl"
            :class="`animation-new-${randomInteger(0, 3)}`"
          ></span>
        </component>
      </div>
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts" setup>
import { randomInteger } from '~~/lib/utils';
import colors from '~~/tailwind.colors';
import MainNavInterface from '~~/types/menu';

const collapseNavOverrides = {
  textColor: colors.white,
  titleTextColor: colors.grey.DEFAULT,
};

const NuxtLink = resolveComponent('NuxtLink');
const { currentRoute } = useRouter();

const menu: MainNavInterface = {
  services: [
    { name: 'authentication', icon: 'icon-authentication', link: '/service/authentication' },
    { name: 'storage', icon: 'icon-storage', new: true, link: '/service/storage' },
    { name: 'computing', icon: 'icon-computing', new: true },
  ],
  monitoring: [
    { name: 'analytics', icon: 'icon-analytics' },
    { name: 'serviceMonitor', icon: 'icon-service-monitor' },
  ],
  configuration: [
    { name: 'projectSettings', icon: 'icon-project-setting', link: '/project-settings' },
    { name: 'access', icon: 'icon-acess' },
    { name: 'billing', icon: 'icon-billing', link: '/billing' },
  ],
};
</script>

<style lang="postcss">
.n-collapse.collapse-nav {
  .n-collapse-item:not(:first-child) {
    border-top: 0;
  }

  .n-collapse-item {
    .n-collapse-item__header {
      @apply font-bold uppercase pl-2;
    }

    .n-collapse-item__header-main {
      letter-spacing: 0.3em;

      .n-collapse-item-arrow .icon-right {
        @apply w-4 text-grey;
      }
    }
  }
}
</style>
