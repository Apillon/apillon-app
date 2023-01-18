import { defineStore } from 'pinia';

export const useReferralStore = defineStore('referral', {
  state: () => ({
    balance: 0,
    balance_all: 0,
    github_id: null as any,
    twitter_id: null as any,

    id: 0,
    refCode: '',
    referrals: [] as Array<any>,
    referrer_id: null as any,
    shippingInfo: null as any,
    status: 0,
    tasks: [] as Array<any>,
    termsAccepted: '',
    user_uuid: '',
  }),
  actions: {
    initReferral(data: ReferralInterface) {
      this.balance = data.balance;
      this.balance_all = data.balance_all;
      this.github_id = data.github_id;
      this.twitter_id = data.twitter_id;
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
  },
});
