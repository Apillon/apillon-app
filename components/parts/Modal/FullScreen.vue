<template>
  <n-drawer width="100%" height="92vh" placement="bottom">
    <n-drawer-content :title="title" closable>
      <template #header>
        <div class="flex w-full items-center justify-between">
          <small class="inline-block md:w-1/6">{{ title }}</small>
          <div>
            <slot name="header-center">
              <div v-if="steps" class="flex items-center gap-4 text-xs">
                <template v-for="(step, key) in enumValues(steps)" :key="key">
                  <span v-if="key > 0 && $te(`${transKey}.${step}`)" class="card-border w-3"></span>
                  <strong
                    v-if="$te(`${transKey}.${step}`)"
                    :class="step === activeStep ? 'text-yellow' : 'text-disabled'"
                  >
                    {{ $t(`${transKey}.${step}`) }}
                  </strong>
                </template>
              </div>
            </slot>
          </div>
          <div class="md:w-1/6"></div>
        </div>
        <div
          v-if="progress !== null"
          class="absolute bottom-0 left-0 border-b-2 border-blue"
          :style="{ width: `${progress}%` }"
        ></div>
      </template>

      <slot />

      <template v-if="$slots.footer" #footer>
        <slot name="footer" />
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
defineProps({
  activeStep: { type: Number, default: 0 },
  progress: { type: Number, default: null },
  steps: { type: Object, default: null },
  title: { type: String, default: null },
  transKey: { type: String, default: null },
});
</script>
