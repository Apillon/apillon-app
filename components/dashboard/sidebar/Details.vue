<template>
  <Drawer class="details" :title="title || $t('general.details')">
    <n-tabs
      ref="tabsRef"
      v-model:value="tab"
      animated
      :class="`n-tabs-${tabsRef?.renderNameListRef?.value?.length || 0}`"
    >
      <n-tab-pane :name="Tabs.GENERAL">
        <slot> </slot>
      </n-tab-pane>
      <n-tab-pane v-if="service || category || chain" :name="Tabs.PRICING" class="min-h-40">
        <div>
          <p v-if="$te(`dashboard.credits.services.${service || category}.description`)" class="mb-8 text-body">
            {{ $t(`dashboard.credits.services.${service || category}.description`) }}
          </p>

          <PaymentCreditCosts
            :chain="chain"
            :filter-by-chain="filterByChain"
            :filter-by-service="filterByService"
            :service="service"
            :category="category"
            :show-create-collection="showCreateCollection"
          />
          <slot name="pricing"> </slot>
        </div>
      </n-tab-pane>
      <n-tab-pane v-if="demo" :name="Tabs.DEMO">
        <DemoVideo :video-id="demo" />
      </n-tab-pane>
    </n-tabs>
  </Drawer>
</template>

<script lang="ts" setup>
enum Tabs {
  GENERAL = 'General',
  PRICING = 'Pricing',
  DEMO = 'Live demo',
}

defineProps({
  title: { type: String, default: '' },
  demo: { type: String, default: null },
  chain: { type: Number, default: null },
  category: { type: String, default: null },
  service: { type: String, default: null },
  filterByChain: { type: Boolean, default: false },
  filterByService: { type: Boolean, default: false },
  showCreateCollection: { type: Boolean, default: false },
});
const tab = ref(Tabs.GENERAL);
const tabsRef = ref();
</script>
