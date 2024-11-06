<template>
  <swiper
    class="max-w-sm xl:max-w-md mx-auto"
    :grab-cursor="true"
    :effect="'fade'"
    :navigation="true"
    :modules="[Navigation, EffectFade]"
    @swiper="onSwiper"
  >
    <swiper-slide v-for="(slide, key) in slides" :key="key" class="px-8">
      <img :src="slide" class="mx-auto" :alt="`slide ${key}`" />
    </swiper-slide>

    <div
      v-if="swiperRef"
      class="pointer-events-none absolute left-1/2 bottom-0 z-1 flex w-full -translate-x-1/2 flex-wrap justify-center"
    >
      <div>
        <Button
          title="Previous"
          class="pointer-events-auto mr-2 block !h-16 !w-16 text-black"
          isType="custom"
          :disabled="swiperRef.isBeginning"
          :icon="{
            name: 'arrow-left',
            color: swiperRef.isBeginning ? '#C9C9CA' : 'gradient-200',
            size: '2xl',
          }"
          @click="swiperRef.slidePrev()"
        />
      </div>
      <div>
        <Button
          title="Next"
          class="pointer-events-auto ml-2 block !h-16 !w-16 text-black"
          isType="custom"
          :disabled="swiperRef.isEnd"
          :icon="{
            name: 'arrow-right',
            color: swiperRef.isEnd ? '#C9C9CA' : 'gradient-200',
            size: '2xl',
          }"
          @click="swiperRef.slideNext()"
        />
      </div>
    </div>
  </swiper>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, EffectFade } from 'swiper/modules';
import { type Swiper as SwiperClass } from 'swiper/types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

defineProps({
  slides: { type: Array<string>, default: [] },
});
const swiperRef = ref<SwiperClass>();

onUnmounted(() => {
  if (swiperRef.value) {
    window.removeEventListener('keydown', onKeyPressed);
  }
});

const onSwiper = swiper => {
  swiperRef.value = swiper;
  useTimeoutFn(() => {
    window.addEventListener('keydown', onKeyPressed);
  }, 500);
};

function onKeyPressed(e: KeyboardEvent) {
  if (swiperRef.value) {
    switch (e.keyCode) {
      case 37:
        swiperRef.value.slidePrev();
        break;
      case 39:
        swiperRef.value.slideNext();
    }
  }
}
</script>

<style lang="postcss"></style>
