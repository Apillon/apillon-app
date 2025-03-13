import type { UploadCustomRequestOptions } from 'naive-ui';
import { MetadataFieldRequired, type FormSingleNft } from '~/lib/types/nft';

export default function useNft() {
  const { t } = useI18n();
  const message = useMessage();
  const { putRequests, fileAlreadyOnFileList, isEnoughSpaceInStorage, uploadFiles } = useUpload();
  const metadataStore = useMetadataStore();

  const { vueApp } = useNuxtApp();
  const $papa = vueApp.config.globalProperties.$papa;

  const loadingImages = ref<boolean>(false);

  /**
   * Validation
   */

  /** CSV */
  const isSameNumOfRows = computed<boolean>(() => {
    return collection?.maxSupply === 0 || collection?.maxSupply === metadataStore.csvData?.length;
  });
  const hasRequiredMetadata = computed<boolean>(() => {
    const columns: Array<string> = metadataStore.columns.map((item: NTableColumn<KeyTitle>) => {
      return (item as KeyTitle).key;
    });
    return enumValues(MetadataFieldRequired).every(item => columns.includes(`${item}`));
  });
  const isCsvValid = computed<boolean>(() => {
    return isSameNumOfRows.value && hasRequiredMetadata.value;
  });

  /** Images */
  const dataImagesNames = computed<string[]>(() => {
    const imgNames = metadataStore.csvData.map(item => item.image);
    return [...new Set(imgNames)];
  });
  const uploadedImagesNames = computed<string[]>(() => {
    return metadataStore.images.map(img => img.name);
  });

  const allImagesUploaded = computed<boolean>(() => {
    return compareArrays(dataImagesNames.value, uploadedImagesNames.value);
  });

  const missingImages = computed<string>(() => {
    if (dataImagesNames.value.length - metadataStore.images.length > 5) {
      return '(' + metadataStore.images.length + '/' + dataImagesNames.value.length + ')';
    }

    const missingImagesName = dataImagesNames.value.filter(item => !uploadedImagesNames.value.includes(item));

    return [...new Set(missingImagesName)].join(', ');
  });

  /**
   * CSV
   */

  /** Upload file request - add file to list */
  function uploadFileRequest({ file, onError, onFinish }: UploadCustomRequestOptions) {
    const uploadedFile: FileListItemType = {
      ...file,
      path: file.fullPath,
      percentage: 0,
      size: file.file?.size || 0,
      timestamp: Date.now(),
      onFinish,
      onError,
    };

    if (!isEnoughSpaceInStorage([], uploadedFile)) {
      message.warning(t('validation.notEnoughSpaceInStorage', { name: file.name }));

      /** Mark file as failed */
      onError();
      return;
    } else if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      message.warning(t('validation.fileTypeNotCsv'));

      /** Mark file as failed */
      onError();
      return;
    }
    metadataStore.csvAttributes = [];
    metadataStore.csvFile = uploadedFile;
    parseUploadedFile(metadataStore.csvFile.file);
  }

  /**
   * Parse CSV file and prepare data, columns and attributes
   */
  function parseUploadedFile(file?: File | null) {
    if (!file) {
      return;
    }

    $papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results: CsvFileData) {
        if (results.data.length) {
          metadataStore.csvData = results.data;

          const fields = results.meta.fields;
          if (!fields.includes('id')) {
            fields.unshift('id');
          }
          metadataStore.columns = fields.map(item => {
            return {
              title: item,
              key: item,
            };
          });

          metadataStore.csvAttributes = results.meta.fields
            .filter(item => !enumValues(MetadataProperties).includes(item))
            .map(item => {
              return {
                value: item,
                label: item,
                display_type: 'string',
              };
            });
        } else {
          message.warning(t('validation.fileNoData'));

          metadataStore.csvFile = {} as FileListItemType;
        }
      },
      error: function (error: string) {
        console.warn(error);

        metadataStore.csvFile = {} as FileListItemType;
      },
    });
  }

  /**
   * Prepare NFT data: array of JSONs with formatted properties and attributes
   */
  async function createNftDataAsync() {
    metadataStore.loadingMetadata = true;
    await sleep(0.01);
    metadataStore.metadata = createNftData();
    metadataStore.loadingMetadata = false;
  }
  function createNftData(): MetadataItem[] {
    return metadataStore.csvData.map((item, index) => {
      const nft: MetadataItem = {};
      Object.entries(item).forEach(([key, value]) => {
        if (!metadataStore.csvSelectedAttributes.includes(key)) {
          nft[key] = value;
        }
      });

      const attributes: AttributeInterface[] = [];
      metadataStore.csvAttributes.forEach(attribute => {
        if (metadataStore.csvSelectedAttributes.includes(attribute.value)) {
          attributes.push({
            value: item[attribute.value],
            trait_type: attribute.value,
            display_type: attribute.display_type,
          });
        }
      });
      if (attributes.length > 0) {
        nft.attributes = attributes;
      }
      if (!item?.id) {
        nft.id = index + 1;
      }
      return nft;
    });
  }

  /**
   * Add single NFT
   */
  function createSingleNft(singleNft: FormSingleNft) {
    for (let index = 0; index < singleNft.copies; index += 1) {
      metadataStore.metadata.push(JSON.parse(JSON.stringify(singleNft)) as MetadataItem);
      singleNft.id += 1;
    }

    const addKey = (key: string, title: string) => {
      if (!metadataStore.columns.some(c => c.key === key)) metadataStore.columns.push({ title, key });
    };
    Object.entries(singleNft).forEach(([key, value]) => {
      if (key !== 'collectionUuid' && key !== 'copies') {
        if (Array.isArray(value)) {
          value.forEach((item: AttributeInterface, index: number) => {
            addKey(`${key}[${index}].value`, item.trait_type);
          });
        } else {
          addKey(key, key);
        }
      }
    });

    metadataStore.resetSingleFormData(false);
  }

  /**
   * Images
   */

  /** Upload image request - add file to list */
  async function uploadImageRequest({ file }, wrapToFolder = true) {
    await sleep(0.01);
    if (!isImage(file.type)) {
      message.warning(t('validation.notImage', { name: file.name }));
      return;
    } else if (!isEnoughSpaceInStorage(metadataStore.images, file.file)) {
      message.warning(t('validation.notEnoughSpaceInStorage', { name: file.name }));
      return;
    }
    loadingImages.value = true;

    const image = {
      ...file,
      path: wrapToFolder ? `/Images/${file.name}` : file.name,
      percentage: 0,
      size: file.file?.size || 0,
      timestamp: Date.now(),
    };
    if (metadataStore.stepMetadata === NftMetadataStep.SINGLE) {
      metadataStore.form.single.image = image.name;
    }

    if (fileAlreadyOnFileList(metadataStore.images, image)) {
      message.warning(t('validation.alreadyOnList', { name: file.name }));
    } else if (fileAlreadyOnFileList(metadataStore.images, image, true)) {
      metadataStore.images = metadataStore.images.map(img => {
        return image.name === img.name ? image : img;
      });
    } else {
      metadataStore.images.push(image);
    }

    setTimeout(() => {
      loadingImages.value = false;
    }, 300);
  }

  function handleImageRemove(data: FileUploadOptions) {
    metadataStore.images = metadataStore.images.filter(item => item.id !== data.file.id);
  }

  function isImage(type: string | null = '') {
    if (!type) return false;
    return type.includes('image/');
  }

  function createThumbnailUrl(file: FileListItemType): string {
    return file.file ? URL.createObjectURL(file.file) : '';
  }

  function imageByName(name: string = '') {
    const image = metadataStore.images.find(img => img.name === name);
    return image ? createThumbnailUrl(image) : '';
  }

  /**
   * Deploy NFT with metadata
   */
  async function deployCollection(collection: CollectionInterface, deploy: boolean = false) {
    const nftMetadataFiles = createNftFiles(metadataStore.metadata);
    const metadataSession = await uploadFiles(collection.bucket_uuid, nftMetadataFiles, false, true, false);
    const imagesSession = await uploadFiles(collection.bucket_uuid, metadataStore.images, false, true, false);

    const endpoint = deploy
      ? endpoints.nftDeploy(collection.collection_uuid)
      : endpoints.collectionNftsMetadata(collection.collection_uuid);

    await Promise.all(putRequests.value);

    if (!metadataSession || !imagesSession) {
      message.error(t('nft.upload.deployError'));
      return null;
    }

    const useApillonIpfsGateway =
      !deploy && collection?.collection_uuid
        ? collection.useApillonIpfsGateway
        : metadataStore.form.smartContract.useApillonIpfsGateway;
    const useIpns =
      !deploy && collection?.collection_uuid ? collection.useIpns : metadataStore.form.smartContract.useIpns;

    const { data } = await $api.post<CollectionResponse>(endpoint, {
      useApillonIpfsGateway,
      useIpns,
      metadataSession,
      imagesSession,
    });

    metadataStore.resetMetadata();

    message.success(t('form.success.nftDeployed'));

    /** Reset timestamp to SS */
    sessionStorage.removeItem(LsCacheKeys.COLLECTIONS);
    sessionStorage.removeItem(LsCacheKeys.COLLECTION_METADATA);

    return data;
  }

  /**
   * Prepare NFT files: parse NFT data to JSON files
   */
  function createNftFiles(nftData: Array<MetadataItem>): FileListItemType[] {
    return nftData.map((nft, index) => {
      const id = nft.id === undefined ? index + 1 : Number(nft.id);

      /** Prepare NFT data */
      const nftData = JSON.parse(JSON.stringify(nft));
      delete nftData.id;
      delete nftData.copies;

      const nftFile = new Blob([JSON.stringify(nftData, null, 2)], {
        type: 'application/json',
      });

      return {
        id: `${id}-${nft.name}`,
        name: `${id}.json`,
        status: 'pending',
        percentage: 0,
        file: nftFile,
        type: nftFile.type,
        size: nftFile.size || 0,
        timestamp: Date.now(),
        onFinish: () => {},
        onError: () => {},
      } as FileListItemType;
    });
  }

  function getPriceServiceName(chanId?: number) {
    const chain = chanId || metadataStore.form.smartContract.chain || useCollectionStore().active.chain;
    return generatePriceServiceName(ServiceTypeName.NFT, chain, PriceServiceAction.COLLECTION);
  }

  async function uploadLogoAndCover(bucketUuid: string) {
    const images: FileListItemType[] = [];
    const cover = metadataStore.form.visual.coverImage;
    const logo = metadataStore.form.visual.logo;

    if (logo) {
      logo.name = 'logo.' + logo.name.split('.')[logo.name.split('.').length - 1];
      images.push(logo);
    }
    if (cover) {
      cover.name = 'cover.' + cover.name.split('.')[cover.name.split('.').length - 1];
      images.push(cover);
    }
    if (images.length) {
      await uploadFiles(bucketUuid, images);
    }
  }

  return {
    allImagesUploaded,
    dataImagesNames,
    hasRequiredMetadata,
    isCsvValid,
    isSameNumOfRows,
    loadingImages,
    missingImages,
    createNftData,
    createNftDataAsync,
    createSingleNft,
    createThumbnailUrl,
    deployCollection,
    getPriceServiceName,
    handleImageRemove,
    isImage,
    imageByName,
    parseUploadedFile,
    uploadFileRequest,
    uploadImageRequest,
    uploadLogoAndCover,
  };
}
