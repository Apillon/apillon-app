import { defineStore } from 'pinia';

export const useIpfsStore = defineStore('ipfs', {
  state: () => ({
    info: {} as IpfsInterface,
    loading: false,
  }),
  getters: {
    hasIpfs(state): boolean {
      return state.info && Object.keys(state.info).length > 0;
    },
  },
  actions: {
    resetData() {
      this.info = {} as IpfsInterface;
    },

    /**
     * Fetch wrappers
     */
    async getIpfsInfo(projectUuid: string): Promise<IpfsInterface> {
      if (!this.hasIpfs || isCacheExpired(LsCacheKeys.IPFS) || this.info.project_uuid !== projectUuid) {
        return await this.fetchIpfsInfo(projectUuid);
      }
      return this.info;
    },

    /**
     * API calls
     */
    async fetchIpfsInfo(project_uuid: string): Promise<IpfsInterface> {
      try {
        const res = await $api.get<IpfsResponse>(endpoints.ipfsInfo, {
          project_uuid,
        });

        this.info = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.IPFS, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.info = {} as IpfsInterface;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as IpfsInterface;
    },

    async fetchIpfsLink(project_uuid: string, cid: string, type: string): Promise<IpfsLink | null> {
      if (!cid || !project_uuid) return null;
      try {
        const res = await $api.get<IpfsLinkResponse>(endpoints.ipfsLink, {
          project_uuid,
          cid,
          type,
        });

        return res.data;
      } catch (error: any) {
        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },
  },
});
