export default function useCaptcha() {
  const config = useRuntimeConfig();
  const captchaKey = ref<string>(config.public.captchaKey);
  const captchaInput = ref<any>(null);
  const loading = ref<boolean>(false);

  function onCaptchaError(err: any) {
    console.warn(err);
    loading.value = false;
  }

  function onCaptchaExpire(err: any) {
    console.warn(err);
    loading.value = false;
    // captchaInput.value.reset();
  }

  function onCaptchaClose(...args) {
    console.debug(args);
    loading.value = false;
  }

  return {
    captchaKey,
    captchaInput,
    loading,
    onCaptchaError,
    onCaptchaExpire,
    onCaptchaClose,
  };
}
