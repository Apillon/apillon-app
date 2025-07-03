<template>
  <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
    {{ $t('dashboard.permissions.insufficient') }}
  </Notification>
  <n-form
    v-bind="$attrs"
    ref="formRef"
    class="max-w-xl"
    :model="metadataStore.form.visual"
    :rules="rulesCollection"
    @submit.prevent="handleSubmitForm"
  >
    <n-grid :cols="12" :x-gap="32">
      <!--  Collection logo -->
      <n-form-item-gi
        :span="6"
        path="logo"
        :label="labelInfo('logo')"
        :label-props="{ for: 'collectionLogo' }"
        :show-feedback="false"
      >
        <FormNftCollectionUpload
          id="collectionLogo"
          :image="metadataStore.form.visual.logo || ({} as FileListItemType)"
          is-logo
        />
      </n-form-item-gi>

      <!--  Collection cover image -->
      <n-form-item-gi
        :span="6"
        path="coverImage"
        :label="labelInfo('coverImage')"
        :label-props="{ for: 'coverImage' }"
        :show-feedback="false"
      >
        <FormNftCollectionUpload
          id="coverImage"
          :image="metadataStore.form.visual.coverImage || ({} as FileListItemType)"
        />
      </n-form-item-gi>
    </n-grid>

    <!--  Form submit -->
    <n-form-item v-if="!hideSubmit" :show-label="false">
      <input type="submit" class="hidden" :value="t('form.proceed')" />
      <Btn type="primary" class="mt-2 w-full" @click="handleSubmitForm">
        {{ $t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
defineProps({
  hideSubmit: { type: Boolean, default: false },
});
const { t } = useI18n();
const metadataStore = useMetadataStore();

const { rulesCollection, labelInfo } = useForm();
const { formRef, isFormDisabled } = useCollection();
defineExpose({ formRef, handleSubmitForm });

// Submit
async function handleSubmitForm(e?: Event | MouseEvent): Promise<boolean> {
  e?.preventDefault();
  return !(await formRef.value?.validate())?.warnings;
}
</script>
