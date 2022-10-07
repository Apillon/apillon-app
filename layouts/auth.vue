<template>
  <div class="relative min-h-screen h-full pb-20">
    <AuthHeader />
    <div class="container flex md:flex-auto py-0 md:py-10">
      <transition name="width" :duration="1000">
        <AnimationJet v-if="isLogin" class="pr-10" />
      </transition>

      <div
        v-if="isLogin || isSignUp"
        class="relative w-full md:w-1/2 md:min-w-[490px] md:max-w-[490px]"
      >
        <transition name="fade" :duration="1000">
          <Login v-if="isLogin" />
          <Signup v-else-if="isSignUp" />
        </transition>
      </div>
      <slot v-else />

      <transition name="width" :duration="1000">
        <AnimationPress v-if="isSignUp" class="pl-10" />
      </transition>
    </div>
    <AuthFooter class="absolute left-0 right-0 bottom-0 w-full" />
  </div>
</template>

<script lang="ts" setup>
import Signup from '../pages/signup.vue';
import Login from '../pages/login.vue';
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';
const authStore = useAuthStore();

const isLogin = computed(() => {
  return authStore.authStep === AuthStep.LOGIN;
});
const isSignUp = computed(() => {
  return authStore.authStep === AuthStep.SIGN_UP;
});

const router = useRouter();
router.afterEach(to => {
  const pageName: string = to.name.toString();
  if ([AuthStep.SIGN_UP as string, AuthStep.LOGIN as string].includes(pageName)) {
    authStore.authStep = pageName;
  }
});
</script>
