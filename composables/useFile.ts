export default function useFile() {
  const bucketStore = useBucketStore();
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

  return {
    downloading,
    downloadFile,
    downloadSelectedFiles,
  };
}
