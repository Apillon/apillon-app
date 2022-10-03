import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export default defineNuxtPlugin(nuxtApp => {
  const targetRef = ref(null);

  nuxtApp.vueApp.directive('scroll-lock', {
    mounted(el, _binding) {
      targetRef.value = el;
    },
  });

  return {
    provide: {
      enableBodyScroll: () => enableBodyScroll(targetRef),
      disableBodyScroll: () => disableBodyScroll(targetRef),
      clearAllBodyScrollLocks: () => clearAllBodyScrollLocks(),
    },
  };
});
