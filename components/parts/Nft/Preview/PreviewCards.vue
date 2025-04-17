<template>
  <div class="mt-4 px-10">
    <swiper
      class="mx-auto max-w-sm xl:max-w-md"
      effect="cards"
      :grab-cursor="true"
      :pagination="pagination"
      :modules="[EffectCards, Pagination]"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(slide, key) in slides" :key="key" class="mx-auto flex justify-center">
        <NftCard :id="key + 1" :data="slide" class="min-h-[16rem] md:min-h-[18rem] lg:min-h-[20rem]" />
      </swiper-slide>
    </swiper>
  </div>

  <n-space class="mx-auto mt-8 w-auto" justify="center">
    <slot />
  </n-space>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCards, Pagination } from 'swiper/modules';
import { type Swiper as SwiperClass } from 'swiper/types';

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
    return collectionStore.metadata.length;
  },
});

onMounted(() => {
  slides.value = collectionStore.metadata.slice(0, SLIDES_TO_SHOW);
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
    slides.value.length < collectionStore.metadata.length
  ) {
    slides.value.push(collectionStore.metadata[swiper.previousIndex + SLIDES_TO_SHOW]);
  }
}
</script>

<style lang="postcss">
.swiper-pagination {
  @apply relative;

  &.swiper-pagination-fraction {
    @apply bottom-0 mt-2;
  }
}
</style>
