<template>
  <n-form
    v-if="!loading"
    ref="formRef"
    :model="formData"
    :rules="rules"
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
        :disabled="true"
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
            :disabled="true"
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
            :key="service.enabled ? 1 : 0"
            v-model:value="service.enabled"
            @update:value="service.enabled = !service.enabled"
          />
        </template>

        <n-grid :cols="2">
          <n-form-item-gi
            v-for="permission in service.permissions"
            :key="permission.key"
            :path="`${service.name}.${permission.name}`"
            :show-label="false"
            :show-feedback="false"
          >
            <n-checkbox
              v-model:checked="permission.value"
              size="medium"
              :label="permission.label"
              @update:checked="
                updatePermission(service.service_uuid, permission.key, permission.value)
              "
            />
          </n-form-item-gi>
        </n-grid>
      </n-collapse-item>
    </n-collapse>
  </n-form>
  <Spinner v-else />
</template>

<script lang="ts" setup>
import { useMessage, CollapseProps } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  id: { type: Number, required: true },
});

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const emit = defineEmits(['submitSuccess']);

const formRef = ref<NFormInst | null>(null);
const loading = ref<boolean>(true);
const loadingForm = ref<boolean>(false);
const loadingRoles = ref<boolean>(false);
const apiKey: ApiKeyInterface = settingsStore.getApiKeyById(props.id);
const apiKeyRoles = ref<Array<ApiKeyRoleInterface>>([]);

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
              value: isPermissionEnabled(service.service_uuid, ApiKeyRole.READ),
              name: 'read',
              label: $i18n.t('dashboard.permissions.read'),
            },
            {
              key: ApiKeyRole.EXECUTE,
              value: isPermissionEnabled(service.service_uuid, ApiKeyRole.EXECUTE),
              name: 'execute',
              label: $i18n.t('dashboard.permissions.execute'),
            },
            {
              key: ApiKeyRole.WRITE,
              value: isPermissionEnabled(service.service_uuid, ApiKeyRole.WRITE),
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
  name: apiKey.name,
  apiKeyType: apiKey.testNetwork === 1,
  roles: [],
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

    // if (!expanded) {
    //   service.permissions.forEach(permission => {
    //     permission.value = false;
    //   });
    // }
  }
};

/** Load roles and show permissions */
onMounted(async () => {
  await getApiKeyRoles();

  formData.value.roles = roles.value;
  loading.value = false;
});

/** Get API key's roles */
async function getApiKeyRoles() {
  loadingRoles.value = true;

  try {
    const res = await $api.get<ApiKeyRolesResponse>(`${endpoints.apiKey}${props.id}/roles`);

    if (res.data) {
      apiKeyRoles.value = res.data;
    }
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loadingRoles.value = false;
}

/** Submit form - update API key */
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else {
      await updateApiKey();
    }
  });
}

async function updateApiKey() {
  loadingForm.value = true;

  try {
    const projectUuid = dataStore.currentProject?.project_uuid;
    const bodyData = {
      project_uuid: projectUuid,
      name: formData.value.name,
      testNetwork: formData.value.apiKeyType,
    };
    const res = await $api.put<ApiKeyCreatedResponse>(endpoints.apiKey, bodyData);

    if (res.data) {
      message.error($i18n.t('form.success.apiKey'));
      emit('submitSuccess');
    }
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
  loadingForm.value = false;
}

/** Check if permission is enabled */
function isPermissionEnabled(serviceUuid: string, roleId: number) {
  const projectUuid = dataStore.currentProject?.project_uuid;
  return (
    apiKeyRoles.value.find(
      role =>
        role.project_uuid === projectUuid &&
        role.service_uuid === serviceUuid &&
        role.role_id === roleId
    ) !== undefined
  );
}

/** Permission update */
function updatePermission(serviceUuid: string, roleId: number, value: boolean) {
  if (value) {
    addPermission(serviceUuid, roleId);
  } else {
    removePermission(serviceUuid, roleId);
  }
}

async function addPermission(serviceUuid: string, roleId: number) {
  const projectUuid = dataStore.currentProject?.project_uuid;
  try {
    await $api.post<ApiKeyRoleUpdateResponse>(`${endpoints.apiKey}${props.id}/role`, {
      project_uuid: projectUuid,
      service_uuid: serviceUuid,
      role_id: roleId,
    });

    message.success($i18n.t('form.success.updated.apiKeyRole'));
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
}

async function removePermission(serviceUuid: string, roleId: number) {
  const projectUuid = dataStore.currentProject?.project_uuid || '';
  try {
    await $api.delete<DeleteResponse>(`${endpoints.apiKey}${props.id}/role`, {
      project_uuid: projectUuid,
      service_uuid: serviceUuid,
      role_id: roleId,
    });

    message.success($i18n.t('form.success.deleted.apiKeyRole'));
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
}
</script>
