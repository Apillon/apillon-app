<template>
  <span class="relative">
    <div
      class="absolute left-6 -bottom-6 w-[90px] h-[90px] flex justify-center items-center rounded-full bg-yellow z-1"
    >
      <strong class="text-black text-base text-center">
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
