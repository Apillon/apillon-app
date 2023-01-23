<template>
  <n-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    :disabled="!settingsStore.isUserOwner()"
    @submit.prevent="handleSubmit"
  >
    <!--  Service name -->
    <n-form-item
      path="name"
      class="mb-4 border-b-1 border-grey/40"
      :label="$t('form.label.apiKeyName')"
      :label-props="{ for: 'name' }"
    >
      <n-input
        v-model:value="formData.name"
        :input-props="{ id: 'name' }"
        :placeholder="$t('form.placeholder.apiKeyName')"
      />
    </n-form-item>

    <!--  API key type -->
    <n-form-item
      path="apiKeyTypes"
      class="mb-4 border-b-1 border-grey/40"
      :label="$t('form.label.apiKeyType')"
    >
      <n-radio-group v-model:value="formData.apiKeyType" name="radiogroup">
        <n-space>
          <n-radio
            v-for="(type, key) in apiKeyTypes"
            :key="key"
            :value="type.value"
            :label="type.label"
          />
        </n-space>
      </n-radio-group>
    </n-form-item>

    <!-- Permissions per service -->
    <n-collapse
      class="collapse-permissions"
      :default-expanded-names="expandedPermissions"
      @item-header-click="handleItemHeaderClick"
    >
      <n-collapse-item
        v-for="(service, key) in formData.roles"
        :key="key"
        :title="service.name"
        :name="service.name"
      >
        <template #arrow>
          <span :class="`icon-${service.serviceType}`"></span>
        </template>
        <template #header-extra>
          <n-switch
            v-model:value="service.enabled"
            @update:value="service.enabled = !service.enabled"
          />
        </template>

        <n-grid :cols="2">
          <n-form-item-gi
            v-for="permissions in service.permissions"
            :key="permissions.key"
            :path="`${service.name}.${permissions.name}`"
            :show-label="false"
            :show-feedback="false"
          >
            <n-checkbox
              v-model:checked="permissions.value"
              size="medium"
              :label="permissions.label"
            />
          </n-form-item-gi>
        </n-grid>
      </n-collapse-item>
    </n-collapse>

    <!--  Submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.generate')" />
      <Btn
        type="secondary"
        class="w-full mt-8"
        :loading="loading"
        :disabled="!settingsStore.isUserOwner()"
        @click="handleSubmit"
      >
        {{ $t('form.generate') }}
      </Btn>
    </n-form-item>
  </n-form>
  <!-- Modal - API key detals -->
  <n-modal
    v-model:show="showModalApiKeyDetails"
    :mask-closable="false"
    preset="dialog"
    :title="$t('dashboard.apiKey.details')"
    :positive-text="$t('dashboard.apiKey.secredSaved')"
    @positive-click="emit('close')"
  >
    <ApiKeyDetails v-bind="createdApiKey"></ApiKeyDetails>
  </n-modal>
</template>

<script lang="ts" setup>
import { useMessage, CollapseProps } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();

const formRef = ref<NFormInst | null>(null);
const loading = ref<boolean>(false);
const showModalApiKeyDetails = ref<boolean>(false);
const createdApiKey = ref<ApiKeyCreatedInterface>({} as ApiKeyCreatedInterface);
const emit = defineEmits(['close']);

/**
 * Form data
 */
const roles = computed(() => {
  return Object.entries(dataStore.services)
    .map(([type, services]) => {
      return services.map(service => {
        return {
          enabled: true,
          name: service.name,
          serviceType: type,
          service_uuid: service.service_uuid,
          permissions: [
            {
              key: ApiKeyRole.READ,
              value: false,
              name: 'read',
              label: $i18n.t('dashboard.permissions.read'),
            },
            {
              key: ApiKeyRole.EXECUTE,
              value: false,
              name: 'execute',
              label: $i18n.t('dashboard.permissions.execute'),
            },
            {
              key: ApiKeyRole.WRITE,
              value: false,
              name: 'write',
              label: $i18n.t('dashboard.permissions.write'),
            },
          ],
        };
      });
    })
    .flat();
});

const apiKeyTypes: Array<{ value: boolean; label: string }> = [
  {
    value: true,
    label: $i18n.t('form.apiKeyTypes.test'),
  },
  {
    value: false,
    label: $i18n.t('form.apiKeyTypes.live'),
  },
];

const formData = ref<ApiKeyForm>({
  name: '',
  apiKeyType: true,
  roles: roles.value,
});

const rules: NFormRules = {
  name: [
    {
      required: true,
      message: $i18n.t('validation.apiKeyName'),
    },
  ],
};

const expandedPermissions = computed(() => {
  return roles.value.map(item => item.name);
});

const handleItemHeaderClick: CollapseProps['onItemHeaderClick'] = ({ name, expanded }) => {
  /* If service was collapsed, than deactivate all permissions  */
  const service = formData.value.roles.find(item => item.name === name);
  if (service) {
    service.enabled = !service.enabled;

    if (!expanded) {
      service.permissions.forEach(permission => {
        permission.value = false;
      });
    }
  }
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else {
      await createApiKey();
    }
  });
}
async function createApiKey() {
  loading.value = true;

  try {
    const projectUuid = dataStore.currentProject?.project_uuid;
    const bodyData = {
      project_uuid: projectUuid,
      name: formData.value.name,
      testNetwork: formData.value.apiKeyType,
      roles: formData.value.roles
        .map(role => {
          return role.permissions.map(permission => {
            if (permission.value) {
              return {
                role_id: permission.key,
                project_uuid: projectUuid,
                service_uuid: role.service_uuid,
              };
            }
          });
        })
        .flat()
        .filter(item => item !== undefined),
    };
    const res = await $api.post<ApiKeyCreatedResponse>(endpoints.apiKey, bodyData);

    if (res.data) {
      createdApiKey.value = res.data;
      showModalApiKeyDetails.value = true;

      /** Refresh table API key */
      settingsStore.fetchApiKeys();
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
