<template>
  <!-- Referral - intro -->
  <div class="bg-grey-lightBg grid grid-cols-3 gap-4 py-4">
    <div class="pl-5 text-secondary flex">
      <div
        class="w-[8px] h-[8px] rounded-full mr-3 mt-[6px]"
        :class="[item.has_github ? 'bg-green' : 'bg-grey-dark']"
      ></div>
      {{ item.name }}
    </div>
    <div class="text-dark">
      <div class="w-auto">
        <strong :class="[item.has_github ? 'bg-green' : 'bg-grey-rewardsBg']">
          {{ item.has_github ? 'Added' : 'Missing' }}
        </strong>
      </div>
    </div>
    <div class="text-grey-light">
      {{ getTimeSince(item.joined) }}
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

function getTimeSince(date) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date();
  const secondDate = new Date(date);

  const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
  if (diffDays < 1) {
    return '<1d';
  }
  return diffDays.toString() + 'd';
}
</script>
