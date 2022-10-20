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
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
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
import { FormLogin, LoginResponse, ProjectInterface, ProjectResponse } from '~~/types/form';

const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const { message } = createDiscreteApi(['message']);
const authStore = useAuthStore();
const dataStore = useDataStore();
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
    },
    {
      required: true,
      message: 'Please enter your email',
    },
  ],
  password: [
    {
      required: true,
      message: 'Please enter your password',
    },
  ],
};

function handleSubmit(e: MouseEvent) {
  e.preventDefault();

  loading.value = true;
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      await login();
    }
  });
  loading.value = false;
}

async function login() {
  const { data, error } = await $api.post<LoginResponse>(UserEndpoint.login, formData.value);

  if (error) {
    message.error(error.message);
    loading.value = false;
    return;
  }
  if (data) {
    authStore.setUserToken(data.data.token);
  }

  await getProjects();
}

async function getProjects() {
  const { data, error } = await $api.get<ProjectResponse>(ProjectEndpoint.project);

  if (error) {
    return;
  }

  if (data.data.total === 0) {
    router.push('/login/first');
  } else {
    dataStore.projects = data.data.items.map((project: ProjectInterface, key: number) => {
      return {
        ...project,
        value: key,
        label: project.name,
      };
    });
    router.push('/');
  }
}
</script>
