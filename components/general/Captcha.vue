<template>
  <div ref="procaptchaContainerRef" id="procaptcha-container"></div>
</template>

<script lang="ts" setup>
useHead({
  script: [
    {
      type: 'module',
      id: 'procaptcha-script',
      src: 'https://js.prosopo.io/js/procaptcha.bundle.js',
      async: true,
      defer: true,
    },
    {
      type: 'module',
      body: true,
      children: `
            function onCaptchaVerified(captcha) {
              console.log('Captcha verified, output: ' + JSON.stringify(captcha))
              sessionStorage.setItem('${AuthLsKeys.PROSOPO}', captcha)
            }
            function onCaptchaOpen(captcha) {
              console.log('Captcha error: ' + JSON.stringify(captcha))
              sessionStorage.removeItem('${AuthLsKeys.PROSOPO}')
            }
            function onCaptchaError(captcha) {
              console.log('Captcha error: ' + JSON.stringify(captcha))
              sessionStorage.removeItem('${AuthLsKeys.PROSOPO}')
            }
            function onCaptchaExpired(captcha) {
              console.log('Captcha onCaptchaExpire: ' + JSON.stringify(captcha))
              sessionStorage.removeItem('${AuthLsKeys.PROSOPO}')
            }

            window.procaptchaLoaded = false;
            var script = document.querySelector('#procaptcha-script');
            script.addEventListener('load', function() {
              loadProcaptcha();
            });

            const loadProcaptcha = () => {
              window.procaptchaLoaded = true;
              const captchaContainer = document.getElementById('procaptcha-container')
              procaptcha.render(captchaContainer, {
                  siteKey: '${useRuntimeConfig().public.captchaKey}',
                  theme: 'dark',
                  callback: onCaptchaVerified, 
                  openCallback: onCaptchaOpen, 
                  errorCallback: onCaptchaError, 
                  expiredCallback: onCaptchaExpired, 
              })
            }
            window.loadProcaptcha = loadProcaptcha;                 
             
      `,
    },
  ],
});

const procaptchaContainerRef = ref<HTMLElement>();

onMounted(async () => {
  await sleep(1000);
  if (!procaptchaContainerRef.value?.children?.length) {
    window.loadProcaptcha();
  }
});
</script>
