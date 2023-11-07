import { v4 as uuidv4 } from 'uuid';

export default function useUpload() {
  const $i18n = useI18n();
  const message = useMessage();
  const bucketStore = useBucketStore();
  const storageStore = useStorageStore();
  const config = useRuntimeConfig();

  const BASE_UPLOAD_SPEED = 1024;
  const bucketUuid = ref<string>('');
  const sessionUuid = ref<string>('');
  const totalFilesSize = ref<number>(0);
  const folderName = ref<string>('');
  const wrapToDirectory = ref<boolean>(false);
  const endSession = ref<boolean>(true);
  const fileList = ref<Array<FileListItemType>>([]);
  const clearFileList = ref<boolean>(false);
  const putRequests = ref<Array<any>>([]);

  /**
   * Computed
   */

  /** Calculate average upload speed from uploaded files */
  const avgUploadSpeed = computed<number>(() => {
    const uploadSpeeds = fileList.value.filter(item => (item.uploadSpeed || 0) > 0);
    if (uploadSpeeds.length === 0) {
      return BASE_UPLOAD_SPEED;
    }

    const sumSpeeds = fileList.value.reduce(
      (acc, file) => acc + (file.uploadSpeed || BASE_UPLOAD_SPEED),
      0
    );
    return sumSpeeds / uploadSpeeds.length;
  });

  /**
   *  Methods
   */
  /** Check if file is already on list */
  function fileAlreadyOnFileList(uploadFileList: Array<FileListItemType>, file: FileListItemType) {
    return uploadFileList.some(
      item =>
        item.name === file.name &&
        item.fullPath === file.fullPath &&
        item.file?.lastModified === file.file?.lastModified
    );
  }

  /** Check if file is too big (out of space) */
  function isEnoughSpaceInStorage(uploadFileList: Array<FileListItemType>, file: FileListItemType) {
    const availableSize = storageStore.info.availableStorage - storageStore.info.usedStorage;
    totalFilesSize.value = uploadFileList.reduce((acc, item) => {
      return acc + item.size;
    }, file.size);
    return totalFilesSize.value < availableSize;
  }

  async function uploadFiles(
    uploadBucketUuid: string,
    uploadFileList: Array<FileListItemType>,
    wrapFilesToDirectory: boolean = false,
    clearFileListOnFinish: boolean = false,
    endSessionOnUploadEnd: boolean = true
  ): Promise<string> {
    sessionUuid.value = uuidv4();
    bucketUuid.value = uploadBucketUuid;
    fileList.value = uploadFileList;
    wrapToDirectory.value = wrapFilesToDirectory;
    clearFileList.value = clearFileListOnFinish;
    endSession.value = endSessionOnUploadEnd;
    putRequests.value = [];

    /** Files data for upload params */
    const filesUpload: Array<UploadFileType> = fileList.value.map(file => {
      file.path = fileFolderPath(file.fullPath || '', wrapFilesToDirectory);

      return {
        fileName: file.name,
        contentType: file.type || getExtension(file.name),
        path: file.path,
      };
    });

    let availableSize = storageStore.info.availableStorage - storageStore.info.usedStorage;

    fileList.value.forEach(file => {
      availableSize -= file.size;
      if (availableSize < 0) {
        throw new ReferenceError('NOT_ENOUGH_STORAGE_SPACE');
      }

      createFileProgress(file);
      updateFileStatus(file, FileUploadStatusValue.UPLOADING);
    });

    const filesChunks = sliceIntoChunks(filesUpload, 200);

    for (let i = 0; i < filesChunks.length; i++) {
      if (filesChunks[i] && filesChunks[i].length > 0) {
        const params = {
          session_uuid: sessionUuid.value,
          files: filesChunks[i],
        };

        try {
          /** Upload files request */
          const fileRequests = await $api.post<FilesUploadRequestResponse>(
            endpoints.storageFilesUpload(bucketUuid.value),
            params
          );

          if (fileRequests.data) {
            await uploadFilesToS3(fileRequests.data.files);
          } else {
            /** Show warning message - zero files uploaded */
            message.warning($i18n.t('error.fileUploadStopped'));
          }
        } catch (error: any) {
          onUploadError();
          throw error;
        }
      }
    }

    return sessionUuid.value;
  }

  function uploadFilesToS3(uploadFilesRequests: S3FileUploadRequestInterface[]) {
    uploadFilesRequests.forEach(uploadFileRequest => {
      const file = fileList.value.find(
        file => file.name === uploadFileRequest.fileName && file.path === uploadFileRequest.path
      );
      if (file) {
        uploadFileToS3(file, uploadFileRequest);
      } else {
        /** Show warning message - file not found by name */
        message.warning($i18n.t('error.fileUploadMissing', { name: uploadFileRequest.fileName }));
      }
    });
  }

  async function uploadFileToS3(
    file: FileListItemType,
    uploadFilesRequest: S3FileUploadRequestInterface
  ) {
    try {
      /** Upload file to S3 using fetch */
      const req = fetch(uploadFilesRequest.url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: file.file,
      });
      putRequests.value.push(req);
      const res = await req;

      if (res.status !== 200) {
        throw new Error('File upload error');
      }

      file.onFinish();
      file.percentage = 100;
      updateFileStatus(file, FileUploadStatusValue.FINISHED);
      uploadSessionEnd(sessionUuid.value);
    } catch (error) {
      file.onError();
      updateFileStatus(file, FileUploadStatusValue.ERROR);
      uploadSessionEnd(sessionUuid.value);

      /** Show error message */
      message.error(userFriendlyMsg(error));
    }
  }

  /** Upload Session End  */
  async function uploadSessionEnd(sessionUuid: string) {
    const allFilesFinished = !fileList.value.some(
      file =>
        file.status === FileUploadStatusValue.PENDING ||
        file.status === FileUploadStatusValue.UPLOADING
    );

    if (!allFilesFinished || !endSession.value) {
      return;
    }
    try {
      const params: Record<string, string | number | boolean | null> = {
        directSync: config.public.ENV === AppEnv.LOCAL,
        wrapWithDirectory: wrapToDirectory.value,
        directoryPath: wrapToDirectory.value
          ? bucketStore.getFolderPath + wrapperFolderPath(folderName.value)
          : null,
      };
      await $api.post(endpoints.storageFileUpload(bucketUuid.value, sessionUuid), params);
    } catch (error) {
      message.error(userFriendlyMsg(error));
    }

    setTimeout(() => {
      /** Clear file list */
      if (clearFileList.value) {
        fileList.value.forEach(item => {
          if (item.status !== FileUploadStatusValue.FINISHED) {
            item.onError();
          }
        });
        while (fileList.value.length > 0) {
          fileList.value.pop();
        }
      }

      /** Refresh Storage info  */
      storageStore.fetchStorageInfo();
    }, 500);
  }

  /** Get folder path from fullPath */
  function fileFolderPath(fullPath: string, wrapFilesToDirectory: boolean): string {
    const parts = fullPath.split('/').filter(p => p);
    const filePath = parts.length <= 1 ? '' : parts.slice(0, -1).join('/') + '/';

    return wrapFilesToDirectory ? filePath : bucketStore.getFolderPath + filePath;
  }

  /** Get wrapper folder path from user's input */
  function wrapperFolderPath(path: string): string {
    if (path.length < 1) {
      return '';
    }
    return path
      .split('/')
      .filter(p => p)
      .join('/');
  }

  /** Update file status */
  function updateFileStatus(file: FileListItemType, status: FileUploadStatus) {
    file.status = status;

    if (status === FileUploadStatusValue.ERROR) {
      file.percentage = 0;
      clearInterval(file.progress);
    }
    if (status === FileUploadStatusValue.FINISHED) {
      /** Calculate upload speed */
      const timeDiff = Date.now() - file.timestamp;
      if (timeDiff > 0) {
        file.uploadSpeed = file.size / timeDiff;
      }

      /** Increase bucket size */
      if (bucketStore.active?.size) {
        bucketStore.active.size += file.size;
      } else {
        bucketStore.active.size = file.size;
      }
      if (bucketStore.active?.uploadedSize) {
        bucketStore.active.uploadedSize += file.size;
      } else {
        bucketStore.active.uploadedSize = file.size;
      }

      clearInterval(file.progress);
    }
  }

  /** Upload error - all file status change to error */
  function onUploadError() {
    fileList.value.forEach(file => {
      file.onError();
      updateFileStatus(file, FileUploadStatusValue.ERROR);
    });
  }

  /** Calculate file upload progress */
  function createFileProgress(file: FileListItemType) {
    const timeFor1Percent = file.size / 100 / avgUploadSpeed.value;

    file.progress = setInterval(() => {
      if (file.percentage < 100) {
        file.percentage += 1;
      }
    }, timeFor1Percent);
  }

  return {
    uploadFiles,
    fileAlreadyOnFileList,
    isEnoughSpaceInStorage,
    onUploadError,
    folderName,
    putRequests,
  };
}
