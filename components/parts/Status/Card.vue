<template>
  <n-card
    class="deploy-actions card-dark fixed bottom-0 right-0 z-10 -mb-[1px] -mr-[1px] max-w-[500px] !rounded-none !border-yellow"
    size="large"
  >
    <n-collapse class="collapse-up" display-directive="show" :default-expanded-names="['1']">
      <n-collapse-item v-model:expanded="expanded" name="1">
        <template #header>
          <div class="flex w-full items-center justify-between">
            <span class="my-1 ml-4" @click="expanded = !expanded">
              {{ $t('dashboard.refreshModal.title') }}
            </span>
            <!-- <n-button-group @click.stop>
              <n-button @click="refresh">
                <span class="icon-refresh text-xl mr-2"></span>
                {{ $t('dashboard.refreshModal.refresh') }}
              </n-button>
              <n-dropdown
                trigger="click"
                placement="bottom-start"
                :options="refreshStatusOptions"
                @select="updateRefreshInterval"
              >
                <n-button>
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
          <n-scrollbar v-if="expanded" class="mt-4 max-h-72" y-scrollable>
            <div v-for="(deployment, key) in activeDeployments" :key="key" class="px-2">
              <div v-if="deployment?.service || deployment?.title" class="flex flex-row justify-between">
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
              <hr v-if="key < activeDeployments.length - 1" class="my-3 border-bg-lighter" />
            </div>
          </n-scrollbar>
        </div>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script setup lang="ts">
import { colors } from '~/tailwind.config';

const expanded = ref(true);

const { activeDeployments } = useRefreshStatus();
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
