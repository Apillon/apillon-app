<template>
  <!-- Referral - intro -->
  <div class="border-b-1 border-bg-lighter grid grid-cols-3 gap-4 py-4">
    <div class="pl-3">
      {{ item.name }}
    </div>
    <div class="text-dark">
      <div class="w-auto text-right">
        <n-tag v-if="item.has_github" type="success" :bordered="false" round>
          <strong>ADDED</strong>
        </n-tag>
        <n-tag v-else bordered round>
          <strong>MISSING</strong>
        </n-tag>
      </div>
    </div>
    <div class="pr-3 text-grey-light text-right">
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
      has_github: false,
      joined: '',
    }),
  },
});

function getTimeSince(date: string) {
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
