<template>
  <div class="flex items-center gap-2 text-2xl">
    <template v-if="chains.length > 5">
      <NuxtIcon
        v-for="chain in chains.slice(0, 4)"
        :key="chain"
        :name="`logo/${chain.toLowerCase()}`"
        class="text-xl"
        filled
        :title="chain"
      />
      <n-tooltip placement="bottom" trigger="hover">
        <template #trigger>
          <strong class="cursor-pointer text-xs underline"> + {{ chains.length - 4 }} {{ $t('general.more') }} </strong>
        </template>
        <div class="flex items-center gap-2">
          <NuxtIcon
            v-for="chain in chains.slice(4, chains.length)"
            :key="chain"
            :name="`logo/${chain.toLowerCase()}`"
            class="inline-flex text-xl"
            filled
            :title="chain"
          />
        </div>
      </n-tooltip>
    </template>
    <template v-else>
      <NuxtIcon
        v-for="chain in chains"
        :key="chain"
        :name="`logo/${chain.toLowerCase()}`"
        class="text-xl"
        filled
        :title="chain"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  chains: { type: Array<string>, default: [] },
});
</script>
