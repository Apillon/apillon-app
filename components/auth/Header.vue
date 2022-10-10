<template>
  <div class="bg-gradientDark">
    <div class="container h-[160px] pt-12 pb-16">
      <div class="flex h-full">
        <div
          class="flex justify-center"
          :class="isLogoCentered ? 'md:justify-center md:w-full' : 'md:justify-start md:w-1/2'"
        >
          <Logo />
        </div>
        <div
          v-if="isLoginSwitchVisible"
          class="flex md:w-1/2 items-end justify-center md:justify-end"
        >
          <div class="flex items-center">
            <NuxtLink
              to="signup"
              class="text-sm"
              :class="[!isLogin ? 'text-blue' : 'text-grey-light']"
            >
              <strong>{{ $t('general.signup') }}</strong>
            </NuxtLink>
            <AnimationSwitcher :value="isLogin" class="cursor-pointer" @click="switchPage" />
            <NuxtLink
              to="login"
              class="text-sm"
              :class="[isLogin ? 'text-blue' : 'text-grey-light']"
            >
              <strong>{{ $t('general.login') }}</strong>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { WritableComputedRef } from 'vue';
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';

const authStore = useAuthStore();
const router = useRouter();

const isLogin: WritableComputedRef<boolean> = computed({
  get(): boolean {
    return authStore.authStep === AuthStep.LOGIN;
  },
  set(newValue: boolean): void {
    authStore.authStep = newValue ? AuthStep.LOGIN : AuthStep.SIGN_UP;
  },
});

const isLoginSwitchVisible = computed(() => {
  return authStore.authStep === AuthStep.LOGIN || authStore.authStep === AuthStep.SIGN_UP;
});

const isLogoCentered = computed(() => {
  return (
    authStore.authStep === AuthStep.SIGN_UP_EMAIL ||
    authStore.authStep === AuthStep.SIGN_UP_CONFIRMED
  );
});

function switchPage() {
  isLogin.value = !isLogin.value;
  if (isLogin.value) {
    router.push('/login');
  } else {
    router.push('/signup');
  }
}
</script>
