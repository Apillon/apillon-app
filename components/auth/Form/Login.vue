<template>
  <n-form ref="formRef" size="large" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Login email -->
    <n-form-item path="email" :show-label="false">
      <n-input
        v-model:value="formData.email"
        :input-props="{ type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
        clearable
        @keydown.enter.prevent
      />
    </n-form-item>

    <!--  Login password -->
    <n-form-item class="mb-4" path="password" :show-label="false">
      <n-input
        v-model:value="formData.password"
        type="password"
        show-password-on="click"
        :input-props="{ autocomplete: 'off' }"
        :placeholder="$t('form.placeholder.password')"
        clearable
      />

      <!-- Links -->
      <div class="absolute right-0 top-full">
        <NuxtLink class="mt-2 inline-block text-sm text-body" :to="{ name: 'login-reset-password' }">
          {{ $t('auth.login.forgotPassword') }}
        </NuxtLink>
      </div>
    </n-form-item>

    <n-form-item v-if="showCaptcha" path="captcha" :show-label="false">
      <div class="block h-20 w-full">
        <Captcha @captcha-verified="onCaptchaVerified" />
      </div>
      <!-- <n-input v-model:value="formData.captcha" class="absolute hidden" /> -->
    </n-form-item>

    <!--  Login submit -->
    <n-form-item :show-label="false" :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('form.login')" />
      <Btn type="primary" size="large" class="mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.login') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
type FormLogin = {
  email: string;
  password: string;
  captcha?: { token: string; eKey: string };
  captchaJwt?: string | null;
};

const { t } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const { clearAll } = useStore();
const { showCaptcha, formCaptcha, captchaReset, isCaptchaConfirmed, onCaptchaVerified, captchaReload } = useCaptcha();

const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const formData = reactive<FormLogin>({
  email: authStore.email,
  password: '',
  captcha: undefined,
  captchaJwt: null,
});

const rules = computed<NFormRules>(() => {
  return {
    email: [
      ruleRequired(t('validation.emailRequired')),
      {
        type: 'email',
        message: t('validation.email'),
      },
    ],
    password: ruleRequired(t('validation.passwordRequired')),
    captcha: {
      required: showCaptcha.value,
      message: t('validation.captchaRequired'),
    },
  };
});

onMounted(() => {
  showCaptcha.value = !isCaptchaConfirmed(formData.email);
});

function handleSubmit(e: Event | MouseEvent | null) {
  e?.preventDefault();
  formData.captcha = formCaptcha.value;

  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      // errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (!formData.captcha && !isCaptchaConfirmed(formData.email)) {
      captchaReload();
    } else {
      await login();
    }
  });
}

async function login() {
  loading.value = true;

  const captchaData = authStore.getCaptchaData(formData.email);
  if (captchaData) {
    formData.captchaJwt = captchaData.jwt;
  }
  try {
    // Logout first - delete LS and store if there is any data
    authStore.logout();
    dataStore.resetData();

    /** Clear all stored data */
    clearAll();

    const { data } = await $api.post<LoginResponse>(endpoints.login, formData);
    authStore.saveUser(data);

    /** Fetch projects, if user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
    await dataStore.fetchProjects(true);
  } catch (error: ApiError | ReferenceError | any) {
    message.error(userFriendlyMsg(error));
    captchaReload();

    if (error.code === ValidatorErrorCode.CAPTCHA_NOT_PRESENT) {
      loading.value = true;
      showCaptcha.value = true;
      authStore.removeCaptchaJwt(formData.email);
    } else if (DevConsoleError.USER_INVALID_LOGIN) {
      authStore.removeCaptchaJwt(formData.email);
    }
  }
  captchaReset();
  loading.value = false;
}
</script>
