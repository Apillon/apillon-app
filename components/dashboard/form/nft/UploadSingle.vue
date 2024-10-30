<template>
  <div class="w-full max-w-3xl">
    <FormInstructions :title="t('nft.single.data')" :instructions="[t('nft.collection.instruction.data')]">
      <n-form
        ref="formRef"
        :model="collectionStore.form.single"
        :rules="rulesSingle"
        @submit.prevent="handleSubmitForm"
      >
        <n-grid :cols="12" :x-gap="32">
          <!-- NFT name -->
          <n-form-item-gi :span="8" path="name" :label="infoLabel('name')" :label-props="{ for: 'name' }">
            <n-input
              v-model:value="collectionStore.form.single.name"
              :input-props="{ id: 'name' }"
              :placeholder="t('general.typeHere')"
              clearable
            />
          </n-form-item-gi>

          <!-- NFT ID -->
          <n-form-item-gi :span="4" path="id" :label="infoLabel('id')" :label-props="{ for: 'nftId' }">
            <n-input-number
              v-model:value="collectionStore.form.single.id"
              :input-props="{ id: 'nftId' }"
              :placeholder="t('general.typeHere')"
              :step="1"
              :min="0"
              :max="100000"
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
              v-model:value="collectionStore.form.single.description"
              :input-props="{ id: 'description' }"
              :placeholder="t('general.typeHere')"
              type="textarea"
              clearable
            />
          </n-form-item-gi>

          <!--  Collection cover image -->
          <n-form-item-gi
            :span="6"
            path="coverImage"
            :label="infoLabel('coverImage') as string"
            :label-props="{ for: 'coverImage' }"
            :show-feedback="false"
          >
            <div v-if="collectionStore.form.single.image" class="mx-auto w-72 overflow-hidden rounded-xl bg-bg-light">
              <figure class="flex h-full flex-col">
                <Image
                  :src="imageByName(collectionStore.form.single.image)"
                  class="h-full w-full object-contain"
                  :alt="collectionStore.images[0]?.name"
                />
                <figcaption class="block h-12 px-4 py-3 font-bold">
                  {{ collectionStore.form.single.image }}
                  <button class="float-right flex items-center justify-center p-1" @click="removeImages()">
                    <span class="icon-delete text-xl"></span>
                  </button>
                </figcaption>
              </figure>
            </div>
            <n-upload
              v-else
              ref="uploadRef"
              accept="image/png, image/jpeg"
              :default-file-list="collectionStore.images"
              :show-file-list="false"
              directory-dnd
              :custom-request="uploadImageRequest"
              @remove="handleImageRemove"
            >
              <n-upload-dragger class="h-40">
                <div class="py-2 text-center">
                  <div class="mb-2 inline-block h-10 w-10 rounded-full bg-bg-lighter p-2">
                    <span class="icon-image text-2xl text-violet"></span>
                  </div>

                  <h4 class="mb-1">{{ t('nft.upload.images') }}</h4>
                  <p class="max-w-lg text-xs">
                    {{ t('nft.single.uploadDescription') }}
                  </p>
                </div>
              </n-upload-dragger>
            </n-upload>
          </n-form-item-gi>

          <!-- Number NFT of copies -->
          <n-form-item-gi :span="6" path="copies" :label="infoLabel('nftCopies')" :label-props="{ for: 'copies' }">
            <n-input-number
              v-model:value="collectionStore.form.single.copies"
              :min="0"
              :input-props="{ id: 'copies' }"
              clearable
            />
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </FormInstructions>

    <FormInstructions :title="t('nft.upload.attributes')" :instructions="[]">
      <NftSingleProperties />
    </FormInstructions>

    <Btn class="my-8" @click="handleSubmitForm">{{ t('form.proceed') }}</Btn>
  </div>
</template>

<script lang="ts" setup>
import type { UploadInst } from 'naive-ui';

const { t } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();
const { createThumbnailUrl, handleImageRemove, uploadImageRequest } = useNft();
const { formRef, isUnique, rulesSingle } = useCollection();

const uploadRef = ref<UploadInst | null>(null);

function infoLabel(field: string) {
  return labelInfo(field, 'form.label.nft');
}

function removeImages() {
  collectionStore.images.pop();
  collectionStore.form.single.image = '';
  uploadRef.value?.clear();
}

function imageByName(name: string = '') {
  const image = collectionStore.images.find(img => img.name === name);
  return image ? createThumbnailUrl(image) : '';
}

function handleSubmitForm(e: Event | MouseEvent) {
  e.preventDefault();

  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors || !collectionStore.hasImages) {
      if (!collectionStore.hasImages) {
        message.warning(t('validation.nft') || 'Error');
      }

      errors?.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      for (let index = 0; index < collectionStore.form.single.copies; index += 1) {
        collectionStore.metadata.push(JSON.parse(JSON.stringify(collectionStore.form.single)));
        collectionStore.form.single.id += 1;
      }

      collectionStore.columns = createColumns(collectionStore.form.single);

      collectionStore.nftStep = NftCreateStep.PREVIEW;
    }
  });

  function createColumns(obj: Record<string, any>): { title: string; key: any }[] {
    const keysArray: { title: string; key: any }[] = [];

    Object.keys(obj).forEach(key => {
      if (key !== 'collectionUuid' && key !== 'copies') {
        if (Array.isArray(obj[key])) {
          // If key is an array, include keys from objects within the array
          obj[key].forEach((item: Record<string, any>, index: number) => {
            Object.keys(item).forEach(subKey => {
              if (subKey === 'trait_type') {
                keysArray.push({
                  title: item[subKey],
                  key: `${key}[${index}].value`,
                });
              }
            });
          });
        } else {
          // Otherwise, include key directly
          keysArray.push({ title: key, key });
        }
      }
    });
    return keysArray;
  }
}
</script>
