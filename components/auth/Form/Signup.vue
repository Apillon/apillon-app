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

    <!--  Signup submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.login')" />
      <Btn v-if="sendAgain" type="primary" class="w-full" @click="handleSubmit">
        <span class="icon-apillon-icon"></span>
        {{ $t('signup.sendAgain') }}
      </Btn>
      <Btn v-else type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
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

const props = defineProps({
  sendAgain: { type: Boolean, default: false },
});

const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const { message } = createDiscreteApi(['message']);
const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  email: authStore.email,
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
};

function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      // Email validation
      authStore.saveEmail(formData.value.email);
      await signupWithEmail();
    }
  });
}
async function signupWithEmail() {
  loading.value = true;
  const { data, error } = await $api.post(UserEndpoint.validateMail, formData.value);

  if (error) {
    message.error(error.message);
    loading.value = false;
    return;
  }

  if (data && !props.sendAgain) {
    router.push('/signup/email');
  }
  loading.value = false;
}
</script>
