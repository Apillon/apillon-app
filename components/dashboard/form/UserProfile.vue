<template>
  <n-form
    ref="formRef"
    class="max-w-lg"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <!--  Username -->
    <n-form-item
      path="username"
      :label="$t('form.label.username')"
      :label-props="{ for: 'username' }"
    >
      <n-input
        v-model:value="formData.username"
        :input-props="{ id: 'username' }"
        :placeholder="$t('form.placeholder.username')"
      />
    </n-form-item>

    <!--  Login email -->
    <n-form-item path="email" :label="$t('form.label.email')" :label-props="{ for: 'email' }">
      <n-input
        v-model:value="formData.email"
        :input-props="{ id: 'email', type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
      />
    </n-form-item>

    <!--  Phone -->
    <n-form-item path="phone" :label="$t('form.label.phone')" :label-props="{ for: 'phone' }">
      <n-input
        v-model:value="formData.phone"
        :input-props="{ id: 'phone' }"
        :placeholder="$t('form.placeholder.phone')"
      />
    </n-form-item>

    <!--  Submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.save')" />
      <Btn type="primary" class="mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.save') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import {
  FormInst,
  createDiscreteApi,
  FormValidationError,
  FormRules,
  FormItemRule,
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { FormUserProfile, UserProfileResponse } from '~~/types/auth';

const { t } = useI18n();
const authStore = useAuthStore();
const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const { message } = createDiscreteApi(['message']);

const formData = ref<FormUserProfile>({
  username: authStore.username,
  email: authStore.email,
  phone: authStore.phone,
});

const rules: FormRules = {
  username: [],
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
  phone: [
    {
      validator: validatePhone,
      message: 'Phone validation error',
      trigger: 'input',
    },
  ],
};

// Custom validations
function validatePhone(_: FormItemRule, value: string): boolean {
  // const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  return !value || regex.test(value);
}

// Submit
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      await updateUserProfile();
    }
  });
}
async function updateUserProfile() {
  loading.value = true;

  try {
    const { data, error } = await $api.post<UserProfileResponse>(
      UserEndpoint.profile,
      formData.value
    );

    if (error) {
      message.error(error.message);
      loading.value = false;
      return;
    }

    // TODO
    if (data.data) {
      console.log(data);
    }
    loading.value = false;
  } catch (error) {
    message.error(t('error.API'));
    loading.value = false;
  }
}
</script>
