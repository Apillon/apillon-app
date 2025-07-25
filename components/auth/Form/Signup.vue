<template>
  <n-form ref="formRef" size="large" :model="formData" :rules="rules">
    <!--  Signup email -->
    <n-form-item v-show="!sendAgain" path="email" :show-label="false">
      <n-input
        v-model:value="formData.email"
        :input-props="{ type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
        clearable
      />
    </n-form-item>

    <div v-show="!sendAgain" class="relative" :class="formErrors ? '-top-2' : 'mt-0'">
      <n-form-item path="terms" :show-label="false" :show-feedback="formErrors && !formData.terms">
        <n-checkbox v-model:checked="formData.terms" size="medium" :label="termsLabel" />
      </n-form-item>
    </div>

    <div v-show="!sendAgain" class="relative" :class="formErrors ? 'mb-4' : 'mb-6'">
      <n-checkbox v-model:checked="newsletterChecked" size="medium" :label="$t('auth.signup.newsletter')" />
    </div>

    <n-form-item v-if="showCaptcha" path="captcha" :show-label="false">
      <div class="block h-20 w-full" :class="{ 'mx-auto max-w-[302px]': sendAgain }">
        <Captcha @captcha-verified="onCaptchaVerified" />
      </div>
      <n-input v-model:value="formData.captcha" class="absolute hidden" />
    </n-form-item>

    <!--  Signup submit -->
    <n-form-item :show-label="false" :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('form.login')" />
      <Btn v-if="sendAgain" type="primary" size="large" @click="handleSubmit">
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
import { useAccount } from '@wagmi/vue';

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
const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const { address, isConnected } = useAccount();
const { showCaptcha, formCaptcha, captchaReset, captchaReload, onCaptchaVerified } = useCaptcha();

const formRef = ref<NFormInst | null>(null);
const formErrors = ref<boolean>(false);
const newsletterChecked = ref<boolean>(false);
const loading = ref<boolean>(false);

const formData = reactive<SignupForm>({
  email: authStore.email,
  captcha: null as any,
  refCode: `${query?.REF || ''}`,
  metadata: getMetadata(),
  terms: false,
});

const rules: NFormRules = {
  email: [
    ruleRequired(t('validation.emailRequired')),
    {
      type: 'email',
      message: t('validation.email'),
    },
  ],
  terms: [
    {
      validator(_: FormItemRule, value: string) {
        return props.sendAgain || !!value;
      },
      message: t('validation.terms'),
      trigger: 'change',
    },
  ],
  captcha: ruleRequired(t('validation.captchaRequired')),
};

/** Terms label with link  */
const termsLabel = computed<any>(() => {
  return h('span', {}, [
    t('auth.terms.accept'),
    h('a', { href: 'https://apillon.io/legal-disclaimer', target: '_blank' }, { default: () => t('auth.terms.tc') }),
    t('auth.terms.and'),
    h('a', { href: 'https://apillon.io/privacy-policy', target: '_blank' }, { default: () => t('auth.terms.pp') }),
    '.',
  ]);
});

onMounted(() => {
  showCaptcha.value = true;
});

function handleSubmit(e: MouseEvent | null) {
  e?.preventDefault();
  formErrors.value = false;
  formData.captcha = formCaptcha.value;

  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      formErrors.value = true;
      // errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      authStore.saveEmail(formData.email);
      await signupWithEmail();
    }
  });
}
async function signupWithEmail() {
  loading.value = true;

  // Wallet register params
  if (authStore.wallet.signature && authStore.wallet.timestamp) {
    formData.isEvmWallet = authStore.wallet.isEvmWallet;
    formData.signature = authStore.wallet.signature;
    formData.timestamp = authStore.wallet.timestamp;
    formData.wallet = isConnected.value ? address.value : authStore.wallet.address;
  }

  try {
    await $api.post<ValidateMailResponse>(endpoints.validateMail, formData);

    if (!props.sendAgain) {
      if (newsletterChecked.value) {
        await subscribeToNewsletter(formData.email);
      }
      formData.signature = '';
      formData.timestamp = 0;

      /** Track new registration */
      trackEvent('registration_email_input');

      router.push({ name: 'register-email' });
    } else {
      message.success(t('form.success.sendAgainEmail'));
    }
  } catch (error) {
    formData.captcha = null;
    message.error(userFriendlyMsg(error));
    captchaReload();
  }
  captchaReset();
  loading.value = false;
}

function getMetadata() {
  return query && Object.keys(query).length ? JSON.stringify(query) : readCookie('apillon_mkt_params');
}
</script>
