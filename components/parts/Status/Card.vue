<template>
  <!-- Card -->
  <n-card
    class="deploy-actions card-dark fixed right-0 bottom-0 max-w-[500px] z-10 !border-yellow !rounded-none -mr-[1px] -mb-[1px]"
  >
    <!-- Accordion -->
    <n-collapse display-directive="show" :default-expanded-names="['1']">
      <!-- Primary service -->
      <n-collapse-item v-model:expanded="expanded" name="1">
        <!-- #header -->
        <template #header>
          <div class="flex items-center justify-between w-full">
            <span class="ml-4" @click="expanded = !expanded">
              {{ $t('dashboard.refreshModal.title') }}</span
            >
            <!-- Buttons -->
            <n-button-group @click.stop>
              <!-- Refresh -->
              <n-button size="small" @click="refresh">
                <span class="icon-refresh text-xl mr-2"></span>
                {{ $t('dashboard.refreshModal.refresh') }}
              </n-button>
              <!-- Dropdown -->
              <n-dropdown
                trigger="click"
                placement="bottom-start"
                :options="dropdownOptions"
                @select="updateRefreshInterval"
              >
                <n-button size="small">
                  <span>{{ refreshInterval.label }}</span> <span class="icon-down text-3xl"></span>
                </n-button>
              </n-dropdown>
            </n-button-group>
          </div>
        </template>
        <!-- Collapsible content -->
        <div>
          <p class="mb-4">
            {{ $t('dashboard.refreshModal.subtitle') }}
          </p>
          <n-scrollbar v-if="expanded" class="max-h-72 mt-4" y-scrollable>
            <div v-for="(service, i) in activeServices" :key="service.contract_uuid" class="px-2">
              <div class="flex flex-row justify-between">
                <h5>{{ service.name }}</h5>
                <n-progress
                  type="line"
                  :percentage="progressStep"
                  :height="6"
                  :border-radius="4"
                  :fill-border-radius="0"
                  class="max-w-[60%]"
                  color="#F9FF73"
                />
              </div>
              <hr v-if="i < activeServices.length - 1" class="border-bg-lighter my-3" />
            </div>
          </n-scrollbar>
        </div>
        <!-- End Collapsible content -->
      </n-collapse-item>
    </n-collapse>
    <!-- End Accordion -->
  </n-card>
  <!-- End Card -->
</template>

<script setup lang="ts">
const expanded = ref(true);

const {
  dropdownOptions,
  activeServices,
  progressStep,
  refreshInterval,
  updateRefreshInterval,
  refresh,
} = useRefreshStatus();
</script>

<style lang="postcss">
/* Reset padding on nested UI component, does not work with scoped*/
.deploy-actions > .n-card__content {
  padding: 12px 20px !important;
}

.deploy-actions .n-collapse-item__content-inner {
  padding: 10px 0 0 !important;
}
</style>
