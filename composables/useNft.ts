export default function useNft() {
  const collectionStore = useCollectionStore();

  /**
   * Validation
   */
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

  return {
    allImagesUploaded,
  };
}
