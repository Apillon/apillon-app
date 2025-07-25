<template>
  <div>
    <!-- Spinner while loading -->
    <Spinner v-if="websiteUuid && !website" />

    <div v-else>
      <!-- Permissions Error Notification -->
      <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
        {{ $t('dashboard.permissions.insufficient') }}
      </Notification>

      <!-- Info text -->
      <h5 v-if="title" class="mb-2">{{ title }}</h5>
      <p v-if="!websiteUuid && $te('hosting.website.infoNew')" class="mb-8 text-body">
        {{ $t('hosting.website.infoNew') }}
      </p>
      <p v-else-if="!!websiteUuid && $te('hosting.website.infoEdit')" class="mb-8 text-body">
        {{ $t('hosting.website.infoEdit') }}
      </p>
      <n-form
        ref="formRef"
        :model="websiteStore.form"
        :rules="rules"
        :disabled="isFormDisabled"
        @submit.prevent="handleSubmit"
      >
        <!-- Existing form items for basic website -->
        <n-form-item path="name" :label="$t('form.label.website.name')" :label-props="{ for: 'name' }">
          <n-input
            v-model:value="websiteStore.form.name"
            :input-props="{ id: 'name' }"
            :placeholder="$t('form.placeholder.website.name')"
            clearable
          />
        </n-form-item>

        <n-form-item
          path="description"
          :label="$t('form.label.website.description')"
          :label-props="{ for: 'description' }"
        >
          <n-input
            v-model:value="websiteStore.form.description"
            type="textarea"
            :input-props="{ id: 'description' }"
            :placeholder="$t('form.placeholder.website.description')"
            clearable
          />
        </n-form-item>

        <!-- Submit Button -->
        <n-form-item v-if="!hideSubmit" :show-feedback="false">
          <Btn type="primary" class="mt-2 w-full" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
            {{ website ? $t('hosting.website.update') : $t('hosting.website.create') }}
          </Btn>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineExpose({ handleSubmit });
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);
const props = defineProps({
  title: { type: String, default: null },
  websiteUuid: { type: String, default: null },
  hideSubmit: { type: Boolean, default: false },
});

const { t } = useI18n();
const dataStore = useDataStore();
const websiteStore = useWebsiteStore();
const warningStore = useWarningStore();
const { createWebsite, updateWebsite } = useHosting();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const website = ref<WebsiteInterface | null>(null);

const rules: NFormRules = {
  name: [ruleRequired(t('validation.website.nameRequired'))],
  description: [ruleDescription(t('validation.descriptionTooLong'))],
};

onMounted(async () => {
  if (props.websiteUuid) {
    website.value = await websiteStore.getWebsite(props.websiteUuid);
    websiteStore.form.name = website.value.name;
    websiteStore.form.description = website.value.description || '';
  }
});

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

// Submit
async function handleSubmit(e?: Event | MouseEvent) {
  e?.preventDefault();

  const validation = await formRef.value?.validate();

  if (props.hideSubmit) {
    return !validation?.warnings;
  } else if (props.websiteUuid) {
    const updatedWebsite = await updateWebsite(props.websiteUuid);
    if (updatedWebsite) {
      emit('submitSuccess');
      emit('updateSuccess', updatedWebsite);
    }
  } else {
    warningStore.showSpendingWarning(PriceServiceName.HOSTING_WEBSITE, () => create());
  }
}

async function create() {
  const createdWebsite = await createWebsite();

  if (createdWebsite) {
    emit('submitSuccess');
    emit('createSuccess', createdWebsite);
  }
}
</script>
