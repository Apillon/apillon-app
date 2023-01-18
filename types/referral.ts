export {};
declare global {
  interface ReferralTask {
    id: number;
    name: string;
    activeFrom?: string;
    activeTo?: string;
    data?: any;
    description: string;
    maxCompleted?: any;
    realizations: Array<any>;
    reward: number;
    status: number;
    type: number;
  }
  interface ReferralInterface {
    id: number;
    user_uuid: string;
    userEmail: string;
    balance: number;
    balance_all: number;
    github_id?: string;
    twitter_id?: string;
    refCode: string;
    referrals: Array<any>;
    referrer_id?: number;
    shippingInfo?: string;
    status: number;
    tasks: Array<any>;
    termsAccepted: string;
  }

  interface ReferralResponse extends GeneralResponse<ReferralInterface> {}
  interface ServicesResponse extends GeneralItemsResponse<ServiceInterface> {}
}
