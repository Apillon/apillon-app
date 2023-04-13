import { useMessage } from 'naive-ui';

export default function useNft() {
  const $i18n = useI18n();
  const message = useMessage();
  const { fileAlreadyOnFileList, uploadFiles } = useUpload();
  const collectionStore = useCollectionStore();
  const IconInfo = resolveComponent('IconInfo');

  const { vueApp } = useNuxtApp();
  const $papa = vueApp.config.globalProperties.$papa;

  const metadataRequired = ['name', 'description', 'image'];
  const metadataProperties = [
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
    const csvColumns: Array<string> = collectionStore.csvColumns.map(
      (item: NTableColumn<KeyTitle>) => {
        return (item as KeyTitle).key;
      }
    );
    return metadataRequired.every(item => csvColumns.includes(item));
  });
  const isCsvValid = computed<boolean>(() => {
    return isSameNumOfRows.value && hasRequiredMetadata.value;
  });

  /** Images */
  const allImagesUploaded = computed<boolean>(() => {
    if (collectionStore.images?.length !== collectionStore.csvData?.length) {
      return false;
    }

    const dataImages = collectionStore.csvData.map(item => {
      return item.image;
    });
    const imagesNames = collectionStore.images.map(item => {
      return item.name;
    });
    return compareArrays(dataImages, imagesNames);
  });
  const missingImages = computed<string>(() => {
    if (collectionStore.csvData.length - collectionStore.images.length > 5) {
      return '(' + collectionStore.images.length + '/' + collectionStore.csvData.length + ')';
    }
    const uploadedImagesNames = collectionStore.images.map(img => img.name);
    return collectionStore.csvData
      .filter(item => !uploadedImagesNames.includes(item.image))
      .map(item => item.image)
      .join(', ');
  });

  const imagesNames = computed<string>(() => {
    return collectionStore.csvData
      .map(item => {
        return item.image;
      })
      .join(',');
  });

  /**
   * CSV
   */

  /** Upload file request - add file to list */
  function uploadFileRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
    if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      console.warn(file.type);
      message.warning($i18n.t('validation.fileTypeNotCsv'));

      /** Mark file as failed */
      onError();
      return;
    }
    collectionStore.csvAttributes = [];
    collectionStore.csvFile = {
      ...file,
      percentage: 0,
      size: file.file?.size || 0,
      timestamp: Date.now(),
      onFinish,
      onError,
    };
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
          collectionStore.csvColumns = results.meta.fields.map(item => {
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
          attributes.push(attribute);
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
  function uploadImagesRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
    if (!isImage(file.type)) {
      message.warning($i18n.t('validation.notImage', { name: file.name }));
      return;
    }

    const image = {
      ...file,
      percentage: 0,
      size: file.file?.size || 0,
      timestamp: Date.now(),
      onFinish,
      onError,
    };

    if (!fileAlreadyOnFileList(collectionStore.images, image)) {
      collectionStore.images.push(image);
    }
  }

  function handleImageChange(options: {
    file: NUploadFileInfo;
    fileList: NUploadFileInfo[];
    event?: Event;
  }) {
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

  function handleImageRemove(data: { file: NUploadFileInfo; fileList: NUploadFileInfo[] }) {
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
  async function deployCollection() {
    try {
      const metadataSession = await uploadMetadata();
      const imagesSession = await uploadImages();

      const res = await $api.post<CollectionResponse>(
        endpoints.nftDeploy(collectionStore.active.collection_uuid),
        { metadataSession, imagesSession }
      );
      collectionStore.active = res.data;

      message.success($i18n.t('form.success.nftDeployed'));
    } catch (error) {
      message.error(userFriendlyMsg(error));
    }
  }

  async function uploadImages() {
    return await uploadFiles(
      collectionStore.active.bucket_uuid,
      collectionStore.images,
      false,
      true,
      false
    );
  }

  async function uploadMetadata() {
    const nftMetadataFiles = createNftFiles(collectionStore.metadata);

    return await uploadFiles(
      collectionStore.active.bucket_uuid,
      nftMetadataFiles,
      false,
      true,
      false
    );
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
        name: `${index + 1}.json`,
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

  function infoLabel(field: string) {
    if (
      $i18n.te(`form.label.${field}`) &&
      $i18n.te(`nft.collection.labelInfo.${field}`) &&
      $i18n.t(`nft.collection.labelInfo.${field}`)
    ) {
      return [
        h('span', { class: 'mr-1' }, $i18n.t(`form.label.${field}`)),
        h(IconInfo, { size: 'sm', tooltip: $i18n.t(`nft.collection.labelInfo.${field}`) }, ''),
      ];
    }
    return $i18n.te(`form.label.${field}`) ? $i18n.t(`form.label.${field}`) : field;
  }

  return {
    allImagesUploaded,
    hasRequiredMetadata,
    imagesNames,
    isCsvValid,
    isSameNumOfRows,
    metadataRequired,
    missingImages,
    createNftData,
    createThumbnailUrl,
    deployCollection,
    uploadImagesRequest,
    handleImageChange,
    handleImageRemove,
    infoLabel,
    isImage,
    parseUploadedFile,
    uploadFileRequest,
  };
}
