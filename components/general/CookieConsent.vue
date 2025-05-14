<template>
  <vue-cookie-accept-decline
    v-if="config.public.gtmId"
    ref="cookieConsent"
    element-id="cookieConsent"
    type="floating"
    position="bottom"
    :debug="false"
    :disable-decline="false"
    transition-name="slideDown"
    :show-postpone-button="true"
    @status="status"
    @clicked-accept="cookieClickedAccept"
    @clicked-decline="cookieClickedDecline"
    @clicked-postpone="cookieClickedDecline"
  >
    <!-- Optional -->
    <template #message>
      <div class="text-center">
        <h3 class="mb-2">But first. Cookie policy!</h3>
        <p class="text-bg-lighter">
          By visiting our website, you are acknowledging your consent to the utilization of cookies as specified in our
          <NuxtLink to="https://apillon.io/cookie-policy" target="_blank">Cookie Policy</NuxtLink>, aimed at enhancing
          user experience.
        </p>
      </div>

      <div class="absolute bottom-0 left-0 right-0 hidden justify-center sm:flex">
        <Image :src="GraphicsCookies" width="166" height="182" alt="cookies" />
      </div>
    </template>

    <!-- Optional -->
    <template #declineContent>
      <Btn class="w-full min-w-[120px]" type="secondary" round> Decline </Btn>
    </template>

    <!-- Optional -->
    <template #acceptContent>
      <Btn class="w-full min-w-[120px] !text-white" color="#141721" round>
        <span class="inline-block px-1">Accept all cookies</span>
      </Btn>
    </template>
  </vue-cookie-accept-decline>
</template>

<script lang="ts" setup>
import { useGtm } from '@gtm-support/vue-gtm';
import GraphicsCookies from '~/assets/icons/dashboard/cookies.svg';

const COOKIE_KEY = 'al_vue-cookie-accept-decline-cookieConsent';

const config = useRuntimeConfig();
const gtm = useGtm();
const status = ref<string | null>(null);

onMounted(() => {
  if (localStorage.getItem(COOKIE_KEY)) {
    status.value = localStorage.getItem(COOKIE_KEY) === 'accept' ? 'accept' : 'decline';

    if (status.value === 'accept') {
      gtm?.enable(true);
    }
  }
});

function cookieClickedAccept() {
  gtm?.enable(true);

  status.value = 'accept';
  localStorage.setItem(COOKIE_KEY, status.value);
}

function cookieClickedDecline() {
  gtm?.enable(false);

  status.value = 'decline';
  localStorage.setItem(COOKIE_KEY, status.value);
}
</script>

<style lang="postcss">
.cookie {
  @apply fixed -bottom-4 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 translate-y-0;
  backface-visibility: hidden;

  &:before {
    content: '';
    @apply fixed left-1/2 top-1/2 -z-1 block h-[400vh] w-[400vw] -translate-x-1/2 -translate-y-1/2 bg-black/40;
  }

  &__floating__wrap {
    @apply flex flex-col justify-between rounded-t-2xl bg-white p-5 pb-8 text-bg sm:pb-60;
  }

  &__floating__content {
    @apply mb-6 md:px-10;
  }

  &__floating__buttons {
    @apply flex flex-row-reverse flex-wrap justify-center gap-x-6 gap-y-4;
  }

  &__floating__buttons__button--accept,
  &__floating__buttons__button--decline {
    @apply !border-none bg-transparent p-0 hover:bg-transparent;
  }

  &__floating__buttons__button--accept .n-button {
    --n-color-hover: #141721 !important;
  }

  &__floating__buttons__button--decline .n-button {
    --n-text-color: #141721 !important;
    --n-color-hover: #141721 !important;
    --n-text-color-hover: #f4f4ea !important;
  }

  &__floating__postpone-button {
    @apply mb-4 flex h-10 w-10 cursor-pointer items-center justify-center self-end p-2 text-3xl;
  }
}

.slideDown-enter,
.slideDown-leave-to {
  transform: translate(-50%, 120%);
}
.slideDown-enter-to,
.slideDown-leave {
  transform: translate(-50%, 0%);
}

.slideIn-enter,
.slideIn-leave-to {
  transform: translate(120%, 0px);
}
.slideIn-enter-to,
.slideIn-leave {
  transform: translate(0px, 0px);
}
.slideDown-enter-active,
.slideIn-enter-active {
  transition: transform 600ms cubic-bezier(0.175, 0.885, 0.325, 1.175);
  transition-delay: 1500ms;
}
.slideDown-leave-active,
.slideIn-leave-active {
  transition: transform 600ms cubic-bezier(0.77, -0.095, 0.735, 0.045);
}
</style>
