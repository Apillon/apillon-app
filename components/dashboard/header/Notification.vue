<template>
  <n-card class="mb-4 max-w-96" size="small">
    <template #header>
      <span class="icon-info mr-2 text-xl"></span>
      <span v-if="notification.message" class="relative -top-[2px] inline-block">New notification</span>
      <span v-else-if="notification.type" class="relative -top-[2px] inline-block">
        {{ renderNotificationTypeMessage(notification.type) }}
      </span>
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

    <p v-if="notification.message" :class="$style.nContent" v-html="notification.message"></p>
    <template #footer>
      <div class="text-right">
        <span>{{ dateTimeToDate(notification.createTime) }}</span>
      </div>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import { dateTimeToDate } from '~/lib/utils/dates';

defineProps({
  notification: { type: Object as PropType<NotificationInterface>, default: () => {} },
});

const settingsStore = useSettingsStore();

const renderNotificationTypeMessage = (type: NotificationType) => {
  switch (type) {
    case NotificationType.WEBSITE_DEPLOYED:
      return 'Website deployed';
    case NotificationType.NFT_METADATA_DEPLOYED:
      return 'NFT metadata deployed';
    case NotificationType.NFT_COLLECTION_DEPLOYED:
      return 'NFT collection deployed';
    case NotificationType.CLOUD_FUNCTION_DEPLOYED:
      return 'Cloud function deployed';
    case NotificationType.INDEXER_DEPLOYED:
      return 'Indexer deployed';
    case NotificationType.SMART_CONTRACT_DEPLOYED:
      return 'Smart contract deployed';
    case NotificationType.EMBEDDED_WALLET_GENERATED:
      return 'Embedded wallet generated';
    default:
      return 'Unknown notification type';
  }
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
