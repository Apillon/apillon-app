import { defineStore } from 'pinia';

export const useReferralStore = defineStore('referral', {
  state: () => ({
    balance: 0,
    balance_all: 0,
    github_id: null as any,
    twitter_id: null as any,

    twitter_name: null as any,
    github_name: null as any,

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
  actions: {
    initReferral(data: ReferralInterface) {
      this.balance = data.balance;
      this.balance_all = data.balance_all;
      this.github_id = data.github_id;
      this.twitter_id = data.twitter_id;
      this.twitter_name = data.twitter_name;
      this.github_name = data.github_name;
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
  },
});
