<template>
  <div class="relative h-3 w-5">
    <div
      class="absolute left-1/2 top-1/2 flex h-7 w-11 -translate-x-1/2 -translate-y-1/2 scale-40 items-center justify-center overflow-hidden"
    >
      <div :class="$style.dotTyping"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  size: { type: Number, default: 36 },
  width: { type: Number, default: 2 },
  color: { type: String, default: '#FFFFFF' },
});
</script>

<style lang="postcss" module>
.dotTyping {
  position: relative;
  top: 5px;
  left: -99px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: currentColor;
  box-shadow:
    84px 0 0 0 currentColor,
    99px 0 0 0 currentColor,
    114px 0 0 0 currentColor;
  animation: dot-typing 1.5s infinite linear;
}

@keyframes dot-typing {
  0% {
    box-shadow:
      84px 0 0 0 currentColor,
      99px 0 0 0 currentColor,
      114px 0 0 0 currentColor;
  }
  16.667% {
    box-shadow:
      84px -10px 0 0 currentColor,
      99px 0 0 0 currentColor,
      114px 0 0 0 currentColor;
  }
  33.333% {
    box-shadow:
      84px 0 0 0 currentColor,
      99px 0 0 0 currentColor,
      114px 0 0 0 currentColor;
  }
  50% {
    box-shadow:
      84px 0 0 0 currentColor,
      99px -10px 0 0 currentColor,
      114px 0 0 0 currentColor;
  }
  66.667% {
    box-shadow:
      84px 0 0 0 currentColor,
      99px 0 0 0 currentColor,
      114px 0 0 0 currentColor;
  }
  83.333% {
    box-shadow:
      84px 0 0 0 currentColor,
      99px 0 0 0 currentColor,
      114px -10px 0 0 currentColor;
  }
  100% {
    box-shadow:
      84px 0 0 0 currentColor,
      99px 0 0 0 currentColor,
      114px 0 0 0 currentColor;
  }
}
</style>
