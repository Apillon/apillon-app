import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export default defineNuxtPlugin(nuxtApp => {
  const targetRef = ref<HTMLElement>();

  nuxtApp.vueApp.directive('scroll-lock', {
    mounted(el, _binding) {
      targetRef.value = el;
    },
  });

  return {
    provide: {
      enableBodyScroll: () => enableBodyScroll(targetRef.value as HTMLElement),
      disableBodyScroll: () => disableBodyScroll(targetRef.value as HTMLElement),
      clearAllBodyScrollLocks: () => clearAllBodyScrollLocks(),
    },
  };
});
