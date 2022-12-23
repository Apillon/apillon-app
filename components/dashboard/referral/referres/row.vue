<template>
  <!-- Referral - intro -->
  <div class="bg-grey-lightBg grid grid-cols-3 gap-4 py-4">
    <div class="pl-5 text-secondary flex">
      <div
        class="w-[8px] h-[8px] rounded-full mr-3 mt-[6px]"
        :class="[item.github ? 'bg-green' : 'bg-grey-dark']"
      ></div>
      {{ item.name }}
    </div>
    <div class="text-dark">
      <div class="w-auto">
        <strong :class="[item.github ? 'bg-green' : 'bg-grey-rewardsBg']">
          {{ item.github ? 'Added' : 'Missing' }}</strong
        >
      </div>
    </div>
    <div class="text-grey-light">
      {{ item.joined }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const referralCode = 'https://apillon.io/register/?REF=X5FGH';
defineProps({
  item: {
    type: Object,
    default: () => ({
      name: '',
      github: false,
      joined: '',
    }),
  },
});
</script>
