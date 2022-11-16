<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Login email -->
    <n-form-item path="email" :show-label="false">
      <n-input
        v-model:value="formData.email"
        :input-props="{ type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
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
</template>

<script lang="ts" setup>
import { createDiscreteApi, FormInst, FormRules, FormValidationError } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { FormLogin, LoginResponse } from '~~/types/data';
import { useAuthStore } from '~~/stores/auth';
import { useDataStore } from '~~/stores/data';

const $i18n = useI18n();
const authStore = useAuthStore();
const dataStore = useDataStore();
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const loading = ref(false);
const formRef = ref<FormInst | null>(null);

const formData = ref<FormLogin>({
  email: authStore.email,
  password: '',
});
const rules: FormRules = {
  mail: [
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

function handleSubmit(e: MouseEvent) {
  e.preventDefault();

  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      /** Login with mail and password */
      await login();
    }
  });
}

async function login() {
  loading.value = true;
  try {
    const { data, error } = await $api.post<LoginResponse>(endpoints.login, formData.value);

    if (error) {
      message.error(userFriendlyMsg($i18n, error));
      loading.value = false;
      return;
    }
    if (data) {
      authStore.setUserToken(data.data.token);
    }

    /** Fetch projects, if user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
    await dataStore.getProjects(true);
    loading.value = false;
  } catch (error) {
    message.error(userFriendlyMsg($i18n, error));
    loading.value = false;
  }
}
</script>
