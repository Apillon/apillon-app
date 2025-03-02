<template>
  <n-form
    ref="formRef"
    class="max-w-xl"
    :model="collectionStore.form.base"
    :rules="rules"
    @submit.prevent="handleSubmitForm"
  >
    <n-grid class="items-end" :cols="12" :x-gap="32">
      <!--  Collection logo -->
      <n-form-item-gi
        :span="12"
        path="logo"
        :label="infoLabel('logo')"
        :label-props="{ for: 'collectionLogo' }"
      >
        <FormNftCollectionUpload :is-logo="true" />
      </n-form-item-gi>

      <!--  Collection cover image -->
      <n-form-item-gi
        :span="12"
        path="coverImage"
        :label="infoLabel('coverImage')"
        :label-props="{ for: 'coverImage' }"
      >
        <FormNftCollectionUpload />
      </n-form-item-gi>

      <!--  Collection name -->
      <n-form-item-gi
        :span="8"
        path="name"
        :label="infoLabel('name')"
        :label-props="{ for: 'name' }"
      >
        <n-input
          v-model:value="collectionStore.form.base.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>

      <!--  Collection Symbol -->
      <n-form-item-gi
        :span="4"
        path="symbol"
        :label="infoLabel('symbol')"
        :label-props="{ for: 'symbol' }"
      >
        <n-input
          v-model:value="collectionStore.form.base.symbol"
          :minlength="1"
          :maxlength="8"
          :input-props="{ id: 'symbol' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <!--  Collection type -->
    <template v-if="!isUnique">
      <n-form-item
        v-if="
          isFeatureEnabled(Feature.NFT_NESTABLE, authStore.getUserRoles()) &&
          collectionStore.form.base.chainType === ChainType.EVM
        "
        path="collectionType"
        :label="infoLabel('type')"
        :label-props="{ for: 'collectionType' }"
      >
        <select-options
          v-model:value="collectionStore.form.base.collectionType"
          :options="collectionTypes"
          :input-props="{ id: 'collectionType' }"
          :placeholder="$t('general.pleaseSelect')"
          filterable
          clearable
        />
      </n-form-item>

      <!--  Collection Use Gateway -->
      <n-form-item path="useApillonIpfsGateway" :show-label="false" :show-feedback="false">
        <n-checkbox
          v-model:checked="collectionStore.form.base.useApillonIpfsGateway"
          size="medium"
          :label="infoLabel('useGateway')"
        />
      </n-form-item>

      <!--  Collection Dynamic metadata -->
      <n-form-item path="useIpns" :show-label="false">
        <n-checkbox
          v-model:checked="collectionStore.form.base.useIpns"
          size="medium"
          :label="infoLabel('useIpns')"
        />
      </n-form-item>
    </template>

    <!--  Form submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.proceed')" />
      <Btn type="primary" class="w-full mt-2" @click="handleSubmitForm">
        {{ $t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
const message = useMessage();
const authStore = useAuthStore();
const collectionStore = useCollectionStore();
const { labelInfo } = useComputing();
const { collectionTypes, formRef, isUnique, rules } = useCollection();

function infoLabel(field: string) {
  return labelInfo(field, 'form.label.collection');
}

// Submit
function handleSubmitForm(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      collectionStore.step = CollectionStep.BEHAVIOR;
    }
  });
}
</script>
