<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Login email -->
    <n-form-item path="email" :show-label="false">
      <n-input
        v-model:value="formData.email"
        :input-props="{ type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
        clearable
        @keydown.enter.prevent
      />
    </n-form-item>

    <!--  Login password -->
    <n-form-item path="password" :show-label="false">
      <n-input
        v-model:value="formData.password"
        type="password"
        show-password-on="mousedown"
        :input-props="{ autocomplete: 'off' }"
        :placeholder="$t('form.placeholder.password')"
        clearable
      />
    </n-form-item>

    <!--  Login submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.login')" />
      <Btn type="primary" size="large" class="mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.login') }}
      </Btn>
    </n-form-item>
  </n-form>
  <div class="min-h-[30px] text-center">
    <div>
      <span class="text-sm text-body">{{ $t('auth.login.forgotPassword') }} </span>&nbsp;
      <FormPasswordResetRequest :email="formData.email" btn-type="link" size="tiny" quaternary />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';

const $i18n = useI18n();
const authStore = useAuthStore();
const dataStore = useDataStore();
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormLogin>({
  email: authStore.email,
  password: '',
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
  password: [
    {
      required: true,
      message: $i18n.t('validation.passwordRequired'),
    },
  ],
};

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();

  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      /** Login with mail and password */
      await login();
    }
  });
}

async function login() {
  loading.value = true;
  try {
    // Logout first - delete LS and store if there is any data
    authStore.logout();
    dataStore.resetCurrentProject();

    const res = await $api.post<LoginResponse>(endpoints.login, formData.value);

    authStore.setUserToken(res.data.token);
    authStore.changeUser(res.data);

    /** Fetch projects, if user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
    await dataStore.fetchProjects(true);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
