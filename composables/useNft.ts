import type { UploadCustomRequestOptions } from 'naive-ui';

export default function useNft() {
  const $i18n = useI18n();
  const message = useMessage();
  const { putRequests, fileAlreadyOnFileList, isEnoughSpaceInStorage, uploadFiles } = useUpload();
  const collectionStore = useCollectionStore();

  const { vueApp } = useNuxtApp();
  const $papa = vueApp.config.globalProperties.$papa;

  const loadingImages = ref<boolean>(false);
  const metadataRequired = ['name', 'description', 'image'];
  const metadataProperties = [
    'id',
    'name',
    'description',
    'external_url',
    'image',
    'image_data',
    'attributes',
    'background_color',
    'animation_url',
    'youtube_url',
  ];

  /**
   * Validation
   */

  /** CSV */
  const isSameNumOfRows = computed<boolean>(() => {
    return (
      collectionStore.active?.maxSupply === 0 ||
      collectionStore.active?.maxSupply === collectionStore.csvData?.length
    );
  });
  const hasRequiredMetadata = computed<boolean>(() => {
    const columns: Array<string> = collectionStore.columns.map((item: NTableColumn<KeyTitle>) => {
      return (item as KeyTitle).key;
    });
    return metadataRequired.every(item => columns.includes(item));
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
      return '(' + collectionStore.images.length + '/' + collectionStore.csvData.length + ')';
    }

    const missingImagesName = dataImagesNames.value.filter(
      item => !uploadedImagesNames.value.includes(item)
    );

    return [...new Set(missingImagesName)].join(', ');
  });

  /**
   * CSV
   */

  /** Upload file request - add file to list */
  function uploadFileRequest({ file, onError, onFinish }: UploadCustomRequestOptions) {
    const uploadedFile: FileListItemType = {
      ...file,
      percentage: 0,
      size: file.file?.size || 0,
      timestamp: Date.now(),
      onFinish,
      onError,
    };
    if (!isEnoughSpaceInStorage([], uploadedFile)) {
      message.warning($i18n.t('validation.notEnoughSpaceInStorage', { name: file.name }));

      /** Mark file as failed */
      onError();
      return;
    } else if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      message.warning($i18n.t('validation.fileTypeNotCsv'));

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
          collectionStore.columns = results.meta.fields.map(item => {
            return {
              title: item,
              key: item,
            };
          });
          collectionStore.csvAttributes = results.meta.fields
            .filter(item => !metadataProperties.includes(item))
            .map(item => {
              return {
                value: item,
                label: item,
                display_type: 'string',
              };
            });
        } else {
          message.warning($i18n.t('validation.fileNoData'));

          collectionStore.csvFile.onError();
          collectionStore.csvFile = {} as FileListItemType;
        }
      },
      error: function (error: string) {
        console.warn(error);

        collectionStore.csvFile.onError();
        collectionStore.csvFile = {} as FileListItemType;
      },
    });
  }

  /**
   * Prepare NFT data: array of JSONs with formatted properties and attributes
   */
  function createNftData(): Array<Record<string, any>> {
    return collectionStore.csvData.map(item => {
      const nft: Record<string, any> = {};
      Object.entries(item).forEach(([key, value]) => {
        if (!collectionStore.csvSelectedAttributes.includes(key)) {
          nft[key] = value;
        }
      });

      const attributes: Array<Record<string, any>> = [];
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
      return nft;
    });
  }

  /**
   * Images
   */

  /** Upload image request - add file to list */
  function uploadImagesRequest({
    file,
    onProgress,
    onError,
    onFinish,
  }: UploadCustomRequestOptions) {
    if (!isImage(file.type)) {
      message.warning($i18n.t('validation.notImage', { name: file.name }));
      onError();
      return;
    }

    const image = {
      ...file,
      fullPath: `/Images${file.fullPath}`,
      percentage: 0,
      size: file.file?.size || 0,
      timestamp: Date.now(),
      onFinish,
      onError,
    };

    if (!isEnoughSpaceInStorage(collectionStore.images, image)) {
      message.warning($i18n.t('validation.notEnoughSpaceInStorage', { name: file.name }));
      onError();
    } else if (fileAlreadyOnFileList(collectionStore.images, image)) {
      message.warning($i18n.t('validation.alreadyOnList', { name: file.name }));
      onError();
    } else if (collectionStore.images.length >= collectionStore.csvData.length) {
      message.warning($i18n.t('validation.tooManyImages', { num: collectionStore.csvData.length }));
      onError();
    } else {
      onProgress({ percent: 0 });
      collectionStore.images.push(image);
    }

    setTimeout(() => {
      loadingImages.value = false;
    }, 300);
  }

  function uploadImageRequest({ file, onError, onFinish }: UploadCustomRequestOptions) {
    if (!isImage(file.type)) {
      message.warning($i18n.t('validation.notImage', { name: file.name }));
      onError();
      return;
    }

    const image = {
      ...file,
      fullPath: `/Images${file.fullPath}`,
      percentage: 0,
      size: file.file?.size || 0,
      timestamp: Date.now(),
      onFinish,
      onError,
    };

    if (!isEnoughSpaceInStorage(collectionStore.images, image)) {
      message.warning($i18n.t('validation.notEnoughSpaceInStorage', { name: file.name }));
      onError();
    } else if (fileAlreadyOnFileList(collectionStore.images, image)) {
      message.warning($i18n.t('validation.alreadyOnList', { name: file.name }));
      onError();
    } else {
      if (collectionStore.amount === NftAmount.SINGLE) {
        collectionStore.form.single.image = image.name;
      }
      collectionStore.images.push(image);
    }

    setTimeout(() => {
      loadingImages.value = false;
    }, 300);
  }

  function handleImageChange(options: FileUploadOptions) {
    const index = options.fileList.indexOf(options.file);
    const indexImage = collectionStore.images.findIndex(
      item => item.name === options.file.name && item.fullPath === options.file.fullPath
    );

    if (!isImage(options.file.type)) {
      options.fileList.splice(index, 1);
      message.warning($i18n.t('validation.notImage', { name: options.file.name }));
    } else if (indexImage !== -1) {
      options.fileList.splice(index, 1);
      if (!allImagesUploaded.value) {
        message.warning($i18n.t('validation.alreadyOnList', { name: options.file.name }));
      }
    }
  }

  function handleImageRemove(data: FileUploadOptions) {
    collectionStore.images = collectionStore.images.filter(item => item.id !== data.file.id);
  }

  function isImage(type: string | null = '') {
    if (!type) return false;
    return type.includes('image/');
  }

  function createThumbnailUrl(file: FileListItemType): string {
    if (file.file) {
      return window.URL.createObjectURL(file.file);
    }
    return '';
  }

  /**
   * Deploy NFT with metadata
   */
  async function deployCollection(metadata: boolean = false) {
    const nftMetadataFiles = createNftFiles(collectionStore.metadata);
    const metadataSession = await uploadFiles(
      collectionStore.active.bucket_uuid,
      nftMetadataFiles,
      false,
      true,
      false
    );
    const imagesSession = await uploadFiles(
      collectionStore.active.bucket_uuid,
      collectionStore.images,
      false,
      true,
      false
    );

    const endpoint = metadata
      ? endpoints.collectionNftsMetadata(collectionStore.active.collection_uuid)
      : endpoints.nftDeploy(collectionStore.active.collection_uuid);

    await Promise.all(putRequests.value).then(async _ => {
      if (!!metadataSession && !!imagesSession) {
        const res = await $api.post<CollectionResponse>(endpoint, {
          useApillonIpfsGateway: collectionStore.form.base.useApillonIpfsGateway,
          metadataSession,
          imagesSession,
        });
        collectionStore.active = res.data;

        message.success($i18n.t('form.success.nftDeployed'));
      } else {
        message.error($i18n.t('nft.upload.deployError'));
      }
    });

    if (metadata) {
      collectionStore.metadata = [];
    }
  }

  /**
   * Prepare NFT files: parse NFT data to JSON files
   */
  function createNftFiles(nftData: Array<Record<string, any>>): FileListItemType[] {
    return nftData.map((nft, index) => {
      const nftFile = new Blob([JSON.stringify(nft, null, 2)], {
        type: 'application/json',
      });

      return {
        id: `${index + 1}-${nft.name}`,
        name: nft.id ? `${nft.id}.json` : `${index + 1}.json`,
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
    return generatePriceServiceName(
      ServiceTypeName.NFT,
      collectionStore.form.base.chain,
      PriceServiceAction.COLLECTION
    );
  }

  return {
    allImagesUploaded,
    dataImagesNames,
    hasRequiredMetadata,
    isCsvValid,
    isSameNumOfRows,
    loadingImages,
    metadataRequired,
    missingImages,
    createNftData,
    createThumbnailUrl,
    deployCollection,
    getPriceServiceName,
    handleImageChange,
    handleImageRemove,
    isImage,
    parseUploadedFile,
    uploadFileRequest,
    uploadImagesRequest,
    uploadImageRequest,
  };
}
