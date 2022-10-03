<template>
  <div class="container py-16">
    <div class="flex items-center">
      <div class="flex md:w-1/2 justify-center md:justify-start">
        <Logo />
      </div>
      <div class="flex md:w-1/2 justify-center md:justify-end">
        <div v-if="isLoginSwitchVisible">
          <strong class="text-sm" :class="switchTextClass">{{ $t('general.signup') }}</strong>
          <n-switch v-model:value="isLogin" @update:value="handleChange" />
          <strong class="text-sm" :class="switchTextClass">{{ $t('general.login') }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NSwitch } from 'naive-ui';
import { WritableComputedRef } from 'vue';
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';

const authStore = useAuthStore();
const router = useRouter();

// const isLogin = ref(null);
// onMounted(() => {
//   isLogin.value = authStore.authStep === AuthStep.LOGIN;
// });
const isLogin: WritableComputedRef<boolean> = computed({
  get(): boolean {
    return authStore.authStep === AuthStep.LOGIN;
  },
  set(newValue: boolean): void {
    authStore.authStep = newValue ? AuthStep.LOGIN : AuthStep.SIGN_UP;
  },
});

const isLoginSwitchVisible = computed(() => {
  return authStore.authStep === AuthStep.LOGIN || AuthStep.SIGN_UP;
});

const switchTextClass = computed(() => {
  return [isLogin.value ? 'text-black' : 'text-white'];
});

function handleChange(value: boolean) {
  if (value) {
    router.push('/login');
  } else {
    router.push('/signup');
  }
}
</script>
