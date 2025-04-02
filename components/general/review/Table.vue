<template>
  <div>
    <div class="mb-4">
      <h2 v-if="title">{{ title }}</h2>
      <h2 v-else>{{ $t('nft.collection.review.title') }}</h2>
      <p v-if="info">
        {{ info }}
      </p>
    </div>

    <slot />

    <div class="relative mb-4"></div>
    <n-table class="plain mb-6 table-fixed" :bordered="false" :single-line="true">
      <tbody>
        <tr v-for="item in data" :key="item.key" :class="{ hidden: item.show === false }">
          <td class="!text-white">{{ item.label }}</td>
          <td class="relative">
            <span v-if="item?.key === 'chain'" class="flex items-center gap-2">
              <NuxtIcon
                :name="`logo/${getChainIconName(item.value)}`"
                class="inline-flex text-xl"
                filled
                :title="item.value"
              />
              {{ getChainName(item.value) }}
            </span>
            <template v-else-if="item.value === true">{{ $t('form.booleanSelect.true') }}</template>
            <template v-else-if="item.value === false">{{ $t('form.booleanSelect.false') }}</template>
            <template v-else-if="typeof item.value === 'string' && item.value?.length === 42">
              {{ truncateWallet(item.value) }}
            </template>
            <template v-else> {{ item.value }}</template>

            <Btn class="float-right text-white-primary no-underline" type="link" @click="$emit('back')">
              <span class="icon-edit align-sub text-xl" />
            </Btn>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script setup lang="ts">
import { truncateWallet } from '~/lib/utils/strings';

type RecordData = Record<string, any>;

defineEmits(['back']);
defineProps({
  title: { type: String, default: '' },
  info: { type: String, default: '' },
  data: { type: Array<RecordData>, default: [] },
});

const { nftChains, chainsTestnet } = useCollection();

function getChainIconName(collectionChain?: number) {
  return [...nftChains, ...chainsTestnet].find(chain => chain.value === collectionChain)?.name;
}
function getChainName(collectionChain?: number) {
  return [...nftChains, ...chainsTestnet].find(chain => chain.value === collectionChain)?.label;
}
</script>
