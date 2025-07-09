<template>
  <n-table class="plain" :bordered="false" single-line>
    <tbody>
      <tr v-for="(item, key) in data.slice(0, showAll || !maxLines ? data.length : maxLines + 1)" :key="key">
        <td :class="[item?.classLabel, { '!border-b-0': key + 1 === data.length }]">
          <span class="flex items-center gap-1">
            <span class="text-white lg:whitespace-nowrap">{{ item.label }}</span>
            <IconInfo v-if="item.info" :tooltip="item.info" size="sm" />
          </span>
        </td>
        <td
          class="relative"
          :class="[item?.classValue, { '!border-b-0': key + 1 === data.length }, { '!pl-11': item.img }]"
        >
          <div v-if="item.img" class="flex-cc absolute left-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded bg-bg-light p-2">
            <Image :src="item.img" class="h-5 w-5 rounded-full object-cover" alt="" />
          </div>
          <Spinner v-if="item.loading" class="w-full" :size="16" :text="item.value" />
          <component :is="item.component" v-else-if="item.component" v-bind="item.data">{{ item?.value }}</component>
          <TableLink v-else-if="item.link && item.value" class="w-full" :link="item.link" :text="`${item.value}`" />
          <TableEllipsis v-else-if="item.copy" class="w-full justify-between" :text="`${item.value}`" />
          <p v-else class="w-full">{{ item.value }}</p>
        </td>
      </tr>
    </tbody>
  </n-table>
  <div v-if="maxLines && data.length > maxLines" class="text-right" :class="{ 'mt-4': !showAll }">
    <Btn type="tertiary" inner-class="flex gap-2 items-center text-white" @click="showAll = !showAll">
      <span v-if="showAll">{{ $t('general.lessDetails') }}</span>
      <span v-else>{{ $t('general.moreDetails') }}</span>
      <n-icon class="transition-transform" :class="showAll ? '-scale-100' : 'scale-100'" size="16">
        <ChevronDownFilledIcon />
      </n-icon>
    </Btn>
  </div>
</template>

<script lang="ts" setup>
import { ChevronDownFilledIcon } from 'naive-ui/es/_internal/icons';
import type { Address } from 'viem';

export type TableInfo = {
  label: string;
  value: Optional<string> | Address | number | undefined;
  link?: Optional<string>;
  info?: Optional<string>;
  img?: Optional<string>;
  classLabel?: Optional<string>;
  classValue?: Optional<string>;
  copy?: boolean;
  loading?: boolean;
  component?: any;
  data?: Record<string, any>;
};
defineProps({
  data: { type: Array<TableInfo>, required: true },
  maxLines: { type: Number, default: null },
});

const showAll = ref(false);
</script>
