<template>
  <template v-if="!$attrs.show && minimize">
    <n-card
      class="card-dark fixed bottom-0 left-1/2 z-10 -mb-[2px] max-w-md -translate-x-1/2 cursor-pointer !rounded-b-none !border-yellow"
      content-class="!py-2"
      size="small"
    >
      <span class="absolute right-0 top-0 p-1 text-xs">&#128471;&#xFE0E;</span>
      <div class="flex w-full items-center justify-between">
        <small class="inline-block md:w-1/3">{{ title }}</small>
        <div class="hidden items-center gap-4 text-xs sm:flex">
          <strong v-if="$te(`${transKey}.${activeStep}`)" class="text-yellow">
            {{ $t(`${transKey}.${activeStep}`) }}
          </strong>
        </div>
        <div class="w-1/4 text-center sm:ml-[16%] md:w-1/6">
          <BtnDelete v-if="hasReset" class="z-10" size="small" @click="modalResetVisible = true" />
        </div>
        <div
          class="absolute bottom-0 left-0 right-0 top-0"
          @click="($attrs as Record<string, any>)['onUpdate:show']?.(true)"
        ></div>
      </div>
    </n-card>
    <Modal v-model:show="modalResetVisible" class="hide-header text-center">
      <Headline :title="$t('dashboard.reset.title')" :content="$t('dashboard.reset.info')" />
      <div class="mt-8 flex gap-4">
        <Btn type="secondary" class="flex-1" @click="modalResetVisible = false">
          {{ $t('form.cancel') }}
        </Btn>
        <Btn type="primary" class="flex-1" @click="$emit('reset')">
          {{ $t('form.reset') }}
        </Btn>
      </div>
    </Modal>
  </template>
  <n-drawer v-bind="$attrs" width="100%" height="92vh" placement="bottom">
    <n-drawer-content :title="title" closable>
      <template #header>
        <div class="flex w-full items-center justify-between">
          <small class="inline-block md:w-1/6">{{ title }}</small>
          <div>
            <slot name="header-center">
              <div v-if="steps" class="hidden items-center gap-4 text-xs sm:flex">
                <template v-for="(step, key) in enumValues(steps).filter(s => $te(`${transKey}.${s}`))" :key="key">
                  <span v-if="key" class="card-border w-3"></span>
                  <strong :class="step === activeStep ? 'text-yellow' : 'text-disabled'">
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
const emit = defineEmits(['reset']);
const props = defineProps({
  activeStep: { type: Number, default: 0 },
  progress: { type: Number, default: null },
  steps: { type: Object, default: null },
  title: { type: String, default: null },
  transKey: { type: String, default: null },
  minimize: { type: Boolean, default: false },
  finished: { type: Boolean, default: false },
});

const attrs = useAttrs();
const { vnode } = getCurrentInstance();
const hasReset = computed(() => 'onReset' in vnode.props);
const modalResetVisible = ref<boolean>(false);

const checkIfFinished = () => {
  if (props.finished && !attrs.show && hasReset) {
    emit('reset');
  }
};

watch(
  () => props.finished,
  _ => checkIfFinished()
);
watch(
  () => attrs.show,
  _ => checkIfFinished()
);
</script>
