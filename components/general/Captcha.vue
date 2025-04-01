<template>
  <div id="procaptcha-container" ref="procaptchaContainerRef"></div>
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
            const eventCaptchaVerified = new Event("EventCaptchaVerified");
            const eventCaptchaReload = new Event("EventCaptchaReload");

            function onCaptchaVerified(captcha) {
              sessionStorage.setItem('${AuthLsKeys.PROSOPO}', captcha);
              document.dispatchEvent(eventCaptchaVerified);
            }
            function onCaptchaOpen(captcha) {
              sessionStorage.removeItem('${AuthLsKeys.PROSOPO}');
            }
            function onCaptchaError(captcha) {
              sessionStorage.removeItem('${AuthLsKeys.PROSOPO}');
              document.dispatchEvent(eventCaptchaReload);
            }
            function onCaptchaExpired(captcha) {
              sessionStorage.removeItem('${AuthLsKeys.PROSOPO}');
              document.dispatchEvent(eventCaptchaReload);
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
