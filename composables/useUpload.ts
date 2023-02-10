import { useMessage } from 'naive-ui';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';

export default function useUpload() {
  const $i18n = useI18n();
  const message = useMessage();
  const bucketStore = useBucketStore();
  const config = useRuntimeConfig();

  const BASE_UPLOAD_SPEED = 1024;
  const bucketUuid = ref<string>('');
  const sessionUuid = ref<string>('');
  const folderName = ref<string>('');
  const fileList = ref<Array<FileListItemType>>([]);
  const clearFileList = ref<boolean>(false);

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

  /** Check if all files are finished (status FINISHED or ERROR) */
  const allFilesFinished = computed<boolean>(() => {
    return !fileList.value.some(
      file =>
        file.status === FileUploadStatusValue.PENDING ||
        file.status === FileUploadStatusValue.UPLOADING
    );
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

  async function uploadFiles(
    uploadBucketUuid: string,
    uploadFileList: Array<FileListItemType>,
    wrapToDirectory: boolean = false,
    clearFileListOnFinish: boolean = false
  ) {
    sessionUuid.value = uuidv4();
    bucketUuid.value = uploadBucketUuid;
    fileList.value = uploadFileList;
    clearFileList.value = clearFileListOnFinish;

    /** Files data for upload params */
    const filesUpload: Array<UploadFileType> = fileList.value.map(file => {
      file.path = fileFolderPath(file.fullPath || '', wrapToDirectory);

      return {
        fileName: file.name,
        contentType: file.type || getExtension(file.name),
        path: file.path,
      };
    });

    fileList.value.forEach(file => {
      createFileProgress(file);
      updateFileStatus(file, FileUploadStatusValue.UPLOADING);
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
      fileList.value.forEach(file => {
        file.onError();
        updateFileStatus(file, FileUploadStatusValue.ERROR);
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
      const file = fileList.value.find(
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

  async function uploadFileToS3(
    file: FileListItemType,
    uploadFilesRequest: FilesUploadRequestInterface,
    wrapToDirectory: boolean
  ) {
    try {
      /** Upload file to S3 using fetch */
      const res = await fetch(uploadFilesRequest.url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: file.file,
      });

      if (res.status !== 200) {
        throw new Error('File upload error');
      }

      file.onFinish();
      file.percentage = 100;
      updateFileStatus(file, FileUploadStatusValue.FINISHED);
      uploadSessionEnd(sessionUuid.value, wrapToDirectory);
    } catch (error) {
      file.onError();
      updateFileStatus(file, FileUploadStatusValue.ERROR);
      uploadSessionEnd(sessionUuid.value, wrapToDirectory);

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
          ? bucketStore.getFolderPath + wrapperFolderPath(folderName.value)
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
      /** Refresh diretory content  */
      bucketStore.fetchDirectoryContent();
    }, 500);
  }

  /** Get folder path from fullPath */
  function fileFolderPath(fullPath: string, wrapToDirectory: boolean): string {
    const parts = fullPath.split('/').filter(p => p);
    const filePath = parts.length <= 1 ? '' : parts.slice(0, -1).join('/') + '/';

    return wrapToDirectory ? filePath : bucketStore.getFolderPath + filePath;
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

      clearInterval(file.progress);
    }
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
    folderName,
    allFilesFinished,
    numOfFinishedFiles: computed<number>(() => {
      return (
        fileList.value.filter(
          file =>
            file.status === FileUploadStatusValue.FINISHED ||
            file.status === FileUploadStatusValue.ERROR
        ).length || 0
      );
    }),
    numOfUploadedFiles: computed<number>(() => {
      return (
        fileList.value.filter(file => file.status !== FileUploadStatusValue.PENDING).length || 0
      );
    }),
    allFilesSuccess: computed<boolean>(() => {
      return !fileList.value.some(file => file.status !== FileUploadStatusValue.FINISHED);
    }),
    filesUploading: computed<boolean>(() => {
      return fileList.value.some(file => file.status === FileUploadStatusValue.UPLOADING);
    }),
  };
}
