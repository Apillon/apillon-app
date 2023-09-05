<template>
  <n-form
    ref="formRef"
    class="w-full max-w-lg"
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

    <!--  Submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.save')" />
      <Btn
        class="mt-2"
        size="large"
        type="secondary"
        :loading="loading || loadingForm"
        @click="handleSubmit"
      >
        {{ $t('form.save') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { textMarshal } from 'text-marshal';

const message = useMessage();
const $i18n = useI18n();
const authStore = useAuthStore();
const loading = ref<boolean>(false);
const loadingForm = ref<boolean>(true);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormUserProfile>({
  name: authStore.username,
  email: authStore.email,
});

onMounted(() => {
  /** If page was reloaded, populate form data after page has been loaded */
  setTimeout(() => {
    Promise.all(Object.values(authStore.promises)).then(_ => {
      if (!formData.value.name || !formData.value.email) {
        formData.value.name = authStore.username;
        formData.value.email = authStore.email;
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
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      await updateUserProfile();
    }
  });
}
async function updateUserProfile() {
  loading.value = true;

  try {
    const res = await $api.patch<UserProfileResponse>(endpoints.me, formData.value);

    if (res.data) {
      authStore.saveUser(res.data);
      message.success($i18n.t('form.success.profile'));
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
