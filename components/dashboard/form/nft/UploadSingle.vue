<template>
  <div>
    <h2>{{ $t('nft.create') }}</h2>
    <div class="my-8">
      <h4>{{ $t('nft.single.content') }}</h4>
      <p class="w-2/3">
        {{ $t('nft.single.uploadDescription') }}
      </p>
      <div v-if="collectionStore.images.length > 0">
        <div class="bg-bg-light rounded-xl overflow-hidden w-72">
          <figure class="flex flex-col h-full">
            <Image
              :src="imageByName(collectionStore.images[0]?.name)"
              class="w-full h-full object-contain"
              :alt="collectionStore.images[0]?.name"
            />
            <figcaption class="block h-12 px-4 py-3 font-bold">
              {{ collectionStore.images[0]?.name }}
              <button
                class="flex justify-center items-center p-1 float-right"
                @click="removeImages()"
              >
                <span class="icon-delete text-xl"></span>
              </button>
            </figcaption>
          </figure>
        </div>
      </div>
      <div v-else>
        <n-upload
          ref="uploadRef"
          accept="image/png, image/jpeg"
          :default-file-list="collectionStore.images"
          :show-file-list="false"
          :max="1"
          multiple
          directory-dnd
          :custom-request="nft.uploadImageRequest"
          @change="onUploadChange"
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
    </div>

    <div class="mb-4">
      <h4>{{ $t('nft.single.technicalDetails') }}</h4>
    </div>

    <div class="flex gap-4">
      <div>
        <n-form
          ref="formRef"
          class="max-w-xl"
          :model="collectionStore.form.single"
          :rules="rulesSingle"
          @submit.prevent="handleSubmitForm"
        >
          <n-grid class="items-end" :cols="12" :x-gap="32">
            <!-- Collection -->
            <n-form-item-gi
              :span="12"
              path="collection"
              :label="infoLabel('nftCollection')"
              :label-props="{ for: 'collection' }"
            >
              <select-options
                v-model:value="collectionStore.form.single.collectionUuid"
                :options="collections"
                :input-props="{ id: 'collection' }"
                :placeholder="$t('general.pleaseSelect')"
                filterable
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

            <!-- Royalties -->
            <n-form-item-gi
              :span="12"
              path="royalties"
              :label="infoLabel('nftRoyalties')"
              :label-props="{ for: 'royalties' }"
            >
              <n-input
                v-model:value="collectionStore.form.single.royalties"
                :input-props="{ id: 'royalties' }"
                :placeholder="$t('general.typeHere')"
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
          </n-grid>
        </n-form>
      </div>
      <FormNftPropertiesSingle />
    </div>

    <Btn class="my-8" @click="handleSubmitForm">proceed and deploy</Btn>
  </div>
</template>

<script lang="ts" setup>
import type { UploadInst } from 'naive-ui';
const nft = useNft();
const $i18n = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();

const { formRef, rulesSingle } = useCollection();

const emit = defineEmits(['submit']);

const uploadRef = ref<UploadInst | null>(null);
const collections = ref<Array<{ label: string; value: string }>>([]);

onBeforeMount(() => {
  collectionStore.items.forEach(item => {
    if (item.collectionStatus === CollectionStatus.DEPLOYED) {
      const collection: { label: string; value: string } = {
        label: item.name,
        value: item.collection_uuid,
      };
      collections.value.push(collection);
    }
  });
});

function infoLabel(field: string) {
  if (
    $i18n.te(`form.label.${field}`) &&
    $i18n.te(`nft.nft.labelInfo.${field}`) &&
    $i18n.t(`nft.nft.labelInfo.${field}`)
  ) {
    return [
      h('span', { class: 'mr-1' }, $i18n.t(`form.label.${field}`)),
      h(
        resolveComponent('IconInfo'),
        { size: 'sm', tooltip: $i18n.t(`nft.collection.labelInfo.${field}`) },
        ''
      ),
    ];
  }
  return $i18n.te(`form.label.${field}`) ? $i18n.t(`form.label.${field}`) : field;
}

function onUploadChange(options: FileUploadOptions) {
  nft.handleImageChange(options);
}

function removeImages() {
  collectionStore.resetImages();
  uploadRef.value?.clear();
}

function imageByName(name: string = '') {
  const image = collectionStore.images.find(img => img.name === name);
  return image ? nft.createThumbnailUrl(image) : '';
}

function handleSubmitForm(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      emit('submit');
    }
  });
}
</script>
