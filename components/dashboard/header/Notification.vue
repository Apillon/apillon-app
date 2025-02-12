<template>
  <n-card class="mb-4 max-w-96" size="small" :theme-overrides="dropdownOverrides">
    <template #header>
      <span class="icon-info mr-2 text-xl"></span>
      <span class="relative -top-[2px] inline-block">New version deployed</span>
    </template>
    <template #header-extra>
      <NuxtIcon
        v-if="settingsStore.notifications.read.includes(notification.id)"
        name="dashboard/check"
        class="text-2xl text-green"
      />
      <button v-else @click="settingsStore.readNotification(notification.id)">
        <NuxtIcon name="dashboard/check" class="text-2xl" />
      </button>
    </template>

    <p :class="$style.nContent" v-html="notification.message"></p>

    <template #footer>
      <div class="text-right">
        <span>{{ dateTimeToDate(notification.createTime) }}</span>
      </div>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import type { DropdownProps } from 'naive-ui';
import colors from '~/tailwind.colors';
import { dateTimeToDate } from '~/lib/utils/dates';

defineProps({
  notification: { type: Object as PropType<NotificationInterface>, default: {} },
});

const settingsStore = useSettingsStore();

/** Theme override */
const dropdownOverrides: NonNullable<DropdownProps['themeOverrides']> = {
  borderColor: colors.bg.lighter,
};
</script>

<style lang="postcss" module>
.nContent {
  @apply break-words;

  a {
    @apply whitespace-nowrap font-bold text-blue;
  }
}
</style>
