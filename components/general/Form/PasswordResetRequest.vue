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
    const res = await $api.post<PasswordResetRequestResponse>(endpoints.passwordResetRequest, {
      email: props.email,
    });

    if (res.data) {
      message.success($i18n.t('form.success.requestPasswordChange'));
    }
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loading.value = false;
}
</script>
