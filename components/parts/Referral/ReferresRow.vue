<template>
  <!-- Referral - intro -->
  <div class="font-content grid grid-cols-1 gap-4 border-b-1 border-bg-lighter py-3 text-sm md:grid-cols-4">
    <div class="col-span-2 pl-3 font-bold" style="line-height: 28px">
      {{ item.name }}
    </div>
    <div class="text-dark">
      <div class="w-auto">
        <pill v-if="item.active" type="success">
          {{ $t('form.booleanSelect.true') }}
        </pill>
        <pill v-else>
          {{ $t('form.booleanSelect.false') }}
        </pill>
      </div>
    </div>
    <div class="pr-3 text-white" style="line-height: 28px">
      {{ getTimeSince(item.joined) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
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

  return diffDays < 1 ? ' < 1 day ago' : diffDays === 1 ? ' 1 day ago' : diffDays.toString() + ' days ago';
}
</script>
