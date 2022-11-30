<template>
  <n-collapse
    class="collapse-nav"
    :theme-overrides="collapseNavOverrides"
    :default-expanded-names="defaultExpandedNames"
  >
    <template #arrow>
      <span class="icon-right"></span>
    </template>

    <n-collapse-item
      v-for="(section, key) in menu"
      :key="key"
      :title="$t(`nav.${key}`)"
      :name="key"
      :disabled="section.disabled"
    >
      <div v-for="item in section.items" :key="item.name">
        <component
          :is="item.link && !item.disabled ? NuxtLink : 'div'"
          :to="item.link || undefined"
          class="block h-[38px] w-full py-2 pl-2 pr-6 font-normal"
          :class="{
            'bg-grey-lightBg border-l-3 border-primary': currentRoute.name === item.name,
            'cursor-default opacity-70': item.disabled,
          }"
          @click.native="emit('toggleSidebar')"
        >
          <span :class="item.icon" class="text-base align-middle"></span>
          <span class="ml-2 select-none">{{ $t(`nav.${item.name}`) }}</span>
          <span
            v-if="item.soon"
            class="icon-soon float-right text-blue text-2xl"
            :class="`random-color-${randomInteger(0, 3)}`"
          >
            <span class="path2"></span>
            <span class="path3"></span>
            <span class="path4"></span>
            <span class="path5"></span>
          </span>
          <span
            v-else-if="item.new"
            class="icon-new float-right text-blue text-2xl"
            :class="`random-color-${randomInteger(0, 3)}`"
          ></span>
        </component>
      </div>
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts" setup>
import colors from '~~/tailwind.colors';

const emit = defineEmits(['toggleSidebar']);
const NuxtLink = resolveComponent('NuxtLink');
const { currentRoute } = useRouter();

/** Naive UI - Theme overrides */
const collapseNavOverrides = {
  textColor: colors.white,
  titleTextColor: colors.grey.DEFAULT,
};

const menu: MainNavInterface = {
  services: {
    items: [
      {
        name: 'authentication',
        icon: 'icon-authentication',
        new: true,
        link: '/dashboard/service/authentication',
        disabled: !isFeatureEnabled(Feature.AUTHENTICATION),
      },
      {
        name: 'storage',
        icon: 'icon-storage',
        new: true,
        link: '/dashboard/service/storage',
        disabled: !isFeatureEnabled(Feature.STORAGE),
      },
      {
        name: 'computing',
        icon: 'icon-computing',
        soon: true,
        disabled: !isFeatureEnabled(Feature.COMPUTING),
      },
    ],
    disabled: !isFeatureEnabled(Feature.SERVICES),
  },
  monitoring: {
    items: [
      { name: 'analytics', icon: 'icon-analytics' },
      { name: 'serviceMonitor', icon: 'icon-service-monitor' },
    ],
    disabled: !isFeatureEnabled(Feature.MONITORING),
  },
  configuration: {
    items: [
      {
        name: 'projectSettings',
        icon: 'icon-project-setting',
        link: '/dashboard/project-settings',
        disabled: !isFeatureEnabled(Feature.PROJECT_SETTINGS),
      },
      { name: 'access', icon: 'icon-acess', disabled: !isFeatureEnabled(Feature.ACCESS) },
      {
        name: 'billing',
        icon: 'icon-billing',
        link: '/dashboard/billing',
        disabled: !isFeatureEnabled(Feature.BILLING),
      },
    ],
    disabled: !isFeatureEnabled(Feature.CONFIGURATION),
  },
};

/** Expand only enabled sections */
const defaultExpandedNames = computed(() => {
  return Object.entries(menu)
    .filter(([_, item]) => !item.disabled)
    .map(([key, _]) => key);
});
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
      @apply select-none;
      letter-spacing: 0.3em;

      .n-collapse-item-arrow .icon-right {
        @apply w-4 text-grey;
      }
    }
  }
}
</style>
