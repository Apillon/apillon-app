<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-grid :cols="12" :x-gap="12">
      <!--  Email -->
      <n-form-item-gi
        :span="colEmailWidth"
        path="email"
        :label="$t('form.label.inviteByEmail')"
        :label-props="{ for: 'email' }"
      >
        <n-input
          v-model:value="formData.email"
          :input-props="{ id: 'email', type: 'email' }"
          :placeholder="$t('form.placeholder.inviteByEmail')"
        />
      </n-form-item-gi>

      <!--  Role -->
      <n-form-item-gi
        :span="colRoleWidth"
        path="role_id"
        :label="$t('form.label.role')"
        :label-props="{ for: 'role' }"
      >
        <select-options
          v-model:value="formData.role_id"
          :options="userRoles"
          :placeholder="$t('form.placeholder.role')"
          size="large"
          filterable
        />
      </n-form-item-gi>

      <!--  Submit -->
      <n-form-item-gi :span="colSubmitWidth">
        <input type="submit" class="hidden" :value="$t('form.sendInvite')" />
        <Btn type="primary" class="w-full px-2" :loading="loading" @click="handleSubmit">
          {{ $t('form.sendInvite') }}
        </Btn>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const userRoles: Array<NSelectOption> = CreateUserRoles($i18n);

/** Col widths */
const { width } = useWindowSize();
const colEmailWidth = computed(() => {
  return width.value >= 768 ? 6 : 12;
});
const colRoleWidth = computed(() => {
  return width.value >= 768 ? 4 : 6;
});
const colSubmitWidth = computed(() => {
  return width.value >= 768 ? 2 : 6;
});

const formData = ref<FormUserInvite>({
  email: '',
  role_id: null,
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
  role_id: [
    {
      required: true,
      message: $i18n.t('validation.roleRequired'),
    },
    {
      validator(_: NFormItemRule, value: string) {
        return UserRoleIds.includes(parseInt(value));
      },
      message: $i18n.t('validation.role'),
    },
  ],
};

// Submit
function handleSubmit(e: MouseEvent | Event) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else {
      await inviteUser();
    }
  });
}
async function inviteUser() {
  loading.value = true;

  try {
    await $api.post<InviteUserResponse>(
      endpoints.projectInviteUser(dataStore.currentProjectId),
      formData.value
    );

    /** Show success msg and refresh users */
    message.success($i18n.t('form.success.created.userInvite'));
    await settingsStore.fetchProjectUsers($i18n);
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loading.value = false;
}
</script>
