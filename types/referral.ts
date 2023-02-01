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
    github_name?: string;
    twitter_name?: string;
    refCode: string;
    referrals: Array<any>;
    referrer_id?: number;
    shippingInfo?: string;
    status: number;
    tasks: Array<any>;
    termsAccepted: string;
  }

  interface RewardsInterface {
    attributes: {
      name: string;
      id: number;
      options: string[];
      description: string;
      inputType: number;
    }[];
    description: string;
    id: number;
    imageUrl: string;
    maxOrderCount: number;
    orderCount: number;
    name: string;
    price: number;
    status: number;
    stock: number;
  }

  interface ReferralResponse extends GeneralResponse<ReferralInterface> {}
  interface ReferralRewardsResponse extends GeneralItemsResponse<RewardsInterface> {}
}
