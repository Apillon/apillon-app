<template>
  <!-- Card -->
  <n-card
    class="deploy-actions fixed bottom-0 right-0 w-full max-w-[500px] bg-bg-dark z-50 rounded-none"
  >
    <!-- Accordion -->
    <n-collapse display-directive="show">
      <!-- Primary service -->
      <n-collapse-item v-model:expanded="expanded">
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
                :options="options"
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
          <div v-for="(service, i) in activeServices" :key="service.id" class="px-2">
            <div class="flex flex-row justify-between">
              <h5>{{ service.title }}</h5>
              <!-- TODO: should we run a spinner when refresh action is ran -->
              <!-- <Spinner :size="14" /> -->
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
        </div>
        <!-- End Collapsible content -->
      </n-collapse-item>
    </n-collapse>
    <!-- End Accordion -->
  </n-card>
  <!-- End Card -->
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect, onBeforeUnmount } from 'vue';

const { log, options, activeServices, progressStep } = useRefreshStatus();

const refreshInterval = ref(options.value[0]);
const expanded = ref(false);

let intervalId: ReturnType<typeof setInterval> | null = null;

const updateRefreshInterval = key => {
  const selectedOption = options.value.find(option => option.key === key);
  if (selectedOption) {
    refreshInterval.value = selectedOption;
  }
};

const refresh = () => {
  // Debug
  //   console.log('Refreshed after', refreshInterval);
  // TODO: Place the refresh logic here
  //  TODO: We could display a short spinner when request happens
  // ????Get current step or smth
  // TODO: Call this when refresh button is clicked
  calculateProgress();
};

// TODO: say we get 5 steps from API - this needs to be dynamic
const totalSteps = 5;
let currentStep = 1;
let progress = 10;

const calculateProgress = () => {
  // number of steps divided by step
  progress = (currentStep / totalSteps) * 100;
  // stop after reaching 100%
  //  TODO: clunky needs improvement
  if (progress > 100) {
    progressStep.value = 100;
    clearInterval(intervalId);
    intervalId = null;
    // TODO: unmount component when done
  } else {
    progressStep.value = progress;
    currentStep++;
  }
};

const clearRefreshInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const setRefreshInterval = () => {
  clearRefreshInterval();
  intervalId = setInterval(refresh, refreshInterval.value.value * 1000);
};

onMounted(() => {
  setRefreshInterval();
  log();
});

watchEffect(() => {
  setRefreshInterval();
});

onBeforeUnmount(clearRefreshInterval);
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
