<template>
  <n-form ref="formRef" :model="formData" :rules="rules">
    <!--  Signup email -->
    <n-form-item v-show="!sendAgain" path="email">
      <n-input
        v-model:value="formData.email"
        :input-props="{ type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
      />
    </n-form-item>

    <!-- <div class="flex justify-center align-center mb-3">
      <n-form-item path="captcha"> -->
    <vue-hcaptcha
      ref="captchaInput"
      sitekey="f5f700a0-51b2-49f3-9ba5-46c7fe146af0"
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
      <Btn v-if="sendAgain" class="mx-auto" type="primary" size="medium" @click="handleSubmit">
        {{ $t('signup.sendAgain') }}
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

const $i18n = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const captchaInput = ref<any>(null);

const formData = ref({
  email: authStore.email,
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
};

function handleSubmit(e: MouseEvent | null) {
  e?.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
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
    const res = await $api.post<ValidateMailResponse>(endpoints.validateMail, formData.value);

    if (!props.sendAgain) {
      router.push({ name: 'register-email' });
    } else {
      message.success($i18n.t('form.success.sendAgainEmail'));
    }
  } catch (error) {
    formData.value.captcha = null;
    message.error(userFriendlyMsg(error, $i18n));
  }
  loading.value = false;
}

function onCaptchaError(err) {
  console.log('error');
  console.log(err);
  loading.value = false;
}

function onCaptchaChallengeExpire(err) {
  console.log('expired challenge');
  console.log(err);
  loading.value = false;
}
function onCaptchaExpire(err) {
  console.log('expired');
  console.log(err);
  loading.value = false;
}

function onCaptchaVerify(token, eKey) {
  console.log('verified');
  // console.log(token, eKey);
  formData.value.captcha = { token, eKey };
  handleSubmit(null);
  loading.value = false;
}

function onCaptchaClose() {
  loading.value = false;
  console.log('closed');
}
</script>
