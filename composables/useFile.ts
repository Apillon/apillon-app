import { v4 as uuidv4 } from 'uuid';

export default function useFile() {
  const message = useMessage();
  const bucketStore = useBucketStore();
  const { generateIpfsLinks } = useUpload();

  const downloading = ref<boolean>(false);

  /** Download file - get file details and download content from downloadLink */
  function downloadFile(file?: BucketItemInterface | null) {
    if (file?.type === BucketItemType.DIRECTORY) {
      window?.$message?.warning(`Folder ${file?.name} can't be downloaded!`);
      return;
    } else if (!file?.link) {
      window?.$message?.warning(`${file?.name || 'File'} can't be downloaded!`);
      return;
    }
    try {
      return download(file.link, file.name);
    } catch (e: any) {
      console.error(e);
      /** Show error message */
      window?.$message?.error(window?.$i18n?.t('error.fileDownload'));
    }
    return null;
  }

  /**
   * Download multiple files
   */
  function downloadSelectedFiles() {
    if (bucketStore.folder.selectedItems.length === 0) {
      console.warn('No items selected');
      return;
    }
    downloading.value = true;

    bucketStore.folder.selectedItems.forEach(item => {
      downloadFile(item);
    });
    downloading.value = false;
  }

  async function uploadFileToIPFS(
    file: FileListItemType,
    bucketUuid: string,
    encryptedContent?: string
  ): Promise<FileInterface | null> {
    const sessionUuid = uuidv4();
    const data = {
      session_uuid: sessionUuid,
      files: [{ fileName: file.name }],
    };

    try {
      const uploadSession = await $api.post<FilesUploadRequestResponse>(endpoints.storageFilesUpload(bucketUuid), data);
      const uploadUrl = uploadSession.data.files[0];

      // Upload to S3
      await fetch(uploadUrl.url, {
        method: 'PUT',
        body: encryptedContent || file.file,
      });

      // End session
      await $api.post(endpoints.storageFileUpload(bucketUuid, sessionUuid));

      if (encryptedContent) {
        setTimeout(() => {
          message.success(t('computing.contract.encrypt.step2Info'), { duration: 5000 });
        }, 1000);
      }

      if (!encryptedContent) {
        const cids = {} as Record<string, UploadedFileInfo>;
        const buffer = await file.file?.arrayBuffer();
        if (buffer) {
          const calculatedCID = await calculateCID(Buffer.from(buffer), {
            cidVersion: 1,
          });
          cids[uploadUrl.file_uuid] = {
            CID: calculatedCID,
            link: null,
            name: uploadUrl.fileName,
            path: uploadUrl.path,
          };
        }
        await generateIpfsLinks(cids);
      }

      // Start pooling file
      return await getFile(bucketUuid, uploadUrl.file_uuid);
    } catch (error) {
      message.error(userFriendlyMsg(error));
    }
    return null;
  }

  async function getFile(bucketUuid: string, fileUuid: string): Promise<FileInterface> {
    return new Promise(function (resolve) {
      const getFileInterval = setInterval(async () => {
        const fileData = await getFilePoll(bucketUuid, fileUuid);

        if (fileData && (fileData?.CID || fileData?.CIDv1)) {
          clearInterval(getFileInterval);
          resolve(fileData);
        } else if (fileUuid in bucketStore.calculatedCids) {
          clearInterval(getFileInterval);
          resolve(Object.assign(fileData, bucketStore.calculatedCids[fileUuid]));
        }
      }, 2000);
    });
  }

  async function getFilePoll(bucketUuid: string, fileUuid: string): Promise<FileInterface> {
    const response = await $api.get<FileDetailsResponse>(endpoints.storageFileDetails(bucketUuid, fileUuid));
    return response.data;
  }

  return {
    downloading,
    downloadFile,
    downloadSelectedFiles,
    getFile,
    uploadFileToIPFS,
  };
}
