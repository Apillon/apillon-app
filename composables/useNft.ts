import type { UploadCustomRequestOptions } from 'naive-ui';
import { MetadataFieldRequired, type FormSingleNft } from '~/lib/types/nft';

export default function useNft() {
  const { t } = useI18n();
  const message = useMessage();
  const { putRequests, fileAlreadyOnFileList, isEnoughSpaceInStorage, uploadFiles } = useUpload();
  const collectionStore = useCollectionStore();

  const { vueApp } = useNuxtApp();
  const $papa = vueApp.config.globalProperties.$papa;

  const loadingImages = ref<boolean>(false);

  /**
   * Validation
   */

  /** CSV */
  const isSameNumOfRows = computed<boolean>(() => {
    return (
      collectionStore.active?.maxSupply === 0 || collectionStore.active?.maxSupply === collectionStore.csvData?.length
    );
  });
  const hasRequiredMetadata = computed<boolean>(() => {
    const columns: Array<string> = collectionStore.columns.map((item: NTableColumn<KeyTitle>) => {
      return (item as KeyTitle).key;
    });
    return enumValues(MetadataFieldRequired).every(item => columns.includes(`${item}`));
  });
  const isCsvValid = computed<boolean>(() => {
    return isSameNumOfRows.value && hasRequiredMetadata.value;
  });

  /** Images */
  const dataImagesNames = computed<string[]>(() => {
    const imgNames = collectionStore.csvData.map(item => item.image);
    return [...new Set(imgNames)];
  });
  const uploadedImagesNames = computed<string[]>(() => {
    return collectionStore.images.map(img => img.name);
  });

  const allImagesUploaded = computed<boolean>(() => {
    return compareArrays(dataImagesNames.value, uploadedImagesNames.value);
  });

  const missingImages = computed<string>(() => {
    if (dataImagesNames.value.length - collectionStore.images.length > 5) {
      return '(' + collectionStore.images.length + '/' + dataImagesNames.value.length + ')';
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
    collectionStore.csvAttributes = [];
    collectionStore.csvFile = uploadedFile;
    parseUploadedFile(collectionStore.csvFile.file);
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
          collectionStore.csvData = results.data;

          const fields = results.meta.fields;
          if (!fields.includes('id')) {
            fields.unshift('id');
          }
          collectionStore.columns = fields.map(item => {
            return {
              title: item,
              key: item,
            };
          });

          collectionStore.csvAttributes = results.meta.fields
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

          collectionStore.csvFile = {} as FileListItemType;
        }
      },
      error: function (error: string) {
        console.warn(error);

        collectionStore.csvFile = {} as FileListItemType;
      },
    });
  }

  /**
   * Prepare NFT data: array of JSONs with formatted properties and attributes
   */
  async function createNftDataAsync() {
    collectionStore.loadingMetadata = true;
    await sleep(0.01);
    collectionStore.metadata = createNftData();
    collectionStore.loadingMetadata = false;
  }
  function createNftData(): MetadataItem[] {
    return collectionStore.csvData.map((item, index) => {
      const nft: MetadataItem = {};
      Object.entries(item).forEach(([key, value]) => {
        if (!collectionStore.csvSelectedAttributes.includes(key)) {
          nft[key] = value;
        }
      });

      const attributes: AttributeInterface[] = [];
      collectionStore.csvAttributes.forEach(attribute => {
        if (collectionStore.csvSelectedAttributes.includes(attribute.value)) {
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
      collectionStore.metadata.push(JSON.parse(JSON.stringify(singleNft)) as MetadataItem);
      singleNft.id += 1;
    }

    const addKey = (key: string, title: string) => {
      if (!collectionStore.columns.some(c => c.key === key)) collectionStore.columns.push({ title, key });
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

    collectionStore.resetSingleFormData(false);
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
    } else if (!isEnoughSpaceInStorage(collectionStore.images, file.file)) {
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
    if (collectionStore.stepMetadata === NftMetadataStep.SINGLE) {
      collectionStore.form.single.image = image.name;
    }

    if (fileAlreadyOnFileList(collectionStore.images, image)) {
      message.warning(t('validation.alreadyOnList', { name: file.name }));
    } else if (fileAlreadyOnFileList(collectionStore.images, image, true)) {
      collectionStore.images = collectionStore.images.map(img => {
        return image.name === img.name ? image : img;
      });
    } else {
      collectionStore.images.push(image);
    }

    setTimeout(() => {
      loadingImages.value = false;
    }, 300);
  }

  function handleImageRemove(data: FileUploadOptions) {
    collectionStore.images = collectionStore.images.filter(item => item.id !== data.file.id);
  }

  function isImage(type: string | null = '') {
    if (!type) return false;
    return type.includes('image/');
  }

  function createThumbnailUrl(file: FileListItemType): string {
    return file.file ? URL.createObjectURL(file.file) : '';
  }

  function imageByName(name: string = '') {
    const image = collectionStore.images.find(img => img.name === name);
    return image ? createThumbnailUrl(image) : '';
  }

  /**
   * Deploy NFT with metadata
   */
  async function deployCollection(deploy: boolean = false) {
    const nftMetadataFiles = createNftFiles(collectionStore.metadata);
    const metadataSession = await uploadFiles(collectionStore.active.bucket_uuid, nftMetadataFiles, false, true, false);
    const imagesSession = await uploadFiles(
      collectionStore.active.bucket_uuid,
      collectionStore.images,
      false,
      true,
      false
    );

    const endpoint = deploy
      ? endpoints.nftDeploy(collectionStore.active.collection_uuid)
      : endpoints.collectionNftsMetadata(collectionStore.active.collection_uuid);

    await Promise.all(putRequests.value).then(async _ => {
      if (!!metadataSession && !!imagesSession) {
        const useApillonIpfsGateway =
          !deployCollection && collectionStore.active?.collection_uuid
            ? collectionStore.active.useApillonIpfsGateway
            : collectionStore.form.behavior.useApillonIpfsGateway;
        const useIpns =
          !deployCollection && collectionStore.active?.collection_uuid
            ? collectionStore.active.useIpns
            : collectionStore.form.behavior.useIpns;

        const res = await $api.post<CollectionResponse>(endpoint, {
          useApillonIpfsGateway,
          useIpns,
          metadataSession,
          imagesSession,
        });
        if (deploy) {
          collectionStore.active = res.data;
        }

        collectionStore.metadata = [];

        message.success(t('form.success.nftDeployed'));

        /** Reset timestamp to SS */
        sessionStorage.removeItem(LsCacheKeys.COLLECTIONS);
        sessionStorage.removeItem(LsCacheKeys.COLLECTION_METADATA);
      } else {
        message.error(t('nft.upload.deployError'));
      }
    });
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

  function getPriceServiceName() {
    const chain = collectionStore.form.behavior?.chain
      ? collectionStore.form.behavior.chain
      : collectionStore.active.chain;
    return generatePriceServiceName(ServiceTypeName.NFT, chain, PriceServiceAction.COLLECTION);
  }

  async function uploadLogoAndCover(bucketUuid: string) {
    const images: FileListItemType[] = [];
    const cover = collectionStore.form.base.coverImage;
    const logo = collectionStore.form.base.logo;

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
