<template>
  <n-form
    ref="formRef"
    class="inline"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <!--  Email - hidden if email provided by props -->
    <div class="mb-8" :class="{ 'absolute invisible': email }">
      <n-form-item path="email" :show-label="false" :show-feedback="false">
        <n-input
          v-model:value="formData.email"
          :input-props="{ type: 'email' }"
          :placeholder="$t('form.placeholder.email', { afna: '@' })"
          clearable
        />
      </n-form-item>
    </div>

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

    <!--  Btn submit -->
    <n-form-item :show-label="false">
      <Btn
        v-bind="$attrs"
        :class="{ 'w-full': btnType === 'primary' }"
        :type="btnType"
        :loading="loading"
        @click="handleSubmit"
      >
        <slot v-if="$slots.default"></slot>
        <span v-else>{{ $t('auth.login.resetPassword') }}</span>
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

const props = defineProps({
  btnType: {
    type: String,
    validator: (value: string) => ['primary', 'secondary', 'link'].includes(value),
    default: 'secondary',
  },
  email: { type: String, default: '' },
});

const $i18n = useI18n();
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const formData = ref<PasswordResetForm>({ email: props.email, captcha: null, refCode: undefined });
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

const config = useRuntimeConfig();
const captchaKey = ref<string>(config.public.captchaKey);
const captchaInput = ref<any>(null);

function handleSubmit(e: Event | MouseEvent | null) {
  e?.preventDefault();

  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || '')));
    } else if (!formData.value.captcha) {
      loading.value = true;
      captchaInput.value.execute();
    } else {
      /** Request password change */
      await passwordChangeRequest();
    }
  });
}

async function passwordChangeRequest() {
  loading.value = true;
  try {
    const res = await $api.post<PasswordResetRequestResponse>(
      endpoints.passwordResetRequest,
      formData.value
    );

    if (res.data) {
      message.success($i18n.t('form.success.requestPasswordChange'));
    }
  } catch (error) {
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
