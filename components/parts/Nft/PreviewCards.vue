<template>
  <div class="px-10 mt-4">
    <swiper
      class="max-w-sm xl:max-w-md mx-auto"
      effect="cards"
      :grab-cursor="true"
      :pagination="pagination"
      :modules="[EffectCards, Pagination]"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(slide, key) in slides" :key="key" class="justify-center flex mx-auto">
        <NftCard
          :id="key + 1"
          :data="slide"
          class="min-h-[16rem] md:min-h-[18rem] lg:min-h-[20rem]"
        />
      </swiper-slide>
    </swiper>
  </div>

  <n-space class="w-auto mx-auto mt-8" justify="center">
    <slot />
  </n-space>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCards, Pagination } from 'swiper/modules';
import { Swiper as SwiperClass } from 'swiper/types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const collectionStore = useCollectionStore();

const SLIDES_TO_SHOW = 10;
const swiperRef = ref<SwiperClass>();
const slides = ref<Array<any>>([]);

const pagination = reactive({
  type: 'fraction',
  formatFractionTotal: () => {
    return collectionStore.csvData.length;
  },
});

onMounted(() => {
  slides.value = collectionStore.csvData.slice(0, SLIDES_TO_SHOW);
});
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

function onSlideChange(swiper: SwiperClass) {
  if (
    swiper.previousIndex < swiper.realIndex &&
    swiper.realIndex + SLIDES_TO_SHOW > slides.value.length &&
    slides.value.length < collectionStore.csvData.length
  ) {
    slides.value.push(collectionStore.csvData[swiper.previousIndex + SLIDES_TO_SHOW]);
  }
}
</script>

<style lang="postcss">
.swiper-pagination {
  @apply relative;

  &.swiper-pagination-fraction {
    @apply mt-2 bottom-0;
  }
}
</style>
