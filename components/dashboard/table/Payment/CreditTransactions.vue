<template>
  <n-space class="pb-8" :size="32" vertical>
    <n-space size="large">
      <!-- Filter by service -->
      <select-options
        v-model:value="service"
        :options="services"
        class="w-[20vw] min-w-[11rem] max-w-xs"
        size="small"
        :placeholder="$t('form.placeholder.selectService')"
        filterable
        clearable
      />
      <!-- Filter by category -->
      <select-options
        v-model:value="category"
        :options="categories"
        class="w-[20vw] min-w-[11rem] max-w-xs"
        size="small"
        :placeholder="$t('form.placeholder.selectCategory')"
        filterable
        clearable
      />
      <!-- Filter by direction -->
      <select-options
        v-model:value="direction"
        :options="directions"
        class="w-[20vw] min-w-[11rem] max-w-xs"
        size="small"
        :placeholder="$t('form.placeholder.selectDirection')"
        filterable
        clearable
      />
    </n-space>

    <n-data-table
      remote
      :bordered="false"
      :columns="columns"
      :data="paymentStore.creditTransactions.items"
      :loading="paymentStore.creditTransactions.loading"
      :pagination="paymentStore.creditTransactions.pagination"
      @update:page="(page: number) => handlePageChange(page, paymentStore.creditTransactions.pagination.pageSize)"
      @update:page-size="(pageSize: number) => handlePageChange(1, pageSize)"
    />
  </n-space>
</template>

<script lang="ts" setup>
import { CreditDirection, TransactionCategory } from '~/lib/types/payment';
import { ServiceTypeName } from '~/lib/types/service';

const { t } = useI18n();
const paymentStore = usePaymentStore();

const category = ref<string | null>(null);
const direction = ref<string | null>(null);
const service = ref<string | null>(null);

const categories = enumKeyValues(TransactionCategory).map((item: KeyValue) => {
  return { label: item.key, value: item.value };
});
const directions = enumKeyValues(CreditDirection).map((item: KeyValue) => {
  return { label: item.key, value: item.value };
});
const services = enumKeyValues(ServiceTypeName).map((item: KeyValue) => {
  return { label: item.key, value: item.value };
});

const createColumns = (): NDataTableColumns<CreditTransactionInterface> => {
  return [
    {
      title: t('dashboard.credits.service'),
      key: 'service',
      render(row) {
        return h('span', { class: 'text-body' }, row.service);
      },
    },
    {
      title: t('dashboard.credits.category'),
      key: 'category',
      render(row) {
        return h('span', { class: 'text-body' }, row.category);
      },
    },
    {
      title: t('dashboard.credits.description'),
      key: 'description',
      render(row) {
        return h('span', { class: 'text-body' }, row.description || '');
      },
    },
    {
      title: t('dashboard.credits.direction'),
      key: 'direction',
      render(row) {
        return h('span', { class: 'text-body' }, CreditDirection[row.direction]);
      },
    },
    {
      title: t('dashboard.credits.amount'),
      key: 'amount',
      render(row) {
        return h('span', { class: 'text-body' }, `${formatNumber(row.amount)}`);
      },
    },
    {
      title: t('dashboard.credits.date'),
      key: 'createTime',
      render(row) {
        return h('span', { class: 'text-body' }, dateTimeToDateAndTime(row?.createTime || ''));
      },
    },
  ];
};

const columns = createColumns();

/** Search filters */
watch(
  () => category.value,
  _ => {
    handlePageChange();
  }
);
watch(
  () => direction.value,
  _ => {
    handlePageChange();
  }
);
watch(
  () => service.value,
  _ => {
    handlePageChange();
  }
);

/** On page change, load data */
async function handlePageChange(page = 1, limit = PAGINATION_LIMIT) {
  if (!paymentStore.creditTransactions.loading) {
    await paymentStore.fetchCreditTransactions({
      category: category.value,
      direction: direction.value,
      service: service.value,
      page,
      limit,
    });

    paymentStore.creditTransactions.pagination.page = page;
    paymentStore.creditTransactions.pagination.pageSize = limit;
  }
}
</script>
