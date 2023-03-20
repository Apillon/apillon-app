<template>
  <n-form
    ref="formRef"
    class="inline"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <!--  Btn submit -->
    <Btn v-bind="$attrs" :type="btnType" :loading="loading" @click="handleSubmit">
      <slot v-if="$slots.default"></slot>
      <span v-else>{{ $t('auth.login.resetPassword') }}</span>
    </Btn>

    <!--  Email - hidden -->
    <div class="absolute invisible">
      <n-form-item path="email" :show-label="false" :show-feedback="false">
        <n-input v-model:value="formData.email" :input-props="{ type: 'email' }" readonly />
      </n-form-item>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';

const props = defineProps({
  btnType: {
    type: String,
    validator: (value: string) => ['primary', 'secondary', 'link'].includes(value),
    default: 'secondary',
  },
  email: { type: String, required: true },
});

const $i18n = useI18n();
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = computed<PasswordResetForm>(() => {
  return { email: props.email };
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
};

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();

  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || '')));
    } else {
      /** Request password change */
      await passwordChangeRequest();
    }
  });
}

async function passwordChangeRequest() {
  loading.value = true;
  try {
    const res = await $api.post<PasswordResetRequestResponse>(
      endpoints.passwordResetRequest,
      formData.value
    );

    if (res.data) {
      message.success($i18n.t('form.success.requestPasswordChange'));
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
