<template>
  <div class="bg-gradientDark">
    <div class="container min-h-[120px] py-8 sm:pt-12 sm:pb-10">
      <div class="flex items-center h-full">
        <div
          class="flex pr-3 sm:pr-0"
          :class="isLogoFullwidth ? 'justify-center w-full' : 'justify-start w-1/2'"
        >
          <Logo :width="162" :height="28" />
        </div>
        <div v-if="isLoginSwitchVisible" class="flex w-1/2 items-end justify-end">
          <div class="flex items-center">
            <NuxtLink
              :to="{ name: 'register' }"
              class="text-sm"
              :class="[
                !isLogin ? 'text-blue' : 'text-white',
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
                isLogin ? 'text-blue' : 'text-white',
                allowSwitchPage ? 'cursor-pointer' : 'cursor-default pointer-events-none',
              ]"
              @click.native="pageSwitched"
            >
              <strong>{{ $t('general.login') }}</strong>
            </NuxtLink>
          </div>
        </div>
        <div v-else-if="authStore.loggedIn" class="flex w-1/2 items-end justify-end">
          <HeaderProfile />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { WritableComputedRef } from 'vue';

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
const isLogoFullwidth = computed(() => {
  return !isLoginSwitchVisible.value && !authStore.loggedIn;
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
