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
      <Btn v-if="sendAgain" type="primary" size="large" @click="handleSubmit">
        <span class="icon-apillon-icon"></span>
        {{ $t('signup.sendAgain') }}
      </Btn>
      <Btn v-else type="primary" size="large" class="mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.continue') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { FormInst, createDiscreteApi, FormValidationError, FormRules } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~~/stores/auth';
import { ValidateMailResponse } from '~~/types/auth';

const props = defineProps({
  sendAgain: { type: Boolean, default: false },
});

const $i18n = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const loading = ref(false);
const formRef = ref<FormInst | null>(null);

const formData = ref({
  email: authStore.email,
});
const rules: FormRules = {
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

  try {
    const { data, error } = await $api.post<ValidateMailResponse>(
      endpoints.validateMail,
      formData.value
    );

    if (error || !data.data.success) {
      message.error(userFriendlyMsg($i18n, error));
      loading.value = false;
      return;
    }
    if (!props.sendAgain) {
      router.push({ name: 'register-email' });
    } else {
      message.success($i18n.t('form.success.sendAgainEmail'));
    }
    loading.value = false;
  } catch (error) {
    message.error(userFriendlyMsg($i18n, error));
    loading.value = false;
  }
}
</script>
