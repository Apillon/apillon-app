<template>
  <Form :disabled="disabled" :loading="loading">
    <n-form
      v-bind="$attrs"
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="disabled"
      @submit.prevent="handleSubmit"
    >
      <!--  Service name -->
      <n-form-item path="name" :label="$t('form.label.apiKeyName')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="formData.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.apiKeyName')"
          :disabled="props.id > 0"
          clearable
        />
      </n-form-item>

      <!-- Permissions per service -->
      <n-form-item path="roles" :show-label="false" :show-feedback="false">
        <n-collapse
          v-if="formData.roles && formData.roles.length"
          class="collapse-permissions"
          :expanded-names="expandedPermissions"
          @item-header-click="handleItemHeaderClick"
        >
          <!-- Active services -->
          <n-collapse-item
            v-for="service in formData.roles"
            :key="service.service_uuid"
            :title="$t(`dashboard.apiKey.service.${service.serviceType.toLowerCase()}`)"
            :name="service.service_uuid"
          >
            <template #arrow>
              <span :class="`icon-${service.serviceType.toLowerCase()}`" class="min-w-[20px] text-center"> </span>
            </template>
            <template #header-extra>
              <n-switch v-model:value="service.enabled" class="pointer-events-none" />
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
                  @update:checked="updatePermission(service.service_uuid, permission.key, permission.value)"
                />
              </n-form-item-gi>
            </n-grid>
          </n-collapse-item>
        </n-collapse>
      </n-form-item>

      <!-- Unused services  -->
      <n-collapse
        v-if="unusedServices && unusedServices.length"
        class="collapse-permissions unused"
        :expanded-names="expandedUnused"
      >
        <n-collapse-item
          v-for="serviceType in unusedServices"
          :key="serviceType.id"
          :title="serviceType.name"
          :name="serviceType.name"
        >
          <template #arrow>
            <span :class="`icon-${serviceType.name.toLowerCase()}`"></span>
          </template>

          <FormService
            class="mt-4 pr-4 sm:pr-8"
            :service-type="serviceType.id"
            :default-service-name="serviceType.name"
            :btn-text="$t('general.attachService', { service: serviceType.name })"
            @create-success="onServiceCreated"
          />
        </n-collapse-item>
      </n-collapse>

      <!--  Submit -->
      <n-form-item v-if="props.id === 0" :show-label="false">
        <input type="submit" class="hidden" :value="$t('form.generate')" />
        <Btn type="primary" class="mt-8 w-full" :loading="loading" :disabled="disabled" @click="handleSubmit">
          {{ $t('form.generate') }}
        </Btn>
      </n-form-item>
    </n-form>
  </Form>

  <!-- Modal - API key details -->
  <n-modal
    v-model:show="showModalApiKeyDetails"
    :mask-closable="false"
    :close-on-esc="false"
    :closable="false"
    preset="dialog"
    :title="$t('dashboard.apiKey.details')"
    :positive-text="$t('dashboard.apiKey.secretSaved')"
    @positive-click="emit('close')"
  >
    <ApiKeyDetails v-bind="createdApiKey" />
  </n-modal>
</template>

<script lang="ts" setup>
import type { FormItemRule } from 'naive-ui';

/**
 * API key - Form
 */
type ApiKeyPermissionForm = {
  key: number;
  label: string;
  name: string;
  value: boolean;
};
type ApiKeyRoleForm = {
  enabled: boolean;
  name: string;
  serviceType: string;
  service_uuid: string;
  permissions: Array<ApiKeyPermissionForm>;
};
type ApiKeyForm = {
  name: string;
  apiKeyType: boolean;
  roles: Array<ApiKeyRoleForm>;
};

const props = defineProps({
  id: { type: Number, default: 0 },
});

const { t } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const emit = defineEmits(['close', 'submitSuccess']);

const formRef = ref<NFormInst | null>(null);
const loading = ref<boolean>(true);
const loadingForm = ref<boolean>(false);
const loadingRoles = ref<boolean>(false);

const apiKey = ref<ApiKeyInterface>();
const apiKeyRoles = ref<Array<ApiKeyRoleInterface>>([]);
const showModalApiKeyDetails = ref<boolean>(false);
const createdApiKey = ref<ApiKeyCreatedInterface>({} as ApiKeyCreatedInterface);

/**
 * Form data
 */

const formData = ref<ApiKeyForm>({
  name: '',
  apiKeyType: false,
  roles: [],
});

const rules: NFormRules = {
  name: ruleRequired(t('validation.apiKey.nameRequired')),
  roles: [
    {
      validator(_: FormItemRule, value: any) {
        return Array.isArray(value) && value.length > 0 && value.some(item => isAnyPermissionEnabled(item));
      },
      message: t('validation.apiKey.rolesRequired'),
    },
  ],
};

const disabled = computed(() => dataStore.isProjectUser || settingsStore.apiKeyQuotaReached);

const unusedServices = computed<ServiceTypeField[]>(() => {
  return dataStore.serviceTypes.reduce((acc, serviceType) => {
    const isServiceInUse = dataStore.services.some(item => item.serviceType_id === serviceType.id);
    const newServiceType = { ...serviceType, enabled: false };
    return !isServiceEnabled(serviceType) ||
      isServiceInUse ||
      serviceType.active === 0 ||
      serviceType.id === ServiceType.SIMPLETS
      ? acc
      : [...acc, newServiceType];
  }, [] as ServiceTypeField[]);
});

const createRoles = () => {
  return dataStore.services
    .filter(s => s.serviceType_id !== ServiceType.SIMPLETS)
    .map(service => {
      return {
        enabled: isAnyPermissionEnabled(service),
        name: service.name,
        serviceType: service.serviceType,
        service_uuid: service.service_uuid,
        permissions: [
          {
            key: ApiKeyRole.READ,
            value: isPermissionEnabled(service.service_uuid, ApiKeyRole.READ),
            name: 'read',
            label: t('dashboard.permissions.read'),
          },
          {
            key: ApiKeyRole.EXECUTE,
            value: isPermissionEnabled(service.service_uuid, ApiKeyRole.EXECUTE),
            name: 'execute',
            label: t('dashboard.permissions.execute'),
          },
          {
            key: ApiKeyRole.WRITE,
            value: isPermissionEnabled(service.service_uuid, ApiKeyRole.WRITE),
            name: 'write',
            label: t('dashboard.permissions.write'),
          },
        ],
      };
    });
};

const createExpandedPermissions = () => {
  if (props.id === 0) {
    return null;
  }
  return formData.value.roles.filter(role => role.enabled).map(item => item.service_uuid);
};
const expandedPermissions = ref<string | number | Array<string | number> | null>(null);

const expandedUnused = computed(() => {
  return unusedServices.value.map(item => item.name);
});

const handleItemHeaderClick = ({ name, expanded }) => {
  /* If service was collapsed, than deactivate all permissions  */
  const service = formData.value.roles.find(item => item.service_uuid === name);
  const serviceType = unusedServices.value.find(item => item.name === name);

  updateExpanded(name, expanded);

  if (service) {
    service.enabled = !service.enabled;

    /** Toggle checkboxes if user is creating new API key */
    service.permissions.forEach(permission => {
      permission.value = expanded;
    });
    if (props.id > 0 && expanded) {
      addAllPermissions(name);
    } else if (props.id > 0) {
      removeServicePermissions(service);
    }
  } else if (serviceType) {
    serviceType.enabled = !serviceType.enabled;
  }
};

function updateExpanded(name: string, expanded: boolean) {
  if (Array.isArray(expandedPermissions.value) && expanded) {
    expandedPermissions.value.push(name);
  } else if (Array.isArray(expandedPermissions.value)) {
    expandedPermissions.value = expandedPermissions.value.filter(item => item !== name);
  } else if (expanded) {
    expandedPermissions.value = [name];
  } else {
    expandedPermissions.value = null;
  }
}

/** Load roles and show permissions */
onMounted(async () => {
  settingsStore.getApiKeyQuota();
  if (props.id > 0) {
    await getApiKeyRoles();

    apiKey.value = settingsStore.getApiKeyById(props.id);
    formData.value.name = apiKey.value.name;
    formData.value.apiKeyType = apiKey.value.testNetwork === 1;
  }

  formData.value.roles = createRoles();
  expandedPermissions.value = createExpandedPermissions();
  loading.value = false;
});

/** Get API key's roles */
async function getApiKeyRoles() {
  loadingRoles.value = true;

  try {
    const res = await $api.get<ApiKeyRolesResponse>(endpoints.apiKeyRoles(props.id));

    if (res.data) {
      apiKeyRoles.value = res.data;
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loadingRoles.value = false;
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      // errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (props.id > 0) {
      await updateApiKey();
    } else {
      await createApiKey();
    }
  });
}

async function createApiKey() {
  loading.value = true;

  try {
    const projectUuid = dataStore.projectUuid;
    const bodyData = {
      project_uuid: projectUuid,
      name: formData.value.name,
      testNetwork: false,
      roles: formData.value.roles
        .map(role => {
          return role.permissions
            .filter(permission => !!permission.value)
            .map(permission => {
              return {
                role_id: permission.key,
                project_uuid: projectUuid,
                service_uuid: role.service_uuid,
              };
            });
        })
        .flat()
        .filter(item => item !== undefined),
    };
    const res = await $api.post<ApiKeyCreatedResponse>(endpoints.apiKey(), bodyData);

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

async function updateApiKey() {
  loadingForm.value = true;

  try {
    const bodyData = {
      project_uuid: dataStore.projectUuid,
      name: formData.value.name,
      testNetwork: false,
    };
    const res = await $api.put<ApiKeyCreatedResponse>(endpoints.apiKey(), bodyData);

    if (res.data) {
      message.error(t('form.success.apiKey'));
      emit('submitSuccess');
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loadingForm.value = false;
}

/** Check if permission is enabled */
function isPermissionEnabled(serviceUuid: string, roleId: number) {
  /** Default value for new API key */
  if (props.id === 0) {
    if (!formData.value.roles) return false;

    const serviceRoles = formData.value.roles.find(role => role.service_uuid === serviceUuid);
    if (serviceRoles) {
      const permission = serviceRoles.permissions.find(role => role.key === roleId);
      return permission ? permission.value : false;
    } else {
      return false;
    }
  }

  return apiKeyRoles.value.some(
    role => role.project_uuid === dataStore.projectUuid && role.service_uuid === serviceUuid && role.role_id === roleId
  );
}
function isAnyPermissionEnabled(service: ServiceInterface) {
  return enumValues(ApiKeyRole).some(roleId => isPermissionEnabled(service.service_uuid, roleId));
}

/** Permission update */
function updatePermission(serviceUuid: string, roleId: number, value: boolean) {
  if (props.id === 0) {
    return;
  }
  if (value) {
    addPermission(serviceUuid, roleId);
  } else {
    removePermission(serviceUuid, roleId);
  }
}

async function addAllPermissions(serviceUuid: string) {
  await Promise.all([
    addPermission(serviceUuid, ApiKeyRole.EXECUTE, false),
    addPermission(serviceUuid, ApiKeyRole.READ, false),
    addPermission(serviceUuid, ApiKeyRole.WRITE, false),
  ]).then(() => {
    message.success(t('form.success.updated.apiKeyRoles'));
  });
}

async function addPermission(serviceUuid: string, roleId: number, showMsg = true) {
  try {
    await $api.post<ApiKeyRoleUpdateResponse>(endpoints.apiKeyRole(props.id), {
      project_uuid: dataStore.projectUuid,
      service_uuid: serviceUuid,
      role_id: roleId,
    });

    if (showMsg) {
      message.success(t('form.success.updated.apiKeyRole'));
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
}

async function removePermission(serviceUuid: string, roleId: number) {
  try {
    await $api.delete<DeleteResponse>(endpoints.apiKeyRole(props.id), {
      project_uuid: dataStore.projectUuid,
      service_uuid: serviceUuid,
      role_id: roleId,
    });

    message.success(t('form.success.deleted.apiKeyRole'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
}

async function removeServicePermissions(service: ApiKeyRoleForm) {
  if (props.id === 0) return;

  // If toggle off, remove all active roles for this service type
  try {
    await $api.delete<DeleteResponse>(endpoints.apiKeyServiceRoles(props.id), {
      project_uuid: dataStore.projectUuid,
      service_uuid: service.service_uuid,
      role_id: 50, // Validation placeholder
    });

    message.success(t('form.success.deleted.apiKeyRole'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
}

function onServiceCreated(service: ServiceInterface) {
  formData.value.roles = createRoles();

  if (service && service.active) {
    handleItemHeaderClick({ name: service.service_uuid, expanded: true });
  }
}

/* Check if user can create this service */
function isServiceEnabled(serviceType: ServiceTypeInterface) {
  switch (serviceType.id) {
    case 1:
      return authStore.isUserAllowed(Permission.AUTHENTICATION);
    case 2:
      return authStore.isUserAllowed(Permission.STORAGE);
    case 4:
      return authStore.isUserAllowed(Permission.HOSTING);
    default:
      return authStore.isUserAllowed(serviceType.id);
  }
}
</script>
