<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-collapse
      class="collapse-permissions"
      :default-expanded-names="expandedServices"
      @item-header-click="handleItemHeaderClick"
    >
      <n-collapse-item
        v-for="(pesmissions, serviceName) in formData"
        :key="serviceName"
        :title="$t(`permissions.${serviceName}.name`)"
        :name="serviceName"
      >
        <template #arrow>
          <span :class="`icon-${serviceName}`"></span>
        </template>
        <template #header-extra>
          <n-switch v-model:value="enabledService[serviceName]" />
        </template>

        <n-grid :cols="2">
          <n-form-item-gi
            v-for="(pesmission, pesmissionName) in pesmissions"
            :key="pesmissionName"
            :path="`${serviceName}.${pesmissionName}`"
            :show-label="false"
            :show-feedback="false"
          >
            <n-checkbox
              v-model:checked="formData[serviceName][pesmissionName]"
              size="medium"
              :label="$t(`permissions.${serviceName}.${pesmissionName}`)"
            />
          </n-form-item-gi>
        </n-grid>
      </n-collapse-item>
    </n-collapse>

    <!--  Submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.generate')" />
      <Btn type="secondary" class="w-full mt-8" :loading="loading" @click="handleSubmit">
        {{ $t('form.generate') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { useMessage, CollapseProps } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const message = useMessage();

/**
 *  Collapse - enabled services
 */
const enabledService = ref<Record<string, boolean>>({
  authentication: true,
  storage: true,
  computing: false,
});

const expandedServices = computed(() => {
  return Object.keys(enabledService.value).filter(item => enabledService.value[item] === true);
});

const handleItemHeaderClick: CollapseProps['onItemHeaderClick'] = ({ name, expanded }) => {
  if (name in enabledService.value) {
    enabledService.value[name] = expanded;

    /* If service was collapsed, than deactivate all permissions  */
    if (!expanded) {
      Object.keys(formData.value[name]).forEach(permission => {
        formData.value[name][permission] = false;
      });
    }
  } else {
    console.error('Missing enabledService');
  }
};

/**
 * Form data
 */
const formData = ref<FormGenerateApiKey>({
  authentication: { read: null, xy: null, write: null, zzz: null },
  storage: { read: null, write: null, xy: null, zzz: null },
  computing: { read: null, write: null, xy: null },
});

const rules: NFormRules = {};

// Submit
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else {
      await generateApiKey();
    }
  });
}
async function generateApiKey() {
  loading.value = true;

  try {
    const res = await $api.post<GenerateApiKeyResponse>(endpoints.apiKey, formData.value);

    // TODO
    if (res.data) {
      console.log(res.data);
    }
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loading.value = false;
}
</script>
