import { defineStore } from 'pinia';

export const useReferralStore = defineStore('referral', {
  state: () => ({
    airdrop: {} as AirdropInterface,
    balance: 0,
    balance_all: 0,

    id: 0,
    refCode: '',
    referrals: [] as Array<any>,
    referrer_id: null as any,
    shippingInfo: null as any,
    status: 0,
    tasks: [] as Array<any>,
    termsAccepted: '',
    user_uuid: '',
    loading: false,
  }),
  getters: {
    hasAirdrop(state) {
      return state.airdrop && state.airdrop.status;
    },
  },
  actions: {
    initReferral(data: ReferralInterface) {
      this.balance = data.balance;
      this.balance_all = data.balance_all;
      this.id = data.id;
      this.refCode = data.refCode;
      this.referrals = data.referrals;
      this.referrer_id = data.referrer_id;
      this.shippingInfo = data.shippingInfo;
      this.status = data.status;
      this.tasks = data.tasks;
      this.termsAccepted = data.termsAccepted;
      this.user_uuid = data.user_uuid;
    },

    async getReferral() {
      if (!this.id || isCacheExpired(LsCacheKeys.REFERRAL)) {
        await this.fetchReferral();
      }
    },

    async getAirdrop() {
      if (!this.hasAirdrop || isCacheExpired(LsCacheKeys.REFERRAL_AIRDROP)) {
        await this.fetchAirdrop();
      }
    },

    async fetchReferral() {
      this.loading = true;
      try {
        const res = await $api.get<ReferralResponse>(endpoints.referral);
        // If there is no error -> user already accepted terms & conditions
        this.initReferral(res.data);

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.REFERRAL, Date.now().toString());
      } catch (e) {
        console.warn(e);
      }
      this.loading = false;
    },

    async fetchAirdrop() {
      this.loading = true;
      try {
        const res = await $api.get<AirdropResponse>(endpoints.airdropTasks);
        this.airdrop = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.REFERRAL_AIRDROP, Date.now().toString());
      } catch (e) {
        console.warn(e);
      }
      this.loading = false;
    },
  },
});
