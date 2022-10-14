<template>
  <n-form ref="formRef" :model="formData" :rules="rules">
    <n-form-item path="email">
      <n-input
        v-model:value="formData.email"
        :input-props="{ type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
      />
    </n-form-item>
    <n-form-item :show-label="false">
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.continue') }}
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

const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const { message } = createDiscreteApi(['message']);
const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  email: '',
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
};

function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      // register();
      // Save email
      authStore.saveEmail(formData.value.email);

      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        router.push('/signup/email');
      }, 1000);
    }
  });
}
async function register() {
  loading.value = true;
  const res = await $api.post(UsersEndpoint.register, formData);

  if (res.error) {
    loading.value = false;
    return;
  }

  if (res) {
    // router.push('/auth/validate');
  }
  loading.value = false;
}
</script>
