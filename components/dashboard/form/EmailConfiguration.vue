<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-collapse
      class="collapse-emailConfiguration"
      :expanded-names="['email', 'did']"
      @item-header-click="handleItemHeaderClick"
    >
      <!-- Email -->
      <n-collapse-item :title="$t('form.emailConfiguration.email')" name="email">
        <template #arrow>
          <span class="icon-mail"></span>
        </template>
        <template #header-extra>
          <n-switch v-model:value="formData.email" />
        </template>
        <p class="body-sm text-grey max-w-[350px]">{{ $t('form.emailConfiguration.emailText') }}</p>
      </n-collapse-item>

      <!-- DID Vault -->
      <n-collapse-item :title="$t('form.emailConfiguration.did')" name="did">
        <template #arrow>
          <span class="icon-vault"></span>
        </template>
        <template #header-extra>
          <n-switch v-model:value="formData.did" />
        </template>
        <p class="body-sm text-grey max-w-[350px]">{{ $t('form.emailConfiguration.didText') }}</p>
      </n-collapse-item>
    </n-collapse>

    <!--  Submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.saveExit')" />
      <Btn type="secondary" size="large" class="mt-8" :loading="loading" @click="handleSubmit">
        {{ $t('form.saveExit') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { CollapseProps, useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const message = useMessage();

/**
 * Form data
 */
const formData = ref<FormEmailConfiguration>({
  email: false,
  did: false,
});

const rules: NFormRules = {};

/**
 * Change form data on Collapse header click
 */
const handleItemHeaderClick: CollapseProps['onItemHeaderClick'] = ({ name, event }) => {
  const targetClass = event?.target?.className;
  if (!targetClass.includes('n-switch')) {
    formData.value[name] = !formData.value[name];
  }
};

// Submit
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message)));
    } else {
      await generateApiKey();
    }
  });
}
async function generateApiKey() {
  loading.value = true;

  try {
    const { data, error } = await $api.post<EmailConfigurationResponse>(
      endpoints.apiKey,
      formData.value
    );

    if (error) {
      message.error(userFriendlyMsg($i18n, error));
      loading.value = false;
      return;
    }

    // TODO
    if (data.data) {
      console.log(data);
    }
    loading.value = false;
  } catch (error) {
    message.error(userFriendlyMsg($i18n, error));
    loading.value = false;
  }
}
</script>
