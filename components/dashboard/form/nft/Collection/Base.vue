<template>
  <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
    {{ t('dashboard.permissions.insufficient') }}
  </Notification>
  <n-form
    v-bind="$attrs"
    ref="formRef"
    class="max-w-xl"
    :model="collectionStore.form.base"
    :rules="rules"
    @submit.prevent="handleSubmitForm"
  >
    <n-grid :cols="12" :x-gap="32">
      <!--  Collection name -->
      <n-form-item-gi
        :span="8"
        path="name"
        :label="infoLabel('name') as string"
        :label-props="{ for: 'name' }"
      >
        <n-input
          v-model:value="collectionStore.form.base.name"
          :input-props="{ id: 'name' }"
          :placeholder="t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>

      <!--  Collection Symbol -->
      <n-form-item-gi
        :span="4"
        path="symbol"
        :label="infoLabel('symbol') as string"
        :label-props="{ for: 'symbol' }"
      >
        <n-input
          v-model:value="collectionStore.form.base.symbol"
          :minlength="1"
          :maxlength="8"
          :input-props="{ id: 'symbol' }"
          :placeholder="t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>

      <!--  Collection logo -->
      <n-form-item-gi
        :span="6"
        path="logo"
        :label="infoLabel('logo') as string"
        :label-props="{ for: 'collectionLogo' }"
        :show-feedback="false"
      >
        <FormNftCollectionUpload :image="collectionStore.form.base.logo || ({} as FileListItemType)" is-logo />
      </n-form-item-gi>

      <!--  Collection cover image -->
      <n-form-item-gi
        :span="6"
        path="coverImage"
        :label="infoLabel('coverImage') as string"
        :label-props="{ for: 'coverImage' }"
        :show-feedback="false"
      >
        <FormNftCollectionUpload :image="collectionStore.form.base.coverImage || ({} as FileListItemType)" />
      </n-form-item-gi>
    </n-grid>

    <!--  Form submit -->
    <n-form-item v-if="!hideSubmit" :show-label="false">
      <input type="submit" class="hidden" :value="t('form.proceed')" />
      <Btn type="primary" class="mt-2 w-full" @click="handleSubmitForm">
        {{ t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
defineProps({
  hideSubmit: { type: Boolean, default: false },
});
const { t } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();

const { labelInfo } = useComputing();
const { formRef, isFormDisabled, rules } = useCollection();
defineExpose({ formRef, handleSubmitForm });

function infoLabel(field: string) {
  return labelInfo(field, 'form.label.collection');
}

// Submit
async function handleSubmitForm(e?: Event | MouseEvent): Promise<boolean> {
  e?.preventDefault();
  return !(
    await formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
      if (errors) {
        errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
      }
    })
  )?.warnings;
}
</script>
