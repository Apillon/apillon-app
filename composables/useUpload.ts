import { useMessage } from 'naive-ui';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';

export default function useUpload() {
  const $i18n = useI18n();
  const message = useMessage();
  const dataStore = useDataStore();
  const config = useRuntimeConfig();

  const BASE_UPLOAD_SPEED = 1024;
  const bucketUuid = ref<string>('');
  const sessionUuid = ref<string>('');
  const folderName = ref<string>('');

  /**
   * Copmuted
   */

  /** Calculate average upload speed from uploaded files */
  const avgUploadSpeed = computed(() => {
    const uploadSpeeds = dataStore.bucket.uploadFileList.filter(
      item => (item.uploadSpeed || 0) > 0
    );
    if (uploadSpeeds.length === 0) {
      return BASE_UPLOAD_SPEED;
    }

    const sumSpeeds = dataStore.bucket.uploadFileList.reduce(
      (acc, file) => acc + (file.uploadSpeed || BASE_UPLOAD_SPEED),
      0
    );
    return sumSpeeds / uploadSpeeds.length;
  });

  /** Check if all files are finished (status FINISH or ERROR) */
  const allFilesFinished = computed<boolean>(() => {
    return (
      dataStore.bucket.uploadFileList.find(
        file =>
          file.status !== FileUploadStatusValue.FINISHED &&
          file.status !== FileUploadStatusValue.ERROR
      ) === undefined
    );
  });

  /** Check if all files are finished (status FINISH or ERROR) */
  const allFilesSuccess = computed<boolean>(() => {
    return (
      dataStore.bucket.uploadFileList.find(
        file => file.status !== FileUploadStatusValue.FINISHED
      ) === undefined
    );
  });

  /** Check if any file is uploading (status UPLOADING) */
  const filesUploading = computed<boolean>(() => {
    return (
      dataStore.bucket.uploadFileList.find(
        file => file.status === FileUploadStatusValue.UPLOADING
      ) !== undefined
    );
  });

  /** Num of uploaded files (status UPLOADING/FINISHED) */
  const numOfUploadedFiles = computed<number>(() => {
    return (
      dataStore.bucket.uploadFileList.filter(file => file.status !== FileUploadStatusValue.PENDING)
        .length || 0
    );
  });

  /**
   *
   * @param  Methods
   */

  /** Upload file request - add file to list */
  function uploadFilesRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
    const fileListItem: FileListItemType = {
      ...file,
      percentage: 0,
      size: file.file?.size || 0,
      timestamp: Date.now(),
      onFinish,
      onError,
    };

    if (fileAlreadyOnFileList(fileListItem)) {
      onError();
    } else {
      dataStore.bucket.uploadFileList.push(fileListItem);
    }
  }

  /** Check if file is already on list */
  function fileAlreadyOnFileList(file: FileListItemType) {
    return (
      dataStore.bucket.uploadFileList.find(
        item =>
          item.name === file.name &&
          item.fullPath === file.fullPath &&
          item.file?.lastModified === file.file?.lastModified
      ) !== undefined
    );
  }

  async function uploadFiles(uploadBucketUuid: string, wrapToDirectory: boolean = false) {
    bucketUuid.value = uploadBucketUuid;
    sessionUuid.value = uuidv4();

    /** Files data for upload params */
    const filesUpload: Array<UploadFileType> = dataStore.bucket.uploadFileList.map(file => {
      file.path = fileFolderPath(file.fullPath || '', wrapToDirectory);

      return {
        fileName: file.name,
        contentType: file.type || getExtension(file.name),
        path: file.path,
      };
    });

    dataStore.bucket.uploadFileList.forEach(file => {
      createFileProgress(file.id);
      updateFileStatus(file.id, FileUploadStatusValue.UPLOADING);
    });

    try {
      const params = {
        session_uuid: sessionUuid.value,
        files: filesUpload,
      };

      /** Upload files request */
      const fileRequests = await $api.post<FilesUploadRequestResponse>(
        endpoints.storageFilesUpload(bucketUuid.value),
        params
      );

      if (fileRequests.data) {
        uploadFilesToS3(fileRequests.data, wrapToDirectory);
      } else {
        /** Show warning message - zero files uploaded */
        message.warning($i18n.t('errror.fileUploadStopped'));
      }
    } catch (error) {
      dataStore.bucket.uploadFileList.forEach(file => {
        file.onError();
        updateFileStatus(file.id, FileUploadStatusValue.ERROR);
      });

      /** Show error message */
      message.error(userFriendlyMsg(error));
    }
  }

  function uploadFilesToS3(
    uploadFilesRequests: Array<FilesUploadRequestInterface>,
    wrapToDirectory: boolean
  ) {
    uploadFilesRequests.forEach(uploadFileRequest => {
      const file = dataStore.bucket.uploadFileList.find(
        file => file.name === uploadFileRequest.fileName && file.path === uploadFileRequest.path
      );
      if (file) {
        uploadFileToS3(file, uploadFileRequest, wrapToDirectory);
      } else {
        /** Show warning message - file not found by name */
        message.warning($i18n.t('errror.fileUploadMissing', { name: uploadFileRequest.fileName }));
      }
    });
  }

  function uploadFileToS3(
    file: FileListItemType,
    uploadFilesRequest: FilesUploadRequestInterface,
    wrapToDirectory: boolean
  ) {
    try {
      /** Upload file to S3 */
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadFilesRequest.url, true);
      xhr.onload = () => {
        file.onFinish();
        updateFileStatus(file.id, FileUploadStatusValue.FINISHED);
        updateFilePercentage(file.id, 100);
        uploadSessionEnd(sessionUuid.value, wrapToDirectory);
      };
      xhr.onerror = error => {
        file.onError();
        updateFileStatus(file.id, FileUploadStatusValue.ERROR);
        uploadSessionEnd(sessionUuid.value, wrapToDirectory);

        /** Show error message */
        message.error(userFriendlyMsg(error));
      };
      xhr.send(file.file);
    } catch (error) {
      file.onError();
      updateFileStatus(file.id, FileUploadStatusValue.ERROR);

      /** Show error message */
      message.error(userFriendlyMsg(error));
    }
  }

  /** Upload Session End  */
  async function uploadSessionEnd(sessionUuid: string, wrapToDirectory: boolean) {
    if (!allFilesFinished.value) {
      return;
    }
    try {
      const params: Record<string, string | number | boolean | null> = {
        directSync: config.public.ENV === AppEnv.LOCAL,
        wrapWithDirectory: wrapToDirectory,
        directoryPath: wrapToDirectory
          ? dataStore.getFolderPath + wrapperFolderPath(folderName.value)
          : null,
      };
      await $api.post<PasswordResetResponse>(
        endpoints.storageFileUpload(bucketUuid.value, sessionUuid),
        params
      );

      /** Unnecessary toast message
      if (resSessionEnd.data) {
        message.success($i18n.t('form.success.filesUploaded'));
      } */
    } catch (error) {
      message.error(userFriendlyMsg(error));
    }
    /** Refresh diretory content 
    await dataStore.fetchDirectoryContent(); */
  }

  /** Get folder path from fullPath */
  function fileFolderPath(fullPath: string, wrapToDirectory: boolean): string {
    const parts = fullPath.split('/').filter(p => p);
    const filePath = parts.length <= 1 ? '' : parts.slice(0, -1).join('/') + '/';

    return wrapToDirectory ? filePath : dataStore.getFolderPath + filePath;
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

  /** Update file property */
  function updateFilePercentage(fileId: string, percent: number) {
    dataStore.bucket.uploadFileList.forEach(item => {
      if (item.id === fileId) {
        item.percentage = percent;
      }
    });
  }

  /** Update file status */
  function updateFileStatus(fileId: string, status: FileUploadStatus) {
    dataStore.bucket.uploadFileList.forEach(item => {
      if (item.id === fileId) {
        item.status = status;

        if (status === FileUploadStatusValue.ERROR) {
          item.percentage = 0;
          clearInterval(item.progress);
        }
        if (status === FileUploadStatusValue.FINISHED) {
          /** Calculate upload speed */
          const timeDiff = Date.now() - item.timestamp;
          if (timeDiff > 0) {
            item.uploadSpeed = item.size / timeDiff;
          }

          /** Increase bucket size */
          if (dataStore.bucket.active?.size) {
            dataStore.bucket.active.size += item.size;
          } else {
            dataStore.bucket.active.size = item.size;
          }

          clearInterval(item.progress);
        }
      }
    });
  }

  /** Calculate file upload progress */
  function createFileProgress(fileId: string) {
    dataStore.bucket.uploadFileList.forEach(file => {
      if (file.id === fileId) {
        const timeFor1Percent = file.size / 100 / avgUploadSpeed.value;

        file.progress = setInterval(() => {
          if (file.percentage < 100) {
            file.percentage += 1;
          }
        }, timeFor1Percent);
      }
    });
  }

  return {
    uploadFiles,
    uploadFilesRequest,
    fileAlreadyOnFileList,
    allFilesFinished,
    allFilesSuccess,
    filesUploading,
    numOfUploadedFiles,
    folderName,
  };
}
