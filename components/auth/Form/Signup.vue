<template>
  <n-form ref="formRef" :model="formData" :rules="rules">
    <!--  Signup email -->
    <n-form-item v-show="!sendAgain" path="email" :show-label="false" :show-feedback="formErrors">
      <n-input
        v-model:value="formData.email"
        :input-props="{ type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
        clearable
      />
    </n-form-item>

    <div v-show="!sendAgain" class="relative" :class="formErrors ? '-top-2 ' : 'mt-2'">
      <n-form-item path="terms" :show-label="false" :show-feedback="formErrors && !formData.terms">
        <n-checkbox v-model:checked="formData.terms" size="medium" :label="termsLabel" />
      </n-form-item>
    </div>

    <div v-show="!sendAgain" class="relative" :class="formErrors ? ' mb-4' : 'mb-6'">
      <n-checkbox
        v-model:checked="newsletterChecked"
        size="medium"
        :label="$t('auth.signup.newsletter')"
      />
    </div>

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

type SignupForm = {
  email: string;
  captcha?: any;
  refCode?: string;
  terms?: boolean;
};

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
const formErrors = ref<boolean>(false);
const newsletterChecked = ref<boolean>(false);

const formData = ref<SignupForm>({
  email: authStore.email,
  captcha: null as any,
  refCode: `${$route.query?.REF || ''}`,
  terms: false,
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
  terms: [
    {
      validator(_: NFormItemRule, value: string) {
        return props.sendAgain || !!value;
      },
      message: $i18n.t('validation.terms'),
      trigger: 'change',
    },
  ],
};

/** Terms label with link  */
const termsLabel = computed<any>(() => {
  return h('span', {}, [
    $i18n.t('auth.terms.agree'),
    h(
      'a',
      { href: 'https://apillon.io/legal-disclaimer', target: '_blank' },
      { default: () => $i18n.t('auth.terms.tc&pp') }
    ),
  ]);
});

function handleSubmit(e: MouseEvent | null) {
  e?.preventDefault();
  formErrors.value = false;
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      formErrors.value = true;
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
      if (newsletterChecked.value) {
        await subscribeToNewsletter(formData.value.email);
      }

      router.push({ name: 'register-email' });

      /** Track new registration */
      trackEvent('registration_email_input');
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
