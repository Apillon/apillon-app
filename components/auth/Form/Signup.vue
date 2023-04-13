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

    <!-- <div class="flex justify-center align-center mb-3">
      <n-form-item path="captcha"> -->
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
    <!-- </n-form-item>
    </div> -->

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
import { createDiscreteApi } from 'naive-ui';
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

const props = defineProps({
  sendAgain: { type: Boolean, default: false },
});

const $route = useRoute();

const $i18n = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const config = useRuntimeConfig();
const captchaKey = ref<string>(config.public.captchaKey);
const captchaInput = ref<any>(null);

const refCode = computed(() => $route.query.REF);

const formData = ref({
  email: authStore.email,
  captcha: null as any,
  refCode,
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
    } else if (!formData.value.captcha && config.public.ENV !== AppEnv.LOCAL) {
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

function onCaptchaError(err) {
  console.warn(err);
  loading.value = false;
}

function onCaptchaChallengeExpire(err) {
  console.warn(err);
  loading.value = false;
}
function onCaptchaExpire(err) {
  console.warn(err);
  loading.value = false;
}

function onCaptchaVerify(token, eKey) {
  formData.value.captcha = { token, eKey };
  handleSubmit(null);
  loading.value = false;
}

function onCaptchaClose() {
  loading.value = false;
}
</script>
