<template>
  <div class="w-full max-w-3xl">
    <h2 class="tablet:text-center">{{ $t('nft.create') }}</h2>
    <div class="my-8">
      <h4>{{ $t('nft.single.content') }}</h4>
      <p class="max-w-lg text-xs">
        {{ $t('nft.single.uploadDescription') }}
      </p>
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
        accept="image/png, image/jpeg"
        :default-file-list="collectionStore.images"
        :show-file-list="false"
        directory-dnd
        :custom-request="nft.uploadImageRequest"
        @remove="nft.handleImageRemove"
      >
        <n-upload-dragger class="h-40">
          <div class="py-2 text-center">
            <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
              <span class="icon-image text-violet text-2xl"></span>
            </div>

            <h4 class="mb-1">{{ $t('nft.upload.images') }}</h4>
            <span class="text-body">{{ $t('nft.upload.dragAndDrop') }}</span>
          </div>
        </n-upload-dragger>
      </n-upload>
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
              :label="infoLabel('nftId')"
              :label-props="{ for: 'nftId' }"
            >
              <n-input-number
                v-model:value="collectionStore.form.single.id"
                :input-props="{ id: 'nftId' }"
                :placeholder="$t('general.typeHere')"
                clearable
              />
            </n-form-item-gi>

            <!-- NFT name -->
            <n-form-item-gi
              :span="12"
              path="name"
              :label="infoLabel('nftName')"
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
              :label="infoLabel('nftDescription')"
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
              :label="infoLabel('nftCopies')"
              :label-props="{ for: 'copies' }"
            >
              <n-input-number
                v-model:value="collectionStore.form.single.copies"
                :min="0"
                :input-props="{ id: 'copies' }"
                :placeholder="collectionStore.form.single.copies"
                clearable
              />
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </div>
      <NftSingleProperties />
    </div>

    <Btn class="my-8" @click="handleSubmitForm">{{ $t('form.proceed') }}</Btn>
  </div>
</template>

<script lang="ts" setup>
import type { UploadInst } from 'naive-ui';
const nft = useNft();
const { t, te } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();

const { formRef, rulesSingle } = useCollection();

const uploadRef = ref<UploadInst | null>(null);

function infoLabel(field: string) {
  if (
    te(`form.label.${field}`) &&
    te(`nft.nft.labelInfo.${field}`) &&
    t(`nft.nft.labelInfo.${field}`)
  ) {
    return [
      h('span', { class: 'mr-1' }, t(`form.label.${field}`)),
      h(
        resolveComponent('IconInfo'),
        { size: 'sm', tooltip: t(`nft.collection.labelInfo.${field}`) },
        ''
      ),
    ];
  }
  return te(`form.label.${field}`) ? t(`form.label.${field}`) : field;
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

function handleSubmitForm(e: Event | MouseEvent) {
  e.preventDefault();
  collectionStore.metadata = [];

  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors || !collectionStore.hasImages) {
      if (!collectionStore.hasImages) {
        message.warning(t('validation.nft') || 'Error');
      }

      errors?.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      for (let index = 0; index < collectionStore.form.single.copies; index += 1) {
        collectionStore.metadata.push({ ...collectionStore.form.single });
        collectionStore.form.single.id += 1;
      }

      collectionStore.columns = createColumns(collectionStore.form.single);

      collectionStore.nftStep = NftCreateStep.PREVIEW;
      collectionStore.form.single.id -= collectionStore.form.single.copies;
    }
  });

  function createColumns(obj: Record<string, any>): { title: string; key: any }[] {
    const keysArray: { title: string; key: any }[] = [];

    Object.keys(obj).forEach(key => {
      if (key !== 'collectionUuid' && key !== 'copies' && key !== 'id') {
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
