<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-form-item path="email" :show-label="false">
      <n-input
        v-model:value="formData.email"
        :input-props="{ type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item path="password" :show-label="false">
      <n-input
        v-model:value="formData.password"
        type="password"
        :input-props="{ type: 'password' }"
        :placeholder="$t('form.placeholder.password')"
      />
    </n-form-item>
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.login')" />
      <Btn type="primary" class="w-full mt-2" @click="handleSubmit">
        {{ $t('form.login') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NInput,
  FormInst,
  createDiscreteApi,
  FormValidationError,
} from 'naive-ui';
import { FormLogin, LoginResponse } from '~~/types/form';

const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const { message } = createDiscreteApi(['message']);
const authStore = useAuthStore();
const router = useRouter();

const formData = ref<FormLogin>({
  email: '',
  password: '',
});
const rules = {
  email: [
    {
      type: 'email',
      message: 'Email address is not valid',
      trigger: 'input',
    },
    {
      required: true,
      message: 'Please enter your email',
      trigger: 'input',
    },
  ],
  password: [
    {
      required: true,
      message: 'Please enter your password',
      trigger: 'input',
    },
  ],
};

function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      await login();
    }
  });
}
async function login() {
  loading.value = true;

  const { data, error } = await $api.post<LoginResponse>(AuthEndpoint.login, formData.value);

  if (error) {
    loading.value = false;
    return;
  }

  if (data) {
    authStore.setUserToken(data.data.token);
    router.push('/');
  }
  loading.value = false;
}
</script>
