<template>
  <n-form ref="formRef" :model="formData" :rules="rules">
    <!--  Signup email -->
    <n-form-item v-show="!sendAgain" path="email" :show-label="false">
      <n-input
        v-model:value="formData.email"
        :input-props="{ type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
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

    <!--  Signup submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.login')" />
      <Btn v-if="sendAgain" type="primary" size="medium" @click="handleSubmit">
        {{ $t('auth.signup.sendAgain') }}
      </Btn>
      <Btn v-else type="primary" size="large" class="mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.continue') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

const props = defineProps({
  sendAgain: { type: Boolean, default: false },
});

const $route = useRoute();
const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
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

const formData = ref<SignupForm>({
  email: authStore.email,
  captcha: null as any,
  refCode: `${$route.query?.REF || ''}`,
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
};

function handleSubmit(e: MouseEvent | null) {
  e?.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (!formData.value.captcha) {
      loading.value = true;
      captchaInput.value.execute();
    } else {
      // Email validation
      authStore.saveEmail(formData.value.email);
      await signupWithEmail();
    }
  });
}
async function signupWithEmail() {
  loading.value = true;

  try {
    await $api.post<ValidateMailResponse>(endpoints.validateMail, formData.value);

    if (!props.sendAgain) {
      router.push({ name: 'register-email' });

      /** Track new registration */
      tractEvent('registration', 'registration_email_input', 'Email signup');
    } else {
      message.success($i18n.t('form.success.sendAgainEmail'));
    }
  } catch (error) {
    formData.value.captcha = null;
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

function onCaptchaVerify(token: string, eKey: string) {
  formData.value.captcha = { token, eKey };
  handleSubmit(null);
  loading.value = false;
}
</script>
