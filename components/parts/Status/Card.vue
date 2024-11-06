<template>
  <n-card
    class="deploy-actions card-dark fixed right-0 bottom-0 max-w-[500px] z-10 !border-yellow !rounded-none -mr-[1px] -mb-[1px]"
  >
    <n-collapse display-directive="show" :default-expanded-names="['1']">
      <n-collapse-item v-model:expanded="expanded" name="1">
        <template #header>
          <div class="flex items-center justify-between w-full">
            <span class="ml-4 my-1" @click="expanded = !expanded">
              {{ $t('dashboard.refreshModal.title') }}</span
            >
            <!-- <n-button-group @click.stop>
              <n-button size="small" @click="refresh">
                <span class="icon-refresh text-xl mr-2"></span>
                {{ $t('dashboard.refreshModal.refresh') }}
              </n-button>
              <n-dropdown
                trigger="click"
                placement="bottom-start"
                :options="refreshStatusOptions"
                @select="updateRefreshInterval"
              >
                <n-button size="small">
                  <span>{{ refreshInterval.label }}</span> <span class="icon-down text-3xl"></span>
                </n-button>
              </n-dropdown>
            </n-button-group> -->
          </div>
        </template>
        <!-- Collapsible content -->
        <div>
          <p class="mb-4">
            {{ $t('dashboard.refreshModal.subtitle') }}
          </p>
          <n-scrollbar v-if="expanded" class="max-h-72 mt-4" y-scrollable>
            <div v-for="(deployment, key) in activeDeployments" :key="key" class="px-2">
              <div
                v-if="deployment?.service || deployment?.title"
                class="flex flex-row justify-between"
              >
                <h5>{{ deployment.service?.name || deployment.title }}</h5>
                <n-progress
                  type="line"
                  class="max-w-[60%]"
                  :color="colors.primary"
                  :percentage="Math.round(deployment.progress)"
                  :height="6"
                  :border-radius="4"
                  :fill-border-radius="0"
                />
              </div>
              <hr v-if="key < activeDeployments.length - 1" class="border-bg-lighter my-3" />
            </div>
          </n-scrollbar>
        </div>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script setup lang="ts">
import colors from '~/tailwind.colors';

const expanded = ref(true);

const { activeDeployments, refreshInterval, refreshStatusOptions, updateRefreshInterval, refresh } =
  useRefreshStatus();
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
