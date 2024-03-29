<template>
  <n-form
    v-if="!isWalletRegister"
    ref="formRef"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <!--  Register password -->
    <n-form-item
      path="password"
      :label="$t('form.label.password')"
      :label-props="{ for: 'password' }"
    >
      <n-input
        v-model:value="formData.password"
        type="password"
        show-password-on="click"
        :input-props="{ id: 'password', autocomplete: 'off' }"
        :placeholder="$t('form.placeholder.complexPassword')"
        @input="handlePasswordInput"
        @keydown.enter.prevent
      />
    </n-form-item>

    <!--  Register reenter password -->
    <n-form-item
      ref="rPasswordFormItemRef"
      path="reenteredPassword"
      :label="$t('form.label.confirmPassword')"
      :label-props="{ for: 'confirmPassword' }"
    >
      <n-input
        v-model:value="formData.reenteredPassword"
        :disabled="!formData.password"
        type="password"
        show-password-on="click"
        :input-props="{ id: 'confirmPassword', autocomplete: 'off' }"
        :placeholder="$t('form.placeholder.reenterPassword')"
      />
    </n-form-item>

    <!--  Register submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.proceed')" />
      <Btn type="primary" size="large" class="mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormItemInst, FormItemRule } from 'naive-ui';

type FormRegister = {
  password: string | null;
  reenteredPassword: string | null;
};

const props = defineProps({
  resetPassword: { type: Boolean, default: false },
  token: { type: String, default: '' },
});
const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const { query } = useRoute();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);

const isWalletRegister = computed(() => query.walletLogin === 'true');

const formData = ref<FormRegister>({
  password: null,
  reenteredPassword: null,
});

const rules: NFormRules = {
  password: [
    {
      required: true,
      message: $i18n.t('validation.passwordRequired'),
    },
    {
      min: 12,
      message: $i18n.t('validation.passwordMinLength'),
    },
  ],
  reenteredPassword: [
    {
      required: true,
      message: $i18n.t('validation.passwordReenterRequired'),
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordSame,
      message: $i18n.t('validation.passwordReenterSame'),
      trigger: ['blur', 'password-input'],
    },
  ],
};

onMounted(() => {
  if (isWalletRegister.value) {
    register();
  }
});

// Custom validations
function validatePasswordSame(_: FormItemRule, value: string): boolean {
  return value === formData.value.password;
}

function handlePasswordInput() {
  if (formData.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' });
  }
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else if (props.resetPassword) {
      await submitResetPassword();
    } else {
      await register();
    }
  });
}

/** Register (create new user) */
async function register() {
  loading.value = true;
  dataStore.resetCurrentProject();

  try {
    const res = await $api.post<RegisterResponse>(endpoints.register, {
      password: formData.value.password,
      token: props.token || query.token || authStore.jwt,
      refCode: query.REF,
      metadata: getMetadata(),
    });

    authStore.saveUser(res.data);

    /** Track Registration created */
    trackEvent('registration_done');

    /** Fetch projects, if user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
    dataStore.project.items = await dataStore.fetchProjects(true);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

/** Reset password (on page reset-password or in dashboard) */
async function submitResetPassword() {
  loading.value = true;

  try {
    const res = await $api.post<PasswordResetResponse>(endpoints.passwordReset, {
      password: formData.value.password,
      token: props.token || query.token || authStore.jwt,
    });

    if (res.data) {
      message.success($i18n.t('auth.login.passwordReplaced'));
      emit('submitSuccess');
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

function getMetadata() {
  return query && Object.keys(query).length
    ? JSON.stringify(query)
    : readCookie('apillon_mkt_params');
}
</script>
