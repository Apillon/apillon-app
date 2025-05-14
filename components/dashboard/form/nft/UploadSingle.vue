<template>
  <n-form ref="formRef" class="h-full" :model="metadataStore.form.single" :rules="rulesSingle">
    <div class="flex h-full flex-col gap-12 md:flex-row">
      <div class="md:w-1/2">
        <h4>{{ $t('nft.add') }}</h4>
        <p class="mb-6">{{ $t('nft.amount.singleContent') }}</p>

        <n-grid :cols="12" :x-gap="32">
          <!--  Collection cover image -->
          <n-form-item-gi :span="6" path="image" :label="infoLabel('image')" :label-props="{ for: 'image' }">
            <NftCard
              v-if="metadataStore.form.single.image"
              class="mx-auto max-w-72"
              :image="metadataStore.form.single.image"
              @remove="() => removeImages()"
            />
            <FormFieldUploadImage
              v-else
              ref="uploadRef"
              :input-props="{ id: 'nftImage' }"
              :file-list="metadataStore.images"
              @change="uploadImageRequest"
              @remove="handleImageRemove"
            />
          </n-form-item-gi>

          <!-- NFT name -->
          <n-form-item-gi :span="12" path="name" :label="infoLabel('name')" :label-props="{ for: 'name' }">
            <n-input
              v-model:value="metadataStore.form.single.name"
              :input-props="{ id: 'name' }"
              :placeholder="t('general.typeHere')"
              clearable
            />
          </n-form-item-gi>

          <!-- NFT ID -->
          <n-form-item-gi :span="6" path="id" :label="infoLabel('id')" :label-props="{ for: 'nftId' }">
            <n-input-number
              v-model:value="metadataStore.form.single.id"
              :input-props="{ id: 'nftId' }"
              :placeholder="t('general.typeHere')"
              :step="1"
              :min="0"
              :max="100000"
              clearable
            />
          </n-form-item-gi>

          <!-- Number NFT of copies -->
          <n-form-item-gi :span="6" path="copies" :label="infoLabel('copies')" :label-props="{ for: 'copies' }">
            <n-input-number
              v-model:value="metadataStore.form.single.copies"
              :min="0"
              :input-props="{ id: 'copies' }"
              clearable
            />
          </n-form-item-gi>

          <!-- NFT description -->
          <n-form-item-gi
            :span="12"
            path="description"
            :label="infoLabel('description')"
            :label-props="{ for: 'description' }"
          >
            <n-input
              v-model:value="metadataStore.form.single.description"
              :input-props="{ id: 'description' }"
              :placeholder="t('general.typeHere')"
              type="textarea"
              clearable
            />
          </n-form-item-gi>
        </n-grid>
      </div>

      <div class="relative hidden h-full md:block">
        <div class="absolute bottom-8 top-8 border-l border-bg-lighter"></div>
      </div>

      <div class="mt-8 md:!w-1/2">
        <n-grid :cols="12">
          <n-form-item-gi
            :span="12"
            path="attributes"
            :label="infoLabel('attributes')"
            :label-props="{ for: 'attributes' }"
            size="large"
          >
            <div class="flex w-full flex-col items-end gap-6">
              <TableNftAttributes />
              <Btn type="secondary" @click="addAttribute()">
                <span class="flex items-center gap-2">
                  <span class="icon-add rounded-md p-1 text-xl text-yellow"></span>
                  <span>{{ $t('nft.addAttribute') }}</span>
                </span>
              </Btn>
            </div>
          </n-form-item-gi>
        </n-grid>
      </div>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import type { UploadInst } from 'naive-ui';

const { t } = useI18n();
const message = useMessage();
const metadataStore = useMetadataStore();

const { labelInfo } = useComputing();
const { formRef, rulesSingle } = useCollection();
const { createSingleNft, handleImageRemove, uploadImageRequest } = useMetadata();
defineExpose({ formRef, handleSubmitForm });

const uploadRef = ref<UploadInst | null>(null);

function infoLabel(field: string) {
  return labelInfo(field, 'form.label.nft');
}

function removeImages() {
  metadataStore.images.pop();
  metadataStore.form.single.image = '';
  uploadRef.value?.clear();
}

function addAttribute() {
  metadataStore.form.single.attributes.push({
    display_type: null,
    trait_type: '',
    value: '',
  });
}

async function handleSubmitForm(e?: Event | MouseEvent) {
  e?.preventDefault();

  return !(
    await formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
      if (errors || !metadataStore.hasImages) {
        if (!metadataStore.hasImages) {
          message.warning(t('validation.nft.image') || 'Error');
        }

        errors?.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
      } else {
        createSingleNft(metadataStore.form.single);
      }
    })
  )?.warnings;
}
</script>
