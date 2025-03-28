<template>
  <div class="relative flex flex-col items-start gap-12 md:flex-row">
    <div class="md:w-1/2">
      <div class="mb-4">
        <h2>{{ $t('nft.collection.review.title') }}</h2>
        <p>
          {{ $t('nft.collection.review.info') }}
        </p>
      </div>

      <div class="relative mb-4"></div>
      <n-table class="plain mb-6 table-fixed" :bordered="false" :single-line="true">
        <tbody>
          <tr v-for="item in data" :class="{ hidden: item.show === false }">
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

              <Btn class="float-right mt-[2px] hidden text-xs text-yellow" type="link" @click="$emit('back')">
                {{ $t('general.change') }}
              </Btn>
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>

    <div class="static hidden h-full md:block">
      <div class="absolute bottom-4 top-8 border-l border-bg-lighter"></div>
    </div>

    <div class="mt-8 md:!w-1/2">
      <h6>{{ $t('nft.collection.review.costs') }}</h6>
      <n-table class="plain my-6 table-fixed" :bordered="false" :single-line="true">
        <tbody>
          <tr v-for="price in pricing">
            <td>{{ price.description }}</td>
            <td class="!text-white">{{ price.currentPrice }} {{ $t('dashboard.credits.credits') }}</td>
          </tr>
        </tbody>
      </n-table>
      <div class="card-light p-6">
        <div class="flex gap-2">
          <strong class="block w-1/2">{{ $t('nft.collection.review.totalSpend') }}</strong>
          <div class="flex w-1/2 flex-col gap-1 text-right">
            <strong>{{ totalCredits }} {{ $t('dashboard.credits.credits') }}</strong>
            <small>
              {{ $t('nft.collection.review.balance') }}: {{ formatNumber(paymentStore.credit.balance || 0) }}
              {{ $t('dashboard.credits.credits') }}
            </small>
          </div>
        </div>
        <hr class="my-6 w-full border-bg-lighter" />
        <div class="my-6">
          <n-checkbox v-model:checked="nonRefundable" :label="t('nft.collection.review.nonRefundable')" />
        </div>
        <Btn size="large" type="primary" :disabled="!nonRefundable" @click="$emit('deploy')">
          {{ $t('nft.collection.review.createCollection') }}
        </Btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { chainCurrency } from '~/lib/utils/chain';
import { formatNumber } from '~/lib/utils/helpers';
import { truncateWallet } from '~/lib/utils/strings';
import { timestampToDateAndTime } from '~/lib/utils/dates';

defineEmits(['back', 'deploy']);
const { t } = useI18n();
const paymentStore = usePaymentStore();
const metadataStore = useMetadataStore();

const { pricing, createThumbnailUrl } = useMetadata();
const { nftChains, chainsTestnet } = useCollection();

const nonRefundable = ref<boolean>(false);
const data = ref([
  {
    label: t('form.label.collection.chain'),
    value: metadataStore.form.smartContract.chain,
    key: 'chain',
  },
  { label: t('nft.collection.name'), value: metadataStore.form.smartContract.name },
  { label: t('form.label.collection.symbol'), value: metadataStore.form.smartContract.symbol },
  { label: t('form.label.collection.type'), value: metadataStore.form.smartContract.collectionType },
  { label: t('form.label.collection.useGateway'), value: metadataStore.form.smartContract.useApillonIpfsGateway },
  { label: t('form.label.collection.useIpns'), value: !!metadataStore.form.smartContract.useIpns },
  {
    label: t('form.label.collection.supplyLimited'),
    value: metadataStore.form.smartContract.supplyLimited
      ? metadataStore.form.smartContract.maxSupply
      : t('form.supplyTypes.unlimited'),
  },
  { label: t('form.label.collection.revocable'), value: metadataStore.form.smartContract.revocable },
  { label: t('form.label.collection.soulbound'), value: metadataStore.form.smartContract.soulbound },
  { label: t('form.label.collection.autoIncrement'), value: metadataStore.form.smartContract.isAutoIncrement },
  {
    label: t('form.label.collection.royaltiesAddress'),
    value: metadataStore.form.smartContract.royaltiesAddress,
    show: !!metadataStore.form.smartContract.royaltiesAddress,
  },
  {
    label: t('form.label.collection.royaltiesFees'),
    value: (metadataStore.form.smartContract.royaltiesFees || '0') + '%',
    show: !!metadataStore.form.smartContract.royaltiesAddress,
  },
  { label: t('form.label.collection.drop'), value: metadataStore.form.smartContract.drop },
  {
    label: t('form.label.collection.dropReserve'),
    value: metadataStore.form.smartContract.dropReserve,
    show: metadataStore.form.smartContract.drop,
  },
  {
    label: t('form.label.collection.dropPrice', {
      currency: chainCurrency(metadataStore.form.smartContract.chain),
    }),
    value: metadataStore.form.smartContract.dropPrice,
    show: metadataStore.form.smartContract.drop,
  },
  {
    label: t('form.label.collection.dropStart'),
    value: timestampToDateAndTime(metadataStore.form.smartContract.dropStart / 1000),
    show: metadataStore.form.smartContract.drop,
  },
  {
    label: t('form.label.collection.dropReserve'),
    value: metadataStore.form.smartContract.dropReserve,
    show: metadataStore.form.smartContract.drop,
  },
  {
    label: t('nft.collection.review.nftFiles'),
    value: `${metadataStore.metadata.length} ${t('storage.files')}`,
  },
]);

const totalCredits = computed(() => sumCredits(pricing.value));

onMounted(() => {
  paymentStore.getPriceList();
});

function getChainIconName(collectionChain?: Number) {
  return [...nftChains, ...chainsTestnet].find(chain => chain.value === collectionChain)?.name;
}
function getChainName(collectionChain?: Number) {
  return [...nftChains, ...chainsTestnet].find(chain => chain.value === collectionChain)?.label;
}
</script>
