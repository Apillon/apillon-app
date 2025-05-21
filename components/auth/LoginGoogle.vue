<script lang="ts" setup>
defineEmits(['loading']);
defineProps({
  register: { type: Boolean, default: false },
});

const config = useRuntimeConfig();
const message = useMessage();

const loading = ref(false);

async function authenticate() {
  loading.value = true;

  try {
    sessionStorage.setItem(SessionKeys.OAUTH_ACTION, OauthActionTypes.LOGIN);
    window.location.href = `${config.public.apiUrl}/users/google`;
  } catch (e: ApiError | any) {
    console.error(e);
    message.error(userFriendlyMsg(e));
  }

  loading.value = false;
}
</script>

<template>
  <Btn size="large" type="secondary" inner-class="flex gap-2 items-center" :loading="loading" @click="authenticate">
    <NuxtIcon name="logo/google" class="text-xl" filled />
    <span v-if="register" class="text-white">{{ $t('auth.signup.google') }}</span>
    <span v-else class="text-white">{{ $t('auth.login.google') }}</span>
  </Btn>
</template>
