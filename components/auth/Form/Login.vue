<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
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
    <n-form-item path="password" :show-label="false">
      <n-input
        v-model:value="formData.password"
        type="password"
        show-password-on="click"
        :input-props="{ autocomplete: 'off' }"
        :placeholder="$t('form.placeholder.password')"
        clearable
      />
    </n-form-item>

    <n-form-item v-if="showCaptcha" path="captcha" :show-label="false">
      <div class="block w-full h-20">
        <Captcha />
      </div>
      <n-input v-model:value="formData.captcha" class="absolute hidden" />
    </n-form-item>

    <!--  Login submit -->
    <n-form-item :show-label="false">
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
const config = useRuntimeConfig();
const authStore = useAuthStore();
const dataStore = useDataStore();
const { clearAll } = useStore();

const loading = ref<boolean>(false);
const showCaptcha = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<FormLogin>({
  email: authStore.email,
  password: '',
  captcha: undefined,
  captchaJwt: null,
});

const rules: NFormRules = {
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

onMounted(() => {
  document.addEventListener('EventCaptchaVerified', login);
});
onUnmounted(() => {
  document.removeEventListener('EventCaptchaVerified', login);
});

function handleSubmit(e: Event | MouseEvent | null) {
  e?.preventDefault();

  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (!formData.value.captcha && !isCaptchaConfirmed()) {
      showCaptcha.value = true;
    } else {
      await login();
    }
  });
}

async function login() {
  loading.value = true;
  document.removeEventListener('EventCaptchaVerified', login);

  const prosopoToken = sessionStorage.getItem(AuthLsKeys.PROSOPO);
  if (prosopoToken) {
    formData.value.captcha = { token: prosopoToken, eKey: config.public.captchaKey };
  }
  const captchaData = authStore.getCaptchaData(formData.value.email);
  if (captchaData) {
    formData.value.captchaJwt = captchaData.jwt;
  }
  try {
    // Logout first - delete LS and store if there is any data
    authStore.logout();
    dataStore.resetCurrentProject();

    /** Clear all stored data */
    clearAll();

    const res = await $api.post<LoginResponse>(endpoints.login, formData.value);

    authStore.saveUser(res.data);
    captchaReset();

    /** Fetch projects, if user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
    dataStore.project.items = await dataStore.fetchProjects(true);
  } catch (error: ApiError | ReferenceError | any) {
    message.error(userFriendlyMsg(error));
    captchaReset();

    if (error.code === ValidatorErrorCode.CAPTCHA_NOT_PRESENT) {
      loading.value = true;
      authStore.removeCaptchaJwt(formData.value.email);
    } else if (DevConsoleError.USER_INVALID_LOGIN) {
      authStore.removeCaptchaJwt(formData.value.email);
    }
  }
  loading.value = false;
}

/**
 * Captcha confirmed is last week
 */
function isCaptchaConfirmed(): boolean {
  const captchaData = authStore.getCaptchaData(formData.value.email);
  return !!captchaData && !!captchaData.ts && Date.now() < parseInt(captchaData.ts) + WEEK_IN_MS;
}

function captchaReset() {
  formData.value.captcha = undefined;
  sessionStorage.removeItem(AuthLsKeys.PROSOPO);
}
</script>
