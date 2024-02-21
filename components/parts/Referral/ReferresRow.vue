<template>
  <!-- Referral - intro -->
  <div
    class="border-b-1 border-bg-lighter grid grid-cols-1 md:grid-cols-4 gap-4 font-content text-sm py-3"
  >
    <div class="pl-3 font-bold col-span-2" style="line-height: 28px">
      {{ item.name }}
    </div>
    <div class="text-dark">
      <div class="w-auto">
        <pill v-if="item.joined" type="success">
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
  if (diffDays < 1) {
    return ' < 1 day ago';
  }
  return diffDays.toString() + ' days ago';
}
</script>
