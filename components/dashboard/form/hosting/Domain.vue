<template>
  <div v-if="websiteUuid && !website" class="relative h-20 min-w-80">
    <Spinner />
  </div>
  <HostingDomainConfiguration v-else-if="domainCreated" class="mb-8" :domain="formData.domain || domain" />
  <div v-else class="sm:min-w-[22rem]">
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="authStore.isAdmin()"
      @submit.prevent="handleSubmit"
    >
      <!--  Website domain -->
      <n-form-item path="domain" :label="$t('form.label.domain')" :label-props="{ for: 'domain' }">
        <n-input
          v-model:value="formData.domain"
          :input-props="{ id: 'domain', type: 'text' }"
          :placeholder="$t('form.placeholder.domain')"
          clearable
        />
      </n-form-item>

      <!--  IPNS -->
      <n-form-item v-if="!website?.ipnsProduction" path="ipns" :show-label="false">
        <n-checkbox v-model:checked="formData.ipns" :label="labelInfo('useIpns', 'hosting.domain')" />
      </n-form-item>

      <!--  Form submit -->
      <n-form-item :show-label="false" :show-feedback="false">
        <input type="submit" class="hidden" :value="$t('hosting.domain.add')" />
        <Btn
          type="primary"
          class="mt-2 w-full"
          :loading="loading"
          :disabled="(!domain && formData.domain?.length === 0) || authStore.isAdmin()"
          @click="handleSubmit"
        >
          <template v-if="domain">
            {{ $t('hosting.domain.update') }}
          </template>
          <template v-else>
            {{ $t('hosting.domain.add') }}
          </template>
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import type { FormItemRule } from 'naive-ui';

type FormWebsiteDomain = {
  domain?: string | null;
  ipns: boolean;
};

const props = defineProps({
  websiteUuid: { type: String, default: null },
  domain: { type: String, default: '' },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const { t } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const websiteStore = useWebsiteStore();
const warningStore = useWarningStore();
const deploymentStore = useDeploymentStore();
const { labelInfo } = useComputing();
const { checkUnfinishedWebsite } = useHosting();

const loading = ref<boolean>(false);
const domainCreated = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const website = ref<WebsiteInterface | null>(null);

const formData = ref<FormWebsiteDomain>({
  domain: props.domain || null,
  ipns: props.domain ? !!website.value?.ipnsProduction : true,
});

const rules: NFormRules = {
  domain: [
    {
      type: 'url',
      validator: validateDomain,
      message: t('validation.website.domainUrl'),
    },
  ],
};

onMounted(async () => {
  if (props.websiteUuid) {
    website.value = await websiteStore.getWebsite(props.websiteUuid);
    formData.value.domain = website.value.domain;

    if (props.domain) {
      formData.value.ipns = !!website.value?.ipnsProduction;
    }
  }
});

const lastDeployment = computed(() => {
  return deploymentStore.production.reduce((latest, current) => {
    return new Date(current.createTime) > new Date(latest.createTime) ? current : latest;
  });
});

// Custom validations
function validateDomain(_: FormItemRule, value: string): boolean {
  const regex = /^[a-zA-Z0-9][a-zA-Z0-9-.]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  return !value || regex.test(value);
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();

  const serviceName =
    formData.value.ipns && !website.value?.ipnsProduction
      ? [PriceServiceName.HOSTING_CHANGE_WEBSITE_DOMAIN, PriceServiceName.IPNS]
      : [PriceServiceName.HOSTING_CHANGE_WEBSITE_DOMAIN];

  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else if (props.domain || website.value?.ipnsProduction) {
      warningStore.showSpendingWarning(serviceName, () => updateWebsiteDomain());
    } else {
      warningStore.showSpendingWarning(serviceName, () => createWebsiteDomain());
    }
  });
}

async function createWebsiteDomain() {
  loading.value = true;

  /** Create IPNS first if user check it */
  if (formData.value.ipns && !(await createIpns())) {
    loading.value = false;
    return;
  }

  try {
    const res = await $api.patch<WebsiteResponse>(endpoints.websites(props.websiteUuid), formData.value);
    updateWebsiteDomainValue(res.data.domain);

    domainCreated.value = true;
    message.success(t('form.success.created.domain'));

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function createIpns(): Promise<boolean> {
  if (!lastDeployment.value) {
    message.warning('Website must be successfully deployed to production!');
    return false;
  }

  try {
    const res = await $api.post<IpnsCreateResponse>(endpoints.ipns(websiteStore.active.productionBucket.bucket_uuid), {
      name: `Website: ${websiteStore.active.name}`,
      cid: lastDeployment.value.cidv1 || lastDeployment.value.cid,
    });
    websiteStore.active.ipnsProduction = res.data.ipnsName;

    message.success(t('form.success.created.ipns'));
    return true;
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  message.warning('Creating IPNS failed!');
  return false;
}

async function updateWebsiteDomain() {
  loading.value = true;

  try {
    const res = await $api.patch<WebsiteResponse>(endpoints.websites(props.websiteUuid), formData.value);

    updateWebsiteDomainValue(res.data.domain);

    message.success(t('form.success.updated.domain'));

    /** Emit events */
    emit('submitSuccess');
    emit('updateSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

function updateWebsiteDomainValue(domain: string | null) {
  /** On website updated refresh website data */
  websiteStore.items.forEach((item: WebsiteBaseInterface) => {
    if (item.website_uuid === props.websiteUuid) {
      item.domain = domain;
      item.domainChangeDate = new Date().toISOString();
    }
  });
  if (websiteStore.active.website_uuid === props.websiteUuid) {
    websiteStore.active.domain = domain;
    websiteStore.active.domainChangeDate = new Date().toISOString();
  }

  if (website.value && formData.value.ipns && !website.value?.ipnsProduction) {
    checkUnfinishedWebsite(website.value);
  }
}
</script>
