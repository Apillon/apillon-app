<template>
  <n-tag
    v-bind="$attrs"
    :type="getStatus(status)"
    :bordered="status < SocialStatus.INACTIVE"
    size="tiny"
    round
  >
    <n-space
      :class="status < SocialStatus.INACTIVE ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span v-if="$te(`social.chat.status.${status}`)" class="mx-1 uppercase">
        {{ $t(`social.chat.status.${status}`) }}
      </span>
      <span v-else class="mx-1 uppercase">{{ SocialStatus[status] }}</span>

      <AnimationTyping v-if="status < SocialStatus.INACTIVE" />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
defineProps({
  status: {
    type: Number,
    default: 0,
  },
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
    case SocialStatus.MARKED_FOR_DELETION:
      return 'info';
    case SocialStatus.BLOCKED:
      return 'error';
    case SocialStatus.DELETED:
      return 'error';
    default:
      return 'default';
  }
}
</script>
