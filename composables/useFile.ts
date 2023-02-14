export default function useFile() {
  const bucketStore = useBucketStore();
  const fileStore = useFileStore();
  const downloading = ref<boolean>(false);

  /** Download file - get file details and download content from downloadLink */
  async function downloadFile(CID?: string | null) {
    if (!CID) {
      console.warn('MISSING File CID!');
      return;
    }
    try {
      if (!(CID in fileStore.items)) {
        fileStore.items[CID] = await fileStore.fetchFileDetails(CID);
      }
      const fileDetails: FileDetails = fileStore.items[CID].file;
      return download(fileDetails.link, fileDetails.name);
    } catch (error: any) {
      /** Show error message */
      window?.$message?.error(window?.$i18n?.t('error.fileDownload'));
    }
    return null;
  }

  /**
   * Download multiple files
   */
  async function downloadSelectedFiles() {
    if (bucketStore.folder.selectedItems.length === 0) {
      console.warn('No items selected');
      return;
    }

    const promises: Array<Promise<any>> = [];
    downloading.value = true;

    bucketStore.folder.selectedItems.forEach(async item => {
      const req = downloadFile(item.CID);
      promises.push(req);
      await req;
    });

    await Promise.all(promises).then(_ => {
      downloading.value = false;
    });
  }

  return {
    downloading,
    downloadFile,
    downloadSelectedFiles,
  };
}
