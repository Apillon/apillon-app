<template>
  <div class="relative min-h-[400px]">
    <transition name="fadeBlur" appear>
      <div v-if="step === Steps.WELCOME" class="w-full text-center">
        <NuxtIcon name="dashboard/care" class="icon-auto mx-auto inline-block" filled />
        <h4 class="my-6">{{ $t('dashboard.onboarding.welcome') }}!</h4>
        <p>{{ $t('dashboard.onboarding.modal.info') }}</p>
        <SeparatorText />
        <Notification v-if="!isLg" class="text-left" type="warning">
          {{ $t('dashboard.onboarding.modal.notification') }}
        </Notification>
        <Btn class="mt-6 min-w-60" size="large" @click="step = Steps.CREDITS">{{ $t('general.next') }}</Btn>
      </div>
      <div v-else-if="step === Steps.CREDITS" class="w-full text-center">
        <NuxtIcon name="dashboard/pricing" class="icon-auto mx-auto inline-block" filled />
        <h4 class="my-6">{{ $t('dashboard.onboarding.modal.credits.title') }}</h4>
        <p>{{ $t('dashboard.onboarding.modal.credits.info') }}</p>
        <p>{{ $t('dashboard.onboarding.modal.credits.content') }}</p>

        <div class="my-6">
          <p class="mb-2">{{ $t('dashboard.onboarding.modal.credits.start') }}</p>
          <span class="inline-block whitespace-nowrap text-blue">
            <span class="icon-credits inline-block align-text-top text-xl"></span>
            <strong class="ml-2 mr-1 inline-block text-xs"> 1200 </strong>
          </span>
        </div>

        <div class="flex gap-4">
          <Btn class="w-full md:w-1/2" size="large" type="secondary" @click="dataStore.project.showOnboarding = false">
            {{ $t('dashboard.onboarding.modal.credits.lookAround') }}
          </Btn>
          <Btn class="w-full md:w-1/2" size="large" @click="step = Steps.PROJECT">{{
            $t('dashboard.onboarding.modal.credits.project')
          }}</Btn>
        </div>
      </div>
      <div v-else-if="step === Steps.PROJECT">
        <h4 class="mb-6">{{ $t('dashboard.onboarding.modal.credits.project') }}</h4>
        <FormProject @submit-success="step = Steps.TOKEN" />
      </div>
      <OnboardingFinish v-else-if="step === Steps.TOKEN" @close="dataStore.project.showOnboarding = false" />
    </transition>
  </div>

  <div v-if="step < Steps.PROJECT" class="mt-6 text-center">
    <n-steps v-model:current="step" class="dots">
      <n-step />
      <n-step />
    </n-steps>
  </div>
</template>

<script lang="ts" setup>
enum Steps {
  WELCOME = 1,
  CREDITS = 2,
  PROJECT = 3,
  TOKEN = 4,
}

const { isLg } = useScreen();
const dataStore = useDataStore();
const step = ref<number>(Steps.WELCOME);
</script>
