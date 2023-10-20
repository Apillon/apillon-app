<template>
  <Dashboard :loading="loading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.pageMenu.priceList') }}</h1>
        </slot>

        <template #submenu>
          <MenuBilling />
        </template>
      </Heading>
    </template>
    <slot>
      <n-table class="plain pb-8" :bordered="false" :single-line="true">
        <thead>
          <tr>
            <th>{{ $t('dashboard.credits.serviceDescription') }}</th>
            <th class="!text-right">{{ $t('dashboard.credits.cost') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(price, key) in paymentsStore.priceList" :key="key">
            <td>{{ price.description }}</td>
            <td class="text-right">
              {{ price.currentPrice }} {{ $t('dashboard.credits.credits') }}
            </td>
          </tr>
        </tbody>
      </n-table>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const paymentsStore = usePaymentsStore();
const loading = ref<boolean>(true);

useHead({
  title: t('dashboard.pageMenu.priceList'),
});

onMounted(async () => {
  await paymentsStore.getPriceList();
  loading.value = false;
});
</script>
