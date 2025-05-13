<template>
  <pill v-bind="$attrs" :type="jobStatusType(jobStatus)">
    <n-space :size="0" align="center" :wrap="false">
      <span class="mx-1 uppercase">{{ $t(`computing.cloudFunctions.job.status.${jobStatus}`) }}</span>
      <AnimationTyping v-if="jobStatus < AcurastJobStatus.MATCHED" />
    </n-space>
  </pill>
</template>

<script lang="ts" setup>
defineProps({
  jobStatus: { type: Number as PropType<AcurastJobStatus>, default: 0 },
});

const jobStatusType = (status: number) => {
  switch (status) {
    case AcurastJobStatus.DELETED:
      return 'error';
    case AcurastJobStatus.INACTIVE:
      return 'warning';
    case AcurastJobStatus.DEPLOYING:
    case AcurastJobStatus.DEPLOYED:
      return 'info';
    default:
      return 'success';
  }
};
</script>
