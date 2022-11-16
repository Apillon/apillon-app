<template>
  <n-form ref="formRef" :model="formData" :rules="rules">
    <!--  Register password -->
    <n-form-item
      path="password"
      :label="$t('form.label.password')"
      :label-props="{ for: 'password' }"
    >
      <n-input
        v-model:value="formData.password"
        type="password"
        show-password-on="mousedown"
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
        show-password-on="mousedown"
        :input-props="{ id: 'confirmPassword', autocomplete: 'off' }"
        :placeholder="$t('form.placeholder.reenterPassword')"
      />
    </n-form-item>

    <!--  Register submit -->
    <n-form-item>
      <input type="submit" class="hidden" :value="$t('form.login')" />
      <Btn type="primary" size="large" class="mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import {
  createDiscreteApi,
  FormInst,
  FormItemInst,
  FormItemRule,
  FormRules,
  FormValidationError,
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { FormRegister, RegisterResponse } from '~~/types/data';
import { useDataStore } from '~~/stores/data';

const $i18n = useI18n();
const router = useRouter();
const { query } = useRoute();
const authStore = useAuthStore();
const dataStore = useDataStore();
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);

onMounted(() => {
  if (!query.token || query.token.length < 100) {
    router.push({ name: 'register' });
  }
});

const formData = ref<FormRegister>({
  password: null,
  reenteredPassword: null,
});

const rules: FormRules = {
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
      validator: validatePasswordStartWith,
      message: $i18n.t('validation.passwordReenterSame'),
      trigger: 'input',
    },
    {
      validator: validatePasswordSame,
      message: $i18n.t('validation.passwordReenterSame'),
      trigger: ['blur', 'password-input'],
    },
  ],
};
// Custom validations
function validatePasswordStartWith(_: FormItemRule, value: string): boolean {
  return (
    !!formData.value.password &&
    formData.value.password.startsWith(value) &&
    formData.value.password.length >= value.length
  );
}
function validatePasswordSame(_: FormItemRule, value: string): boolean {
  return value === formData.value.password;
}

function handlePasswordInput() {
  if (formData.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' });
  }
}

// Submit
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      await register();
    }
  });
}
async function register() {
  loading.value = true;

  try {
    const { data, error } = await $api.post<RegisterResponse>(endpoints.register, {
      ...formData.value,
      token: query.token,
    });

    if (error) {
      message.error(userFriendlyMsg($i18n, error));
      loading.value = false;
      return;
    }

    authStore.setUserToken(data.data.token);

    /** Fetch projects, if user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
    await dataStore.getProjects(true);
    loading.value = false;
  } catch (error) {
    message.error(userFriendlyMsg($i18n, error));
    loading.value = false;
  }
}
</script>
