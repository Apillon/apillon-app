<template>
  <div class="flex flex-wrap xl:pt-8 md:pt-6 pt-4">
    <div class="w-full md:w-1/2">
      <h1 class="mb-10 text-center md:text-left">{{ $t('onboarding.web3Gateway') }}</h1>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 lg:mb-16 md:mb-10">
        <div class="p-6 flex flex-col justify-between bg-grey-dark shadow-black">
          <div>
            <h4 class="mb-1">{{ $t('onboarding.createWeb3Project') }}</h4>
            <p class="mb-4">{{ $t('onboarding.buildCustomApp') }}</p>
          </div>
          <div>
            <Btn type="primary" size="large" @click="router.push({ name: 'onboarding-project' })">
              {{ $t('onboarding.startBuilding') }}
            </Btn>
          </div>
        </div>
        <div class="p-6 flex flex-col justify-between bg-grey-dark shadow-black">
          <div>
            <h4 class="mb-1">{{ $t('onboarding.demoProject') }}</h4>
            <p class="mb-4">{{ $t('onboarding.walkThroughWeb3') }}</p>
          </div>
          <div>
            <Btn type="secondary" size="large">{{ $t('onboarding.buildDemo') }}</Btn>
          </div>
        </div>
      </div>
      <NuxtLink :to="{ name: 'dashboard' }" class="text-grey text-bold">
        {{ $t('onboarding.skip') }}
      </NuxtLink>
    </div>
    <AuthProjectHelp />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

definePageMeta({
  layout: 'onboarding',
});
useHead({
  title: t('signup.emailConfirmed'),
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.LOGIN_FIRST;
});
</script>
