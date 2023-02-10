export default function useFile() {
  const fileStore = useFileStore();

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

  return {
    downloadFile,
  };
}
