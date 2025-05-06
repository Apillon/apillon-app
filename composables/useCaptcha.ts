export type FormCaptcha = {
  token: string;
  eKey: string;
};

export default function useProvider() {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  const showCaptcha = ref<boolean>(false);
  const formCaptcha = ref<FormCaptcha | undefined>();

  function captchaReset() {
    formCaptcha.value = undefined;
  }

  function isCaptchaConfirmed(email: string): boolean {
    const captchaData = authStore.getCaptchaData(email);
    return !!captchaData && !!captchaData.ts && Date.now() < parseInt(captchaData.ts) + WEEK_IN_MS;
  }

  function onCaptchaVerified(token: string) {
    console.log('onVerified', token);
    formCaptcha.value = { token, eKey: config.public.captchaKey };
  }

  function captchaReload() {
    showCaptcha.value = false;
    setTimeout(() => (showCaptcha.value = true), 1);
  }

  return {
    formCaptcha,
    showCaptcha,
    captchaReload,
    captchaReset,
    isCaptchaConfirmed,
    onCaptchaVerified,
  };
}
