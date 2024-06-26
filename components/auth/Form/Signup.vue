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
    <n-form-item :show-label="false" :show-feedback="false">
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
import type { FormItemRule } from 'naive-ui';
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { useAccount } from 'use-wagmi';

type SignupForm = {
  email: string;
  captcha?: any;
  refCode?: string;
  metadata?: any;
  terms?: boolean;
  isEvmWallet?: boolean;
  wallet?: string | null;
  signature?: string | null;
  timestamp?: number | null;
};

const props = defineProps({
  sendAgain: { type: Boolean, default: false },
});

const { query } = useRoute();
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
const { address, isConnected } = useAccount();

const formRef = ref<NFormInst | null>(null);
const formErrors = ref<boolean>(false);
const newsletterChecked = ref<boolean>(false);

const formData = ref<SignupForm>({
  email: authStore.email,
  captcha: null as any,
  refCode: `${query?.REF || ''}`,
  metadata: getMetadata(),
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
      validator(_: FormItemRule, value: string) {
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
    $i18n.t('auth.terms.accept'),
    h(
      'a',
      { href: 'https://apillon.io/legal-disclaimer', target: '_blank' },
      { default: () => $i18n.t('auth.terms.tc') }
    ),
    $i18n.t('auth.terms.and'),
    h(
      'a',
      { href: 'https://apillon.io/privacy-policy', target: '_blank' },
      { default: () => $i18n.t('auth.terms.pp') }
    ),
    '.',
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

  // Wallet register params
  if (authStore.wallet.signature && authStore.wallet.timestamp) {
    formData.value.isEvmWallet = isConnected.value;
    formData.value.signature = authStore.wallet.signature;
    formData.value.timestamp = authStore.wallet.timestamp;
    formData.value.wallet = isConnected.value ? address.value : authStore.wallet.address;
  }

  try {
    await $api.post<ValidateMailResponse>(endpoints.validateMail, formData.value);

    if (!props.sendAgain) {
      if (newsletterChecked.value) {
        await subscribeToNewsletter(formData.value.email);
      }
      formData.value.signature = '';
      formData.value.timestamp = 0;

      /** Track new registration */
      trackEvent('registration_email_input');

      router.push({ name: 'register-email' });
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

function getMetadata() {
  return query && Object.keys(query).length
    ? JSON.stringify(query)
    : readCookie('apillon_mkt_params');
}
</script>
