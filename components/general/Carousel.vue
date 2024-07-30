<template>
  <Carousel v-bind="settings">
    <Slide key="slide1">
      <img src="/assets/images/embedded-wallet/s1.jpg" alt="nft template" />
    </Slide>
    <Slide key="slide3">
      <img src="/assets/images/embedded-wallet/s5.jpg" alt="nft template" />
    </Slide>
    <Slide key="slide4">
      <img src="/assets/images/embedded-wallet/s6.jpg" alt="nft template" />
    </Slide>
    <Slide key="slide5">
      <img src="/assets/images/embedded-wallet/s7.jpg" alt="nft template" />
    </Slide>
    <Slide key="slide6">
      <img src="/assets/images/embedded-wallet/s8.jpg" alt="nft template" />
    </Slide>

    <template #addons>
      <Pagination />
      <Navigation />
    </template>
  </Carousel>
</template>

<script setup>
import { ref } from 'vue';
import { Carousel, Navigation, Slide, Pagination } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

// Carousel settings
const settings = ref({
  itemsToShow: 1,
  snapAlign: 'center',
});
</script>

<style lang="postcss">
.carousel__item {
  min-height: 200px;
  width: 100%;
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aquamarine;
}
.carousel__prev,
.carousel__next {
  color: #f9ff73;
}
.carousel__pagination-button--active::after {
  background-color: #f9ff73;
}
</style>
