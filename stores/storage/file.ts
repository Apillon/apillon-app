import { defineStore } from 'pinia';
import { AnyJson } from '@polkadot/types-codec/types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';

const bucketStore = useBucketStore();

export const useFileStore = defineStore('file', {
  state: () => ({
    crust: {} as Record<string, AnyJson>,
    items: {} as Record<string, FileDetailsInterface>,
    all: [] as Array<FileUploadInterface>,
    total: 0,
    trash: [] as Array<BucketItemInterface>,
  }),
  getters: {
    hasFileAll(state): boolean {
      return Array.isArray(state.all) && state.all.length > 0;
    },
    hasDeletedFiles(state): boolean {
      return Array.isArray(state.trash) && state.trash.length > 0;
    },
  },
  actions: {
    resetData() {
      this.items = {} as Record<string, FileDetailsInterface>;
      this.all = [] as Array<FileUploadInterface>;
      this.total = 0;
      this.trash = [] as Array<BucketItemInterface>;
    },
    /**
     * API calls
     */
    async fetchFileInfo(fileId: number) {
      try {
        const res = await $api.get<FolderResponse>(endpoints.file(fileId));

        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },

    async fetchFileDetails(fileUuidOrCID: string): Promise<FileDetailsInterface> {
      try {
        const url = endpoints.storageFileDetails(bucketStore.bucketUuid, fileUuidOrCID);
        const res = await $api.get<FileDetailsResponse>(url);

        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as FileDetailsInterface;
    },

    async fetchFileDetailsFromCrust(cid: string) {
      const api = new ApiPromise({
        provider: new WsProvider('wss://rpc.crust.network'),
        typesBundle: typesBundleForPolkadot,
      });

      await api.isReadyOrError;
      const fileInfo = await api.query.market.filesV2(cid);
      await api.disconnect();
      return fileInfo.toJSON();
    },
  },
});
