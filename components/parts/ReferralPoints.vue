<template>
  <span class="relative">
    <div
      class="absolute -bottom-6 left-6 z-1 flex h-[90px] w-[90px] items-center justify-center rounded-full bg-yellow"
    >
      <strong class="text-center text-base text-bg-dark">
        <span>{{ `+${points}` }}</span>
        <br />
        <span>{{ $t('referral.points') }}</span>
      </strong>
    </div>
  </span>
</template>

<script lang="ts" setup>
defineProps({
  points: { type: Number, default: 0 },
});
</script>
