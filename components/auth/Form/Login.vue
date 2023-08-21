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
        show-password-on="mousedown"
        :input-props="{ autocomplete: 'off' }"
        :placeholder="$t('form.placeholder.password')"
        clearable
      />
    </n-form-item>

    <!-- Hcaptcha -->
    <vue-hcaptcha
      ref="captchaInput"
      :sitekey="captchaKey"
      size="invisible"
      theme="dark"
      @error="onCaptchaError"
      @verify="onCaptchaVerify"
      @expired="onCaptchaExpire"
      @challenge-expired="onCaptchaChallengeExpire"
      @closed="onCaptchaClose"
    />

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
import { createDiscreteApi } from 'naive-ui';
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

const $i18n = useI18n();
const authStore = useAuthStore();
const dataStore = useDataStore();
const { clearAll } = useStore();
const config = useRuntimeConfig();
const { message } = createDiscreteApi(['message'], MessageProviderOptions);
const {
  loading,
  captchaKey,
  captchaInput,
  onCaptchaChallengeExpire,
  onCaptchaClose,
  onCaptchaError,
  onCaptchaExpire,
} = useCaptcha();

const formRef = ref<NFormInst | null>(null);
const formData = ref<FormLogin>({
  email: authStore.email,
  password: '',
  captcha: null as any,
});
const rules: NFormRules = {
  email: [
    {
      type: 'email',
      message: $i18n.t('validation.email'),
    },
    {
      required: true,
      message: $i18n.t('validation.emailRequired'),
    },
  ],
  password: [
    {
      required: true,
      message: $i18n.t('validation.passwordRequired'),
    },
  ],
};

function handleSubmit(e: Event | MouseEvent | null) {
  e?.preventDefault();

  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (!formData.value.captcha && !isCaptchaConfirmed(LsCaptcha.LOGIN)) {
      loading.value = true;
      captchaInput.value.execute();
    } else {
      /** Login with mail and password */
      await login();
    }
  });
}

async function login() {
  loading.value = true;
  try {
    // Logout first - delete LS and store if there is any data
    authStore.logout();
    dataStore.resetCurrentProject();

    /** Clear all stored data */
    clearAll();

    const res = await $api.post<LoginResponse>(endpoints.login, formData.value);

    authStore.saveUser(res.data);

    /** Fetch projects, if user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
    dataStore.project.items = await dataStore.fetchProjects(true);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

/**
 * Captcha confirmed is last week
 */
function isCaptchaConfirmed(key: string): boolean {
  const timestamp = sessionStorage.getItem(key);
  if (timestamp) {
    return parseInt(timestamp) + WEEK_IN_MS < Date.now();
  }
  return false;
}

function onCaptchaVerify(token: string, eKey: string) {
  /** Save Captcha login timestamp to LS */
  localStorage.setItem(LsCaptcha.LOGIN, Date.now().toString());

  formData.value.captcha = { token, eKey };
  handleSubmit(null);
  loading.value = false;
}
</script>
