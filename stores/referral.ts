import { defineStore } from 'pinia';

export const useReferralStore = defineStore('referral', {
  state: () => ({
    balance: 0,
    github_id: null,
    twitter_id: null,

    id: 0,
    refCode: '',
    referred_id: null,
    shippingInfo: null,
    status: 0,
    tasks: [],
    termsAccepted: '',
    user_uuid: '',
  }),
  actions: {
    initReferral(data: any) {
      this.balance = data.balance;
      this.github_id = data.github_id;
      this.twitter_id = data.twitter_id;
      this.id = data.id;
      this.refCode = data.refCode;
      this.referred_id = data.referred_id;
      this.shippingInfo = data.shippingInfo;
      this.status = data.status;
      this.tasks = data.tasks;
      this.termsAccepted = data.termsAccepted;
      this.user_uuid = data.user_uuid;
    },
  },
});
