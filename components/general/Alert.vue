<template>
  <transition name="fade">
    <div v-if="visible" ref="el" class="rounded-lg bg-grey overflow-hidden pb-1">
      <div class="relative rounded-input">
        <div
          class="flex flex-wrap justify-between min-w-[320px] p-4 pr-10 text-left font-serif text-sm sm:flex-nowrap"
        >
          <img v-if="theme.icon" :src="theme.icon" class="w-[22px] h-[20px] mr-2" />

          <div v-if="title" class="w-full min-w-0 body-md break-words">
            {{ title }}
          </div>

          <div v-if="cta" class="flex-shrink-0">
            <button class="flex underline hover:no-underline" @click="action">
              <Spinner v-if="ctaLoading" size="1.25rem" width="0.125rem" />
              <template v-else>
                {{ cta }}
              </template>
            </button>
          </div>
        </div>

        <transition name="slide">
          <div v-if="message" v-show="expanded" class="break-words text-xs">
            <div class="p-4 pt-0">
              {{ message }}
            </div>
          </div>
        </transition>

        <button
          v-if="message"
          class="absolute right-0 top-1 h-10 w-10"
          @click="expanded = !expanded"
        >
          <Icon
            name="chevron-down"
            size="sm"
            class="origin-center transition-transform"
            :class="expanded ? ' rotate-180' : 'rotate-0'"
          />
        </button>

        <button
          v-else
          class="absolute right-3 top-[50%] -translate-y-1/2 h-[14px] w-[14px]"
          @click="hide"
        >
          <img name="x" :src="closeIcon" />
        </button>

        <div
          class="absolute -bottom-1 left-0 w-full h-1"
          :class="theme.class"
          :style="`animation: alertTimer ${timeout / 1000}s linear forwards`"
        ></div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts" setup>
import { SwipeDirection, usePointerSwipe } from '@vueuse/core';
import closeIcon from '~/assets/icons/close.svg';
import errorIcon from '~/assets/icons/error.svg';

const props = defineProps({
  collapse: { type: Boolean, default: false },
  title: { type: [String, Number], default: 'Message' },
  cta: { type: [String], default: null },
  ctaLoading: { type: Boolean, default: false },
  message: { type: [String, Number], default: null },
  type: {
    type: [String],
    default: 'notice',
    validator: (type: string) => ['success', 'warning', 'error', 'notice', 'info'].includes(type),
  },
  hidden: { type: Boolean, default: false }, // control visibilty with prop
  timeout: { type: Number, default: 8000 },
});
const emit = defineEmits(['onHide', 'onAction']);

const visible = ref(false);
const expanded = ref(true);
const el = ref(null);
const swipeStartTs = ref(0);
const theme = computed(() => {
  let obj = { icon: '', class: '' };
  switch (props.type) {
    case 'success':
      obj = {
        icon: '',
        class: 'bg-gold-dark',
      };
      break;
    case 'warning':
      obj = {
        icon: '',
        class: 'bg-yellow',
      };
      break;
    case 'error':
      obj = {
        icon: errorIcon,
        class: 'bg-red',
      };
      break;
    case 'info':
      obj = {
        icon: '',
        class: 'bg-yellow',
      };
      break;
    default:
      obj = {
        icon: '',
        class: 'bg-gold-dark',
      };
  }

  return obj;
});

watch(
  () => props.hidden,
  val => {
    if (!val) {
      if (visible.value) {
        hide();
      }
    } else {
      visible.value = true;
    }
  }
);

onMounted(() => {
  visible.value = !props.hidden;
  if (props.collapse) expanded.value = false;
});

function hide() {
  visible.value = false;
  emit('onHide');
}

function action() {
  emit('onAction');
}

/**
 * Trigger hide on swipe. Swipe must be RIGHT and swift !
 */
usePointerSwipe(el, {
  onSwipeStart() {
    swipeStartTs.value = new Date().getTime();
  },
  onSwipeEnd(_ev, direction) {
    if (direction === SwipeDirection.RIGHT && new Date().getTime() - swipeStartTs.value <= 750) {
      hide();
    }
  },
});
</script>

<style>
@keyframes alertTimer {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
