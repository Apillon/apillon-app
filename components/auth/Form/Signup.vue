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
import { FormInst, createDiscreteApi, FormValidationError, FormRules } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { ValidateMailResponse } from '~~/types/data';

const props = defineProps({
  sendAgain: { type: Boolean, default: false },
});

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const { message } = createDiscreteApi(['message']);

const loading = ref(false);
const formRef = ref<FormInst | null>(null);

const formData = ref({
  email: authStore.email,
});
const rules: FormRules = {
  email: [
    {
      type: 'email',
      message: t('validation.email'),
    },
    {
      required: true,
      message: t('validation.emailRequired'),
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

    if (error) {
      message.error(error.message);
      loading.value = false;
      return;
    }

    loading.value = false;
    if (!data.data.success) {
      // TODO: error
      message.error('ERROR');
    } else if (!props.sendAgain) {
      router.push('/signup/email');
    }
  } catch (error) {
    message.error(t('error.API'));
    loading.value = false;
  }
}
</script>
