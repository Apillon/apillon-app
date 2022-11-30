<template>
  <n-form
    ref="formRef"
    class="max-w-lg"
    :model="formData"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <!--  Username -->
    <n-form-item path="name" :label="$t('form.label.username')" :label-props="{ for: 'username' }">
      <n-input
        v-model:value="formData.name"
        :input-props="{ id: 'username' }"
        :placeholder="$t('form.placeholder.username')"
        :loading="loadingForm"
      />
    </n-form-item>

    <!--  Email -->
    <n-form-item path="email" :label="$t('form.label.email')" :label-props="{ for: 'email' }">
      <n-input
        v-model:value="formData.email"
        :input-props="{ id: 'email', type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
        :readonly="true"
        :loading="loadingForm"
      />
    </n-form-item>

    <!--  Phone -->
    <n-form-item path="phone" :label="$t('form.label.phone')" :label-props="{ for: 'phone' }">
      <n-input
        v-model:value="formData.phone"
        :input-props="{ id: 'phone' }"
        :placeholder="$t('form.placeholder.phone')"
        :loading="loadingForm"
      />
    </n-form-item>

    <!--  Submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.save')" />
      <Btn type="primary" class="mt-2" :loading="loading || loadingForm" @click="handleSubmit">
        {{ $t('form.save') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const message = useMessage();
const $i18n = useI18n();
const authStore = useAuthStore();
const loading = ref<boolean>(false);
const loadingForm = ref<boolean>(true);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormUserProfile>({
  name: authStore.username,
  email: authStore.email,
  phone: authStore.phone,
});

onMounted(() => {
  /** If page was reloaded, populate form data after page has been loaded */
  setTimeout(() => {
    Promise.all(Object.values(authStore.promises)).then(_ => {
      if (!formData.value.name || !formData.value.email) {
        formData.value.name = authStore.username;
        formData.value.email = authStore.email;
        formData.value.phone = authStore.phone;
      }
      loadingForm.value = false;
    });
  }, 500);
});

const rules: NFormRules = {
  name: [],
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
  phone: [
    {
      validator: validatePhone,
      message: $i18n.t('validation.phone'),
      trigger: 'input',
    },
  ],
};

// Custom validations
function validatePhone(_: NFormItemRule, value: string): boolean {
  // const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  return !value || regex.test(value);
}

// Submit
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
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
    const { data, error } = await $api.patch<UserProfileResponse>(endpoints.me, formData.value);

    if (error) {
      message.error(userFriendlyMsg($i18n, error));
      loading.value = false;
      return;
    }

    if (data.data) {
      authStore.changeUser(data.data);
      message.success($i18n.t('form.success.profile'));
    }
    loading.value = false;
  } catch (error) {
    message.error(userFriendlyMsg($i18n, error));
    loading.value = false;
  }
}
</script>
