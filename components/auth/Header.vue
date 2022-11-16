<template>
  <div class="bg-gradientDark">
    <div class="container min-h-[120px] py-12 pb-10">
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
              :to="{ name: 'register' }"
              class="text-sm"
              :class="[
                !isLogin ? 'text-blue' : 'text-grey-light',
                allowSwitchPage ? 'cursor-pointer' : 'cursor-default pointer-events-none',
              ]"
              @click.native="pageSwitched"
            >
              <strong>{{ $t('general.signup') }}</strong>
            </NuxtLink>
            <AnimationSwitcher :value="isLogin" class="cursor-pointer" @click="switchPage" />
            <NuxtLink
              :to="{ name: 'login' }"
              class="text-sm"
              :class="[
                isLogin ? 'text-blue' : 'text-grey-light',
                allowSwitchPage ? 'cursor-pointer' : 'cursor-default pointer-events-none',
              ]"
              @click.native="pageSwitched"
            >
              <strong>{{ $t('general.login') }}</strong>
            </NuxtLink>
          </div>
        </div>
        <div
          v-else-if="authStore.loggedIn"
          class="flex md:w-1/2 items-end justify-center md:justify-end"
        >
          <HeaderProfile />
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

/** Allow next page switch, after 1s */
const allowSwitchPage = ref<boolean>(true);
function switchPage() {
  if (!allowSwitchPage.value) return;

  pageSwitched();

  isLogin.value = !isLogin.value;
  if (isLogin.value) {
    router.push({ name: 'login' });
  } else {
    router.push({ name: 'register' });
  }
}
function pageSwitched() {
  allowSwitchPage.value = false;
  setTimeout(() => {
    allowSwitchPage.value = true;
  }, 1000);
}
</script>
