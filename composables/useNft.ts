import type { UploadCustomRequestOptions } from 'naive-ui';

export default function useNft() {
  const { t } = useI18n();
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
            .filter(item => !metadataProperties.includes(item))
            .map(item => {
              return {
                value: item,
                label: item,
                display_type: 'string',
              };
            });
        } else {
          message.warning(t('validation.fileNoData'));

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
    return collectionStore.csvData.map((item, index) => {
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
      if (!item?.id) {
        nft.id = index + 1;
      }
      return nft;
    });
  }

  /**
   * Images
   */

  /** Upload image request - add file to list */
  function uploadImagesRequest(
    { file, onProgress, onError, onFinish }: UploadCustomRequestOptions,
    wrapToFolder = true
  ) {
    if (!isImage(file.type)) {
      message.warning(t('validation.notImage', { name: file.name }));
      onError();
      return;
    }

    const image = {
      ...file,
      fullPath: wrapToFolder ? `/Images${file.name}` : file.name,
      percentage: 0,
      size: file.file?.size || 0,
      timestamp: Date.now(),
      onFinish,
      onError,
    };

    if (!isEnoughSpaceInStorage(collectionStore.images, image)) {
      message.warning(t('validation.notEnoughSpaceInStorage', { name: file.name }));
      onError();
    } else if (fileAlreadyOnFileList(collectionStore.images, image)) {
      message.warning(t('validation.alreadyOnList', { name: file.name }));
      onError();
    } else if (collectionStore.images.length >= collectionStore.csvData.length) {
      message.warning(t('validation.tooManyImages', { num: collectionStore.csvData.length }));
      onError();
    } else {
      onProgress({ percent: 0 });
      collectionStore.images.push(image);
    }

    setTimeout(() => {
      loadingImages.value = false;
    }, 300);
  }

  function uploadImageRequest(
    { file, onError, onFinish }: UploadCustomRequestOptions,
    wrapToFolder = true
  ) {
    if (!isImage(file.type)) {
      message.warning(t('validation.notImage', { name: file.name }));
      onError();
      return;
    }

    const image = {
      ...file,
      fullPath: wrapToFolder ? `/Images/${file.name}` : file.name,
      percentage: 0,
      size: file.file?.size || 0,
      timestamp: Date.now(),
      onFinish,
      onError,
    };

    if (collectionStore.amount === NftAmount.SINGLE) {
      collectionStore.form.single.image = image.name;
    }

    if (!isEnoughSpaceInStorage(collectionStore.images, image)) {
      message.warning(t('validation.notEnoughSpaceInStorage', { name: file.name }));
      onError();
    } else if (fileAlreadyOnFileList(collectionStore.images, image)) {
      console.warn(t('validation.alreadyOnList', { name: file.name }));
      onError();
    } else if (fileAlreadyOnFileList(collectionStore.images, image, true)) {
      collectionStore.images = collectionStore.images.map(img => {
        return image.name === img.name ? image : img;
      });
      onError();
    } else {
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
      message.warning(t('validation.notImage', { name: options.file.name }));
    } else if (indexImage !== -1) {
      options.fileList.splice(index, 1);
      if (!allImagesUploaded.value) {
        message.warning(t('validation.alreadyOnList', { name: options.file.name }));
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
  async function deployCollection(deployCollection: boolean = false) {
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

    const endpoint = deployCollection
      ? endpoints.nftDeploy(collectionStore.active.collection_uuid)
      : endpoints.collectionNftsMetadata(collectionStore.active.collection_uuid);

    await Promise.all(putRequests.value).then(async _ => {
      if (!!metadataSession && !!imagesSession) {
        const res = await $api.post<CollectionResponse>(endpoint, {
          useApillonIpfsGateway: collectionStore.form.base.useApillonIpfsGateway,
          useIpns: collectionStore.form.base.useIpns,
          metadataSession,
          imagesSession,
        });
        if (deployCollection) {
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
  function createNftFiles(nftData: Array<Record<string, any>>): FileListItemType[] {
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
    const chain = collectionStore.form.base?.chain
      ? collectionStore.form.base.chain
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
    uploadLogoAndCover,
  };
}
