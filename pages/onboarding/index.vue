<template>
  <div class="flex flex-wrap xl:pt-8 md:pt-6 pt-4">
    <div class="w-full md:w-1/2">
      <h1 class="mb-10 text-center md:text-left">{{ $t('auth.onboarding.web3Gateway') }}</h1>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 lg:mb-16 md:mb-10">
        <div class="p-6 flex flex-col justify-between bg-bg-light shadow-black">
          <div>
            <h4 class="mb-1">{{ $t('auth.onboarding.createWeb3Project') }}</h4>
            <p class="mb-4">{{ $t('auth.onboarding.buildCustomApp') }}</p>
          </div>
          <div>
            <Btn type="primary" size="large" @click="router.push({ name: 'onboarding-project' })">
              {{ $t('auth.onboarding.startBuilding') }}
            </Btn>
          </div>
        </div>
        <div class="p-6 flex flex-col justify-between bg-bg-light shadow-black">
          <div>
            <h4 class="mb-1">{{ $t('auth.onboarding.demoProject') }}</h4>
            <p class="mb-4">{{ $t('auth.onboarding.walkThroughWeb3') }}</p>
          </div>
          <div>
            <Btn type="secondary" size="large">{{ $t('auth.onboarding.buildDemo') }}</Btn>
          </div>
        </div>
      </div>
      <NuxtLink :to="{ name: 'dashboard' }" class="text-body text-bold">
        {{ $t('auth.onboarding.skip') }}
      </NuxtLink>
    </div>
    <AuthProjectHelp />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();

definePageMeta({
  layout: 'onboarding',
});
useHead({
  title: t('auth.signup.emailConfirmed'),
});
</script>
