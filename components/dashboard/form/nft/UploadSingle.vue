<template>
  <div class="w-full max-w-3xl">
    <h2 class="tablet:text-center">{{ $t('nft.create') }}</h2>
    <div class="my-8">
      <h4>{{ $t('nft.single.content') }}</h4>
      <p class="max-w-lg text-xs">
        {{ $t('nft.single.uploadDescription') }}
      </p>
      <n-form-item>
        <div
          v-if="collectionStore.form.single.image"
          class="bg-bg-light rounded-xl overflow-hidden w-72 mx-auto"
        >
          <figure class="flex flex-col h-full">
            <Image
              :src="imageByName(collectionStore.form.single.image)"
              class="w-full h-full object-contain"
              :alt="collectionStore.images[0]?.name"
            />
            <figcaption class="block h-12 px-4 py-3 font-bold">
              {{ collectionStore.form.single.image }}
              <button
                class="flex justify-center items-center p-1 float-right"
                @click="removeImages()"
              >
                <span class="icon-delete text-xl"></span>
              </button>
            </figcaption>
          </figure>
        </div>
        <n-upload
          v-else
          ref="uploadRef"
          accept="image/*"
          :default-file-list="collectionStore.images"
          :show-file-list="false"
          directory-dnd
          required
          :custom-request="upload => nft.uploadImageRequest(upload, !isUnique)"
          @remove="nft.handleImageRemove"
        >
          <n-upload-dragger class="h-40">
            <div class="py-2 text-center n-form-item">
              <div
                class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2 justify-self-center"
              >
                <span class="icon-image text-violet text-2xl"></span>
              </div>

              <h4>
                {{ $t('nft.upload.images') }}
                <span class="!inline n-form-item-label !p-0 !text-lg -ml-1">
                  <span class="n-form-item-label__asterisk">&nbsp;*</span>
                </span>
              </h4>
              <span class="block mt-1 text-body">{{ $t('nft.upload.dragAndDrop') }}</span>
            </div>
          </n-upload-dragger>
        </n-upload>
      </n-form-item>
    </div>

    <div class="mb-4">
      <h4>{{ $t('nft.single.technicalDetails') }}</h4>
    </div>

    <div class="flex mobile:flex-wrap gap-4">
      <div class="w-full md:max-w-xl">
        <n-form
          ref="formRef"
          :model="collectionStore.form.single"
          :rules="rulesSingle"
          @submit.prevent="handleSubmitForm"
        >
          <n-grid class="items-end" :cols="12" :x-gap="32">
            <!-- NFT ID -->
            <n-form-item-gi
              :span="12"
              path="id"
              :label="infoLabel('id')"
              :label-props="{ for: 'nftId' }"
            >
              <n-input-number
                v-model:value="collectionStore.form.single.id"
                :input-props="{ id: 'nftId' }"
                :placeholder="$t('general.typeHere')"
                :step="1"
                :min="0"
                :max="100000"
                clearable
              />
            </n-form-item-gi>

            <!-- NFT name -->
            <n-form-item-gi
              :span="12"
              path="name"
              :label="infoLabel('name')"
              :label-props="{ for: 'name' }"
            >
              <n-input
                v-model:value="collectionStore.form.single.name"
                :input-props="{ id: 'name' }"
                :placeholder="$t('general.typeHere')"
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
                :placeholder="$t('general.typeHere')"
                type="textarea"
                clearable
              />
            </n-form-item-gi>

            <!-- Number NFT of copies -->
            <n-form-item-gi
              :span="12"
              path="copies"
              :label="infoLabel('copies')"
              :label-props="{ for: 'copies' }"
            >
              <n-input-number
                v-model:value="collectionStore.form.single.copies"
                :min="0"
                :input-props="{ id: 'copies' }"
                :placeholder="`${collectionStore.form.single.copies}`"
                clearable
              />
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </div>
      <NftSingleProperties />
    </div>

    <div class="flex flex-wrap gap-6 justify-between my-8">
      <Btn @click="handleSubmitForm">{{ $t('nft.add') }}</Btn>
      <Btn v-if="collectionStore.metadata?.length > 0" type="secondary" @click="skip">
        Go to preview
      </Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UploadInst } from 'naive-ui';
const nft = useNft();
const { t } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();
const { labelInfo } = useComputing();
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
  return image ? nft.createThumbnailUrl(image) : '';
}

function skip() {
  collectionStore.nftStep = NftCreateStep.PREVIEW;
}

function handleSubmitForm(e: Event | MouseEvent) {
  e.preventDefault();

  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors || !collectionStore.hasImages) {
      if (!collectionStore.hasImages) {
        message.warning(t('validation.nft.image') || 'Error');
      }

      errors?.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
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
