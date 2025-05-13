<template>
  <n-form ref="formRef" class="inline" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Email - hidden if email provided by props -->
    <div class="mb-8" :class="{ 'invisible absolute': email }">
      <n-form-item path="email" :show-label="false" :show-feedback="false">
        <n-input
          v-model:value="formData.email"
          :input-props="{ type: 'email' }"
          :placeholder="$t('form.placeholder.email', { afna: '@' })"
          clearable
        />
      </n-form-item>
    </div>

    <n-form-item v-if="showCaptcha" path="captcha" :show-label="false">
      <div class="block h-20 w-full">
        <Captcha @captcha-verified="onCaptchaVerified" />
      </div>
      <n-input v-model:value="formData.captcha" class="absolute hidden" />
    </n-form-item>

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
type PasswordResetForm = {
  email: string;
  captcha?: any;
  refCode?: string;
};

const props = defineProps({
  btnType: {
    type: String,
    validator: (value: string) => ['primary', 'secondary', 'link'].includes(value),
    default: 'secondary',
  },
  email: { type: String, default: '' },
});

const { t } = useI18n();
const message = useMessage();
const { showCaptcha, formCaptcha, captchaReset, captchaReload, onCaptchaVerified } = useCaptcha();

const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const formData = reactive<PasswordResetForm>({
  email: props.email,
  captcha: null,
  refCode: undefined,
});

const rules: NFormRules = {
  email: [
    {
      type: 'email',
      message: t('validation.email'),
    },
    {
      required: true,
      message: t('validation.emailRequired'),
    },
  ],
  captcha: ruleRequired(t('validation.captchaRequired')),
};

onMounted(() => {
  showCaptcha.value = true;
});

function handleSubmit(e: Event | MouseEvent | null) {
  e?.preventDefault();
  formData.captcha = formCaptcha.value;

  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || '')));
    } else {
      /** Request password change */
      await passwordChangeRequest();
    }
  });
}

async function passwordChangeRequest() {
  loading.value = true;

  try {
    const res = await $api.post<PasswordResetRequestResponse>(endpoints.passwordResetRequest, formData);

    if (res.data) {
      message.success(t('form.success.requestPasswordChange'));
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
    captchaReset();
    captchaReload();
  } finally {
    loading.value = false;
  }
}
</script>
