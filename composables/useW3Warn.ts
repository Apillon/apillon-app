export default function useW3Warn(w3WarnKey: string) {
  const modalW3WarnVisible = ref<boolean>(false);

  /** Watch modalW3WarnVisible, onShow update timestamp of shown modal in session storage */
  watch(
    () => modalW3WarnVisible.value,
    shown => {
      if (shown) {
        sessionStorage.setItem(w3WarnKey, Date.now().toString());
      }
    }
  );

  return {
    modalW3WarnVisible,
  };
}
