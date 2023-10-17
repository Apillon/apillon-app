import dragScroll from 'drag-scroll-vue3';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('drag-scroll', dragScroll);
});
