<template>
  <Tag v-if="status !== null" :animation="status < SocialStatus.INACTIVE" :type="getStatus(status)">
    <span v-if="$te(`social.chat.status.${status}`)" class="mx-1 uppercase">
      {{ $t(`social.chat.status.${status}`) }}
    </span>
    <span v-else class="mx-1 uppercase">{{ SocialStatus[status].replaceAll('_', ' ') }}</span>
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number, default: null },
});

/** Deployment status */
function getStatus(status: number): TagType {
  switch (status) {
    case SocialStatus.DRAFT:
      return 'warning';
    case SocialStatus.INCOMPLETE:
      return 'warning';
    case SocialStatus.INACTIVE:
      return 'info';
    case SocialStatus.ACTIVE:
      return 'success';
    case SocialStatus.ARCHIVE:
      return 'info';
    case SocialStatus.BLOCKED:
      return 'error';
    case SocialStatus.DELETED:
      return 'error';
    case SocialStatus.FAILED:
      return 'error';
    default:
      return 'default';
  }
}
</script>
