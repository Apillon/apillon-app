<template>
  <Btn v-bind="$attrs" :type="btnType" :loading="loading" @click="passwordChangeRequest">
    <slot v-if="$slots.default"></slot>
    <span v-else>{{ $t('login.resetPassword') }}</span>
  </Btn>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';
import { useI18n } from 'vue-i18n';

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

async function passwordChangeRequest() {
  loading.value = true;
  try {
    const bodyData = { email: props.email };
    const { data, error } = await $api.post<PasswordResetRequestResponse>(
      endpoints.passwordResetRequest,
      bodyData
    );

    if (error) {
      message.error(userFriendlyMsg($i18n, error));
      loading.value = false;
      return;
    }
    if (data) {
      message.success($i18n.t('form.success.requestPasswordChange'));
    }
    loading.value = false;
  } catch (error) {
    message.error(userFriendlyMsg($i18n, error));
    loading.value = false;
  }
}
</script>
