<template>
  <vue-cookie-accept-decline
    v-if="config.public.gtmId"
    ref="cookieConsent"
    :debug="false"
    class="card-dark rounded-lg"
    element-id="cookieConsent"
    type="floating"
    position="bottom-right"
    :disable-decline="false"
    transition-name="slideIn"
    :show-postpone-button="false"
    @status="status"
    @clicked-accept="cookieClickedAccept"
    @clicked-decline="cookieClickedDecline"
  >
    <!-- Optional -->
    <template #message>
      <p class="text-base text-body">{{ $t('general.cookieNotice') }}</p>
    </template>

    <!-- Optional -->
    <template #declineContent>
      <Btn class="bg-bg-light/0 w-full min-w-[120px]" type="secondary">
        {{ $t('general.decline') }}
      </Btn>
    </template>

    <!-- Optional -->
    <template #acceptContent>
      <Btn class="w-full min-w-[120px]" type="primary">{{ $t('general.accept') }}</Btn>
    </template>
  </vue-cookie-accept-decline>
</template>

<script lang="ts" setup>
import { useGtm } from '@gtm-support/vue-gtm';

const config = useRuntimeConfig();
const gtm = useGtm();
const status = ref<string | null>(null);

onMounted(() => {
  if (localStorage.getItem('al_vue-cookie-accept-decline-cookieConsent')) {
    status.value =
      localStorage.getItem('al_vue-cookie-accept-decline-cookieConsent') === 'accept'
        ? 'accept'
        : 'decline';

    if (status.value === 'accept') {
      gtm?.enable(true);
    }
  }
});

function cookieClickedAccept() {
  gtm?.enable(true);

  status.value = 'accept';
  localStorage.setItem('al_vue-cookie-accept-decline-cookieConsent', status.value);
}

function cookieClickedDecline() {
  gtm?.enable(false);

  status.value = 'decline';
  localStorage.setItem('al_vue-cookie-accept-decline-cookieConsent', status.value);
}
</script>

<style lang="postcss">
.cookie {
  @apply fixed bottom-0 right-0 z-20 w-full max-w-[350px] md:bottom-4 md:right-4 xl:bottom-12 xl:right-5;
  backface-visibility: hidden;

  &__floating__wrap {
    position: relative;
    display: flex;
    padding: 20px;
    flex-direction: column;
    justify-content: space-between;
  }

  &__floating__content {
    @apply mb-4 p-0;
  }

  &__floating__buttons {
    @apply flex justify-center gap-6;
  }

  &__floating__buttons__button--accept,
  &__floating__buttons__button--decline {
    @apply !border-none bg-transparent p-0 hover:bg-transparent;
  }
}

.slideIn-enter,
.slideIn-leave-to {
  transform: translate(120%, 0px);
}
.slideIn-enter-to,
.slideIn-leave {
  transform: translate(0px, 0px);
}
.slideIn-enter-active {
  transition: transform 600ms cubic-bezier(0.175, 0.885, 0.325, 1.175);
  transition-delay: 1500ms;
}
.slideIn-leave-active {
  transition: transform 600ms cubic-bezier(0.77, -0.095, 0.735, 0.045);
}
</style>
